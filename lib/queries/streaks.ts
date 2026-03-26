import { useQuery } from "@tanstack/react-query";
import { streaksService } from "../services/streaks";

export const STREAKS_QUERY_KEY = ["streaks"] as const;
export const STREAKS_ACTIVITY_QUERY_KEY = ["streaks", "activity"] as const;

export const useStreak = () => {
  return useQuery({
    queryKey: STREAKS_QUERY_KEY,
    queryFn: streaksService.getStreak,
  });
};

export const useStreakActivity = (days = 84) => {
  return useQuery({
    queryKey: [...STREAKS_ACTIVITY_QUERY_KEY, days] as const,
    queryFn: () => streaksService.getActivity(days),
  });
};
