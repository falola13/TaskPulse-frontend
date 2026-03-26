import api from "../api";
import type {
  GoalResponse,
  UpsertGoalPayload,
  WeeklySummaryResponse,
} from "../types/goals";

export const goalsService = {
  getGoal: async () => {
    const { data } = await api.get<GoalResponse>("goals");
    return data;
  },
  upsertGoal: async (body: UpsertGoalPayload) => {
    const { data } = await api.put<GoalResponse>("goals", body);
    return data;
  },
  getWeeklySummary: async () => {
    const { data } = await api.get<WeeklySummaryResponse>("goals/weekly-summary");
    return data;
  },
};
