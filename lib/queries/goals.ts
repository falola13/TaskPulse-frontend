import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "../services/goals";
import type { UpsertGoalPayload } from "../types/goals";

export const GOALS_QUERY_KEY = ["goals"] as const;
export const GOALS_WEEKLY_SUMMARY_QUERY_KEY = ["goals", "weekly-summary"] as const;

export const useGoal = () => {
  return useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: goalsService.getGoal,
  });
};

export const useUpsertGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertGoalPayload) => goalsService.upsertGoal(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GOALS_WEEKLY_SUMMARY_QUERY_KEY });
    },
  });
};

export const useWeeklyGoalSummary = () => {
  return useQuery({
    queryKey: GOALS_WEEKLY_SUMMARY_QUERY_KEY,
    queryFn: goalsService.getWeeklySummary,
  });
};
