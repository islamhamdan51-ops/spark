import { RoomState, Player, PlayerAnswer, RoomStatus, ActivityRound } from "@/types";
import { ACTIVITIES } from "@/data/activities";
import { createSimulatedPlayers, simulateRoundAnswers } from "./demo-engine";
import { sounds } from "./sound";
import {
  isFirebaseConfigured,
  subscribeToFirebaseRoom,
  writeFirebaseRoomState,
  updateFirebaseRoom,
  fetchFirebaseRoom,
} from "./firebase";

type RoomListener = (state: RoomState) => void;

class RoomManager {
  private rooms: Map<string, RoomState> = new Map();
  private listeners: Map<string, Set<RoomListener>> = new Map();
  private firebaseUnsubscribers: Map<string, () => void> = new Map();
  private pollIntervals: Map<string, NodeJS.Timeout> = new Map();
  private eventSources: Map<string, EventSource> = new Map();
  private channels: Map<string, BroadcastChannel> = new Map();
  private cancelSimAnswers: (() => void) | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Cross-tab storage fallback sync
      window.addEventListener("storage", (e) => {
        if (e.key && e.key.startsWith("spark_room_state_")) {
          const code = e.key.replace("spark_room_state_", "");
          if (e.newValue) {
            try {
              const state = JSON.parse(e.newValue) as RoomState;
              this.applyIncomingState(code, state);
            } catch {}
          }
        }
      });
    }
  }

  private applyIncomingState(code: string, incoming: RoomState) {
    if (!incoming || incoming.code !== code) return;
    const current = this.rooms.get(code);

    if (current) {
      // 1. Strict Monotonic Version Guarantee: NEVER allow an older state to overwrite a newer state!
      if (
        current.version !== undefined &&
        incoming.version !== undefined &&
        incoming.version < current.version
      ) {
        return;
      }

      // 2. Redundancy Guard: If identical version and no actual state changes, skip re-renders
      if (
        current.version !== undefined &&
        incoming.version !== undefined &&
        incoming.version === current.version &&
        incoming.status === current.status &&
        incoming.currentRoundIndex === current.currentRoundIndex &&
        (incoming.players?.length || 0) === (current.players?.length || 0) &&
        (incoming.answers?.length || 0) === (current.answers?.length || 0)
      ) {
        return;
      }

      // 3. Answer Protection: If the current client has submitted answers in the active round
      // that the incoming server state doesn't have yet (due to replication delay or in-flight poll),
      // merge the answers instead of erasing them!
      if (
        incoming.status === "PLAYING_ROUND" &&
        current.status === "PLAYING_ROUND" &&
        incoming.currentRoundIndex === current.currentRoundIndex &&
        current.answers &&
        current.answers.length > 0
      ) {
        const mergedAnswers = [...(incoming.answers || [])];
        const currentSuffix = `-round-${(incoming.currentRoundIndex || 0) + 1}`;
        for (const localAns of current.answers) {
          const exists = mergedAnswers.some(
            (inAns) =>
              inAns.playerId === localAns.playerId &&
              (inAns.roundId === localAns.roundId ||
                (inAns.roundId.endsWith(currentSuffix) && localAns.roundId.endsWith(currentSuffix)))
          );
          if (!exists) {
            mergedAnswers.push(localAns);
          }
        }
        incoming.answers = mergedAnswers;
      }
    }

    this.rooms.set(code, incoming);
    this.notifyListeners(code, incoming);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`spark_room_state_${code}`, JSON.stringify(incoming));
      } catch {}
    }
  }

  private getChannel(code: string): BroadcastChannel | null {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
    if (!this.channels.has(code)) {
      const ch = new BroadcastChannel(`spark_channel_${code}`);
      ch.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === "SYNC_STATE") {
          const state = event.data.state as RoomState;
          this.applyIncomingState(code, state);
        } else if (event.data.type === "NEW_ANSWER") {
          const answer = event.data.answer as PlayerAnswer;
          const current = this.rooms.get(code);
          if (current) {
            const exists = current.answers.some(
              (a) => a.playerId === answer.playerId && a.roundId === answer.roundId
            );
            if (!exists) {
              let updatedPlayers = current.players;
              if (answer.pointsAwarded && answer.pointsAwarded > 0) {
                updatedPlayers = current.players.map((p) =>
                  p.id === answer.playerId
                    ? { ...p, score: p.score + (answer.pointsAwarded || 0) }
                    : p
                );
              }
              const updated: RoomState = {
                ...current,
                answers: [...current.answers, answer],
                players: updatedPlayers,
                lastUpdatedAt: Date.now(),
              };
              this.rooms.set(code, updated);
              this.notifyListeners(code, updated);
            }
          }
        }
      };
      this.channels.set(code, ch);
    }
    return this.channels.get(code) || null;
  }

  private persistAndBroadcast(code: string, state: RoomState) {
    state.lastUpdatedAt = Date.now();
    state.version = (state.version || 0) + 1;
    this.rooms.set(code, state);

    // 1. Sync to Firebase Realtime Database if configured
    if (isFirebaseConfigured() && !state.isDemo) {
      writeFirebaseRoomState(code, state).catch(() => {});
    }

    // 2. Sync to Server API (ensures cross-device sync)
    if (typeof window !== "undefined" && !state.isDemo) {
      fetch(`/api/rooms/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(state),
      }).catch(() => {});
    }

    // 3. Local fallback sync
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`spark_room_state_${code}`, JSON.stringify(state));
      } catch {}
    }
    const ch = this.getChannel(code);
    if (ch) {
      ch.postMessage({ type: "SYNC_STATE", state });
    }
    this.notifyListeners(code, state);
  }

  public getLocalRoom(code: string): RoomState | null {
    let existing = this.rooms.get(code);
    if (!existing && typeof window !== "undefined") {
      const saved = localStorage.getItem(`spark_room_state_${code}`);
      if (saved) {
        try {
          existing = JSON.parse(saved);
          if (existing) this.rooms.set(code, existing);
        } catch {}
      }
    }
    return existing || null;
  }

  public getOrCreateRoom(code: string, activitySlug: string = "this-or-that", isDemo: boolean = false): RoomState {
    let existing = this.getLocalRoom(code);

    if (!existing) {
      const act = ACTIVITIES.find((a) => a.slug === activitySlug || a.id === activitySlug) || ACTIVITIES[0];
      const initialPlayers = isDemo ? createSimulatedPlayers() : [];
      const newRoom: RoomState = {
        code,
        activityId: act.id,
        activitySlug: act.slug,
        status: "LOBBY",
        currentRoundIndex: 0,
        roundTimer: act.rounds?.[0]?.timeLimit || 15,
        players: initialPlayers,
        answers: [],
        teams: [],
        isTeamMode: false,
        isDemo,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        version: 1,
        soundEnabled: true,
      };

      this.persistAndBroadcast(code, newRoom);
      return newRoom;
    }

    return existing;
  }

  public subscribe(code: string, listener: RoomListener): () => void {
    if (!this.listeners.has(code)) {
      this.listeners.set(code, new Set());
    }
    this.listeners.get(code)!.add(listener);
    this.getChannel(code);

    let current = this.getLocalRoom(code);
    if (current) {
      listener(current);
    }

    // 1. Immediate fetch from server with anti-cache query
    if (typeof window !== "undefined" && !current?.isDemo) {
      fetch(`/api/rooms/${code}?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.room) {
            this.applyIncomingState(code, data.room);
          }
        })
        .catch(() => {});
    }

    // 2. Firebase Realtime updates if configured
    if (isFirebaseConfigured() && !this.firebaseUnsubscribers.has(code) && !current?.isDemo) {
      const unsub = subscribeToFirebaseRoom(code, (remoteRoom) => {
        if (remoteRoom) {
          this.applyIncomingState(code, remoteRoom);
        }
      });
      this.firebaseUnsubscribers.set(code, unsub);
    }

    // 3. Server-Sent Events (SSE) for instantaneous zero-latency sync
    if (
      typeof window !== "undefined" &&
      typeof EventSource !== "undefined" &&
      !current?.isDemo &&
      !this.eventSources.has(code)
    ) {
      try {
        const es = new EventSource(`/api/rooms/${code}/stream`);
        es.onmessage = (event) => {
          if (!event.data) return;
          try {
            const incoming = JSON.parse(event.data) as RoomState;
            if (incoming && incoming.code === code) {
              this.applyIncomingState(code, incoming);
            }
          } catch {}
        };
        es.onerror = () => {
          // SSE will auto-reconnect, and polling fallback below guarantees delivery
        };
        this.eventSources.set(code, es);
      } catch {}
    }

    // 4. Fast Cross-device Server Polling fallback (350ms) to beat mobile proxy latency
    if (typeof window !== "undefined" && !current?.isDemo && !this.pollIntervals.has(code)) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/rooms/${code}?_t=${Date.now()}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.room) {
              this.applyIncomingState(code, data.room);
            }
          }
        } catch {}
      }, 500);

      this.pollIntervals.set(code, interval);
    }

    return () => {
      this.listeners.get(code)?.delete(listener);
      if (this.listeners.get(code)?.size === 0) {
        const unsub = this.firebaseUnsubscribers.get(code);
        if (unsub) {
          unsub();
          this.firebaseUnsubscribers.delete(code);
        }

        const es = this.eventSources.get(code);
        if (es) {
          es.close();
          this.eventSources.delete(code);
        }

        const poll = this.pollIntervals.get(code);
        if (poll) {
          clearInterval(poll);
          this.pollIntervals.delete(code);
        }
      }
    };
  }

  private notifyListeners(code: string, state: RoomState) {
    this.listeners.get(code)?.forEach((fn) => fn(state));
  }

  // Room Actions
  public async addPlayer(
    code: string,
    nickname: string,
    avatar: string
  ): Promise<{ success: boolean; player?: Player; error?: string }> {
    const trimmed = nickname.trim();
    if (!trimmed) {
      return { success: false, error: "الرجاء إدخال اسم مستعار" };
    }

    // 1. Try Server API join first (vital for mobile participants joining Vercel host!)
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/rooms/${code}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: trimmed, avatar: avatar || "⚡" }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.player) {
            if (data.room) {
              this.rooms.set(code, data.room);
              this.notifyListeners(code, data.room);
              try {
                localStorage.setItem(`spark_room_state_${code}`, JSON.stringify(data.room));
              } catch {}
            }
            sounds.playJoin();
            return { success: true, player: data.player };
          }
        }
      } catch (err) {
        console.warn("Server API addPlayer warning, falling back to local/firebase", err);
      }
    }

    // 2. If room not in local memory, check Firebase
    let room = this.rooms.get(code);
    if (!room && isFirebaseConfigured()) {
      const remote = await fetchFirebaseRoom(code);
      if (remote) {
        this.rooms.set(code, remote);
        room = remote;
      }
    }

    // 3. Check localStorage as local resort
    if (!room && typeof window !== "undefined") {
      const saved = localStorage.getItem(`spark_room_state_${code}`);
      if (saved) {
        try {
          room = JSON.parse(saved);
          if (room) this.rooms.set(code, room);
        } catch {}
      }
    }

    if (!room) {
      return {
        success: false,
        error: "الغرفة غير موجودة أو لم تبدأ بعد. تأكد من أن المضيف قد فتح الغرفة على الشاشة.",
      };
    }

    const exists = room.players.some((p) => p.nickname.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      return { success: false, error: "هذا الاسم مستخدم بالفعل داخل الغرفة، اختر اسماً آخر!" };
    }

    const newPlayer: Player = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nickname: trimmed,
      avatar: avatar || "⚡",
      joinedAt: Date.now(),
      score: 0,
    };

    sounds.playJoin();
    const updated: RoomState = {
      ...room,
      players: [...room.players, newPlayer],
    };

    this.persistAndBroadcast(code, updated);
    return { success: true, player: newPlayer };
  }

  public removePlayer(code: string, playerId: string) {
    const room = this.rooms.get(code);
    if (!room) return;
    const updated: RoomState = {
      ...room,
      players: room.players.filter((p) => p.id !== playerId),
      answers: room.answers.filter((a) => a.playerId !== playerId),
    };
    this.persistAndBroadcast(code, updated);
  }

  public startCountdown(code: string) {
    const room = this.rooms.get(code);
    if (!room) return;

    sounds.playTick(false);
    const updated: RoomState = {
      ...room,
      status: "COUNTDOWN",
      currentRoundIndex: 0,
      roundStartTime: Date.now(),
      lastUpdatedAt: Date.now(),
      version: (room.version || 0) + 1,
      answers: [],
    };
    this.persistAndBroadcast(code, updated);
  }

  public launchRound(code: string, roundIndex: number = 0) {
    const room = this.rooms.get(code);
    if (!room) return;

    const act = ACTIVITIES.find((a) => a.slug === room.activitySlug) || ACTIVITIES[0];
    const round = act.rounds?.[roundIndex];
    const timeLimit = round?.timeLimit || 15;

    sounds.playRoundStart();
    const updated: RoomState = {
      ...room,
      status: "PLAYING_ROUND",
      currentRoundIndex: roundIndex,
      roundTimer: timeLimit,
      roundStartTime: Date.now(),
      lastUpdatedAt: Date.now(),
      version: (room.version || 0) + 1,
      answers: room.answers.filter((a) => a.roundId !== round?.id),
    };
    this.persistAndBroadcast(code, updated);

    // Simulate answers if demo room
    if (room.isDemo && round) {
      if (this.cancelSimAnswers) this.cancelSimAnswers();
      this.cancelSimAnswers = simulateRoundAnswers(round, room.players, (ans) => {
        this.submitAnswer(code, ans);
      });
    }
  }

  public submitAnswer(code: string, answer: PlayerAnswer) {
    let room = this.rooms.get(code) || this.getLocalRoom(code);

    if (room) {
      // Prevent duplicate submission for same round
      const currentSuffix = `-round-${(room.currentRoundIndex || 0) + 1}`;
      const existingIdx = room.answers.findIndex((a) => {
        if (a.playerId !== answer.playerId) return false;
        if (a.roundId === answer.roundId) return true;
        if (a.roundId.endsWith(currentSuffix) && answer.roundId.endsWith(currentSuffix)) return true;
        if (
          a.roundId === `round-${(room.currentRoundIndex || 0) + 1}` ||
          answer.roundId === `round-${(room.currentRoundIndex || 0) + 1}`
        ) {
          return true;
        }
        return false;
      });

      sounds.playSelect();

      // Calculate score if points awarded
      let updatedPlayers = room.players;
      if (answer.pointsAwarded && answer.pointsAwarded > 0) {
        updatedPlayers = room.players.map((p) => {
          if (p.id === answer.playerId) {
            return { ...p, score: p.score + (answer.pointsAwarded || 0) };
          }
          return p;
        });
      }

      let updatedAnswers: PlayerAnswer[];
      if (existingIdx >= 0) {
        updatedAnswers = [...room.answers];
        updatedAnswers[existingIdx] = answer;
      } else {
        updatedAnswers = [...room.answers, answer];
      }

      const updated: RoomState = {
        ...room,
        players: updatedPlayers,
        answers: updatedAnswers,
        lastUpdatedAt: Date.now(),
        version: (room.version || 0) + 1,
      };

      // Update local memory and notify listeners
      this.rooms.set(code, updated);
      this.notifyListeners(code, updated);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`spark_room_state_${code}`, JSON.stringify(updated));
        } catch {}
      }

      // Broadcast NEW_ANSWER to cross-tab Host without wiping room status
      const ch = this.getChannel(code);
      if (ch) {
        ch.postMessage({ type: "NEW_ANSWER", answer });
      }
    } else {
      sounds.playSelect();
    }

    // Sync answer to server API with automatic retries to beat mobile lag/loss
    if (typeof window !== "undefined" && !room?.isDemo) {
      const sendWithRetry = async (attemptsLeft = 3) => {
        try {
          const res = await fetch(`/api/rooms/${code}/answers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            body: JSON.stringify(answer),
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.room) {
              this.applyIncomingState(code, data.room);
            }
          } else if (attemptsLeft > 0) {
            setTimeout(() => sendWithRetry(attemptsLeft - 1), 600);
          }
        } catch (err) {
          if (attemptsLeft > 0) {
            setTimeout(() => sendWithRetry(attemptsLeft - 1), 600);
          }
        }
      };
      sendWithRetry();
    }
  }

  public showRoundResults(code: string) {
    const room = this.rooms.get(code);
    if (!room) return;

    sounds.playSuccess();
    const updated: RoomState = {
      ...room,
      status: "ROUND_RESULTS",
      lastUpdatedAt: Date.now(),
      version: (room.version || 0) + 1,
    };
    this.persistAndBroadcast(code, updated);
  }

  public nextRoundOrFinish(code: string) {
    const room = this.rooms.get(code);
    if (!room) return;

    const act = ACTIVITIES.find((a) => a.slug === room.activitySlug) || ACTIVITIES[0];
    const totalRounds = act.rounds?.length || 1;
    const nextIndex = room.currentRoundIndex + 1;

    if (nextIndex < totalRounds) {
      this.launchRound(code, nextIndex);
    } else {
      sounds.playCelebration();
      const updated: RoomState = {
        ...room,
        status: "FINAL_CELEBRATION",
        lastUpdatedAt: Date.now(),
        version: (room.version || 0) + 1,
      };
      this.persistAndBroadcast(code, updated);
    }
  }

  public resetRoom(code: string) {
    const room = this.rooms.get(code);
    if (!room) return;

    const act = ACTIVITIES.find((a) => a.slug === room.activitySlug) || ACTIVITIES[0];
    const updated: RoomState = {
      ...room,
      status: "LOBBY",
      currentRoundIndex: 0,
      roundTimer: act.rounds?.[0]?.timeLimit || 15,
      answers: [],
      players: room.players.map((p) => ({ ...p, score: 0 })),
      lastUpdatedAt: Date.now(),
      version: (room.version || 0) + 1,
    };
    this.persistAndBroadcast(code, updated);
  }
}

export const roomManager = new RoomManager();
