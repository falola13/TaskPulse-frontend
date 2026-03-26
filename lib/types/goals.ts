export type GoalProgress = {
  id: string;
  userId: string;
  dailySessionTarget: number;
  dailyFocusTarget: number;
  weeklyFocusTarget: number;
  todayCompletedSessions: number;
  todayFocusedMinutes: number;
  weekFocusedMinutes: number;
  dailyFocusProgressPercent: number;
  weeklyFocusProgressPercent: number;
};

export type GoalResponse = {
  message: string;
  data: GoalProgress;
};

export type UpsertGoalPayload = {
  dailySessionTarget: number;
  dailyFocusTarget: number;
  weeklyFocusTarget: number;
};

export type WeeklySummaryDay = {
  date: string;
  focusedMinutes: number;
  sessionsCount: number;
};

export type WeeklySummaryData = {
  days: WeeklySummaryDay[];
  dailyFocusTarget: number;
  weeklyFocusTarget: number;
};

export type WeeklySummaryResponse = {
  message: string;
  data: WeeklySummaryData;
};
