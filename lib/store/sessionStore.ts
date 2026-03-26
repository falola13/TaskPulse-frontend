import { create } from "zustand";

export type SessionType = "pulse" | "short_break" | "long_break";

interface SessionState {
  selectedType: SessionType;
  selectedTaskId: string | null;
  setSelectedType: (type: SessionType) => void;
  setSelectedTaskId: (taskId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  selectedType: "pulse",
  selectedTaskId: null,
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
}));
