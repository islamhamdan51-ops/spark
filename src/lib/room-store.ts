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
              this.rooms.set(code, state);
              this.notifyListeners(code, state);
            } catch {}
          }
        }
      });
    }
  }

  private getChannel(code: string): BroadcastChannel | null {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
    if (!this.channels.has(code)) {
      const ch = new BroadcastChannel(`spark_channel_${code}`);
      ch.onmessage = (event) => {
        if (event.data && event.data.type === "SYNC_STATE") {
          const state = event.data.state as RoomState;
          this.rooms.set(code, state);
          this.notifyListeners(code, state);
        }
      };
      this.channels.set(code, ch);
    }
    return this.channels.get(code) || null;
  }

  private persistAndBroadcast(code: string, state: RoomState) {
    this.rooms.set(code, state);

    // 1. Sync to Firebase Realtime Database if configured
    if (isFirebaseConfigured() && !state.isDemo) {
      writeFirebaseRoomState(code, state).catch(() => {});
    }

    // 2. Local fallback sync
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

  public getOrCreateRoom(code: string, activitySlug: string = "this-or-that", isDemo: boolean = false): RoomState {
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

    const current = this.rooms.get(code);
    if (current) {
      listener(current);
    }

    // Subscribe to Firebase Realtime updates for live multiplayer
    if (isFirebaseConfigured() && !this.firebaseUnsubscribers.has(code) && !current?.isDemo) {
      const unsub = subscribeToFirebaseRoom(code, (remoteRoom) => {
        if (remoteRoom) {
          this.rooms.set(code, remoteRoom);
          this.notifyListeners(code, remoteRoom);
        }
      });
      this.firebaseUnsubscribers.set(code, unsub);
    }

    return () => {
      this.listeners.get(code)?.delete(listener);
      if (this.listeners.get(code)?.size === 0) {
        const unsub = this.firebaseUnsubscribers.get(code);
        if (unsub) {
          unsub();
          this.firebaseUnsubscribers.delete(code);
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
    let room = this.rooms.get(code);

    // If room not in local memory, check Firebase
    if (!room && isFirebaseConfigured()) {
      const remote = await fetchFirebaseRoom(code);
      if (remote) {
        this.rooms.set(code, remote);
        room = remote;
      }
    }

    if (!room) {
      // Check localStorage as last local resort
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`spark_room_state_${code}`);
        if (saved) {
          try {
            room = JSON.parse(saved);
            if (room) this.rooms.set(code, room);
          } catch {}
        }
      }
    }

    if (!room) {
      return { success: false, error: "الغرفة غير موجودة أو لم تبدأ بعد. تأكد من الرمز." };
    }

    const trimmed = nickname.trim();
    if (!trimmed) {
      return { success: false, error: "الرجاء إدخال اسم مستعار" };
    }

    const exists = room.players.some((p) => p.nickname.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      return { success: false, error: "هذا الاسم مستخدم بالفعل داخل الغرفة، اختر اسماً آخر!" };
    }

    const newPlayer: Player = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nickname: trimmed,
      avatar,
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
      answers: room.answers.filter((a) => a.roundId !== round?.id),
    };
    this.persistAndBroadcast(code, updated);

    // If demo mode, start realistic answer simulation
    if (room.isDemo && round) {
      if (this.cancelSimAnswers) {
        this.cancelSimAnswers();
      }
      this.cancelSimAnswers = simulateRoundAnswers(round, room.players, (ans) => {
        this.submitAnswer(code, ans);
      });
    }
  }

  public submitAnswer(code: string, answer: PlayerAnswer) {
    const room = this.rooms.get(code);
    if (!room) return;

    // Prevent duplicate submission for same round
    const existingIdx = room.answers.findIndex(
      (a) => a.playerId === answer.playerId && a.roundId === answer.roundId
    );
    if (existingIdx >= 0) return;

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

    const updatedAnswers = [...room.answers, answer];
    const updated: RoomState = {
      ...room,
      players: updatedPlayers,
      answers: updatedAnswers,
    };

    // If all players answered, automatically show results
    const currentRound = ACTIVITIES.find((a) => a.slug === room.activitySlug)?.rounds?.[room.currentRoundIndex];
    if (
      currentRound &&
      room.players.length > 0 &&
      updatedAnswers.filter((a) => a.roundId === currentRound.id).length >= room.players.length
    ) {
      updated.status = "ROUND_RESULTS";
      sounds.playSuccess();
    }

    this.persistAndBroadcast(code, updated);
  }

  public showRoundResults(code: string) {
    const room = this.rooms.get(code);
    if (!room) return;

    sounds.playSuccess();
    const updated: RoomState = {
      ...room,
      status: "ROUND_RESULTS",
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
    };
    this.persistAndBroadcast(code, updated);
  }
}

export const roomManager = new RoomManager();
