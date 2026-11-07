import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SessionState = {
  code: string | null;
  playerId: number | null;
  nickname: string | null;
};

const STORAGE_KEY = "desperado.session";
const emptySession: SessionState = { code: null, playerId: null, nickname: null };

function loadSession(): SessionState {
  if (typeof window === "undefined") return emptySession; // build-time render safety
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionState) : emptySession;
  } catch {
    return emptySession;
  }
}

function saveSession(state: SessionState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage can be unavailable (private mode); ignore */
  }
}

const sessionSlice = createSlice({
  name: "session",
  initialState: loadSession,
  reducers: {
    joinedRoom(state, action: PayloadAction<{ code: string; playerId: number; nickname: string }>) {
      state.code = action.payload.code;
      state.playerId = action.payload.playerId;
      state.nickname = action.payload.nickname;
      saveSession(state);
    },
    leftRoom() {
      saveSession(emptySession);
      return emptySession;
    },
  },
});

export const { joinedRoom, leftRoom } = sessionSlice.actions;
export default sessionSlice.reducer;