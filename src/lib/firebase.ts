// Firebase Realtime Database Client for SPARK V2.0
// Pure isolation: Dedicated for SPARK live session state (rooms, players, answers, timers)
// Seamless fallback: If credentials not yet configured, gracefully falls back to local sync & simulation

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, update, onValue, off, Database, get } from "firebase/database";
import { RoomState } from "@/types";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.databaseURL &&
    firebaseConfig.databaseURL.startsWith("https://") &&
    firebaseConfig.projectId
  );
}

let app: FirebaseApp | null = null;
let db: Database | null = null;

export function getSparkDatabase(): Database | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;

  try {
    if (!app) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    if (!db && app) {
      db = getDatabase(app);
    }
    return db;
  } catch (error) {
    console.warn("SPARK Firebase Realtime DB init warning:", error);
    return null;
  }
}

// ----------------------------------------------------
// Typed Realtime Database Operations
// ----------------------------------------------------

/**
 * Subscribe to realtime room updates
 */
export function subscribeToFirebaseRoom(
  roomCode: string,
  onUpdate: (room: RoomState | null) => void
): () => void {
  const database = getSparkDatabase();
  if (!database) return () => {};

  const roomRef = ref(database, `rooms/${roomCode}`);
  
  const listener = onValue(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val() as RoomState;
        // Normalize arrays if Firebase converted empty/sparse arrays to undefined
        if (!val.players) val.players = [];
        if (!val.answers) val.answers = [];
        if (!val.teams) val.teams = [];
        onUpdate(val);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn("Firebase onValue subscription warning:", err);
    }
  );

  return () => {
    try {
      off(roomRef, "value", listener);
    } catch {}
  };
}

/**
 * Write or update full room state to Firebase
 */
export async function writeFirebaseRoomState(roomCode: string, state: RoomState): Promise<boolean> {
  const database = getSparkDatabase();
  if (!database) return false;

  try {
    const roomRef = ref(database, `rooms/${roomCode}`);
    await set(roomRef, {
      ...state,
      lastUpdatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn("Failed to write room state to Firebase:", err);
    return false;
  }
}

/**
 * Update partial room state (e.g. status, timer, currentRound)
 */
export async function updateFirebaseRoom(
  roomCode: string,
  partial: Partial<RoomState>
): Promise<boolean> {
  const database = getSparkDatabase();
  if (!database) return false;

  try {
    const roomRef = ref(database, `rooms/${roomCode}`);
    await update(roomRef, {
      ...partial,
      lastUpdatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn("Failed to update room in Firebase:", err);
    return false;
  }
}

/**
 * Fetch one-time snapshot of room
 */
export async function fetchFirebaseRoom(roomCode: string): Promise<RoomState | null> {
  const database = getSparkDatabase();
  if (!database) return null;

  try {
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snap = await get(roomRef);
    if (snap.exists()) {
      const val = snap.val() as RoomState;
      if (!val.players) val.players = [];
      if (!val.answers) val.answers = [];
      if (!val.teams) val.teams = [];
      return val;
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch room from Firebase:", err);
    return null;
  }
}
