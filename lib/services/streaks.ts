import api from "../api";
import type { StreakActivityResponse, StreakResponse } from "../types/streaks";

export const streaksService = {
  getStreak: async () => {
    const { data } = await api.get<StreakResponse>("streaks");
    return data;
  },
  getActivity: async (days = 84) => {
    const { data } = await api.get<StreakActivityResponse>("streaks/activity", {
      params: { days },
    });
    return data;
  },
};
