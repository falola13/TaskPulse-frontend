export type StreakData = {
  currentStreakDays: number;
  longestStreakDays: number;
  totalActiveDays: number;
  activeToday: boolean;
  lastActiveDate: string | null;
};

export type StreakResponse = {
  message: string;
  data: StreakData;
};

export type StreakActivityDay = {
  date: string;
  count: number;
};

export type StreakActivityData = {
  days: StreakActivityDay[];
};

export type StreakActivityResponse = {
  message: string;
  data: StreakActivityData;
};
