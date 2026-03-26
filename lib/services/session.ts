import axios from "axios";
import api from "../api";

interface Session {
  id: number;
  userId: string;
  type: "pulse" | "short_break" | "long_break";
  startTime: string;
  endTime: Date | null;
  duration: string | number | null;
  expectedDuration: number;
  taskId: string | null;
}

interface HistoryResponseApi {
  message: string;
  data: Session[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const NO_SESSION_RESPONSE = { data: null };

export const sessionService = {
  startSession: async ({
    type,
    taskId,
  }: {
    type: "pulse" | "short_break" | "long_break";
    taskId?: string;
  }) => api.post("focus-session/start", { type, taskId }),

  endSession: async (id: number) => api.patch(`focus-session/${id}/end`),

  getCurrentSession: async () => {
    try {
      return await api.get("focus-session/current");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return NO_SESSION_RESPONSE;
      }
      throw error;
    }
  },

  getSessionHistory: async ({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }) =>
    api.get<HistoryResponseApi>("focus-session/history", {
      params: { page, limit },
    }),
};
