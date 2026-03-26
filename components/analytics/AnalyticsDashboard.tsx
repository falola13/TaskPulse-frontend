"use client";

import { useMemo } from "react";
import { useGoal, useWeeklyGoalSummary } from "@/lib/queries/goals";
import { useStreak } from "@/lib/queries/streaks";
import { useTasks } from "@/lib/queries/tasks";
import { TaskStatus } from "@/lib/types/task";

const AnalyticsDashboard = () => {
  const { data: goalData } = useGoal();
  const { data: streakData } = useStreak();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyGoalSummary();
  const { data: tasksData } = useTasks({ page: 1, limit: 100 });

  const taskStats = useMemo(() => {
    const tasks = tasksData?.tasks ?? [];
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };
  }, [tasksData?.tasks]);

  const weekTotal = weeklyData?.data.days.reduce((acc, day) => acc + day.focusedMinutes, 0) ?? 0;
  const weekTarget = weeklyData?.data.weeklyFocusTarget ?? 0;
  const weekPercent = weekTarget > 0 ? Math.min(Math.round((weekTotal / weekTarget) * 100), 100) : 0;

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.16),transparent_32%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            Focus Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            View your productivity signals across tasks, goals, and streak consistency.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Focus Today</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {goalData?.data?.todayFocusedMinutes ?? 0}m
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Sessions Today</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {goalData?.data?.todayCompletedSessions ?? 0}
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Current Streak</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {streakData?.data?.currentStreakDays ?? 0}d
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Tasks Completed</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {taskStats.completed}/{taskStats.total}
            </p>
          </article>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Task Distribution</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/55">Pending</p>
              <p className="mt-1 text-2xl font-semibold text-white">{taskStats.pending}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/55">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-white">{taskStats.inProgress}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/55">Completed</p>
              <p className="mt-1 text-2xl font-semibold text-white">{taskStats.completed}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Weekly Focus Progress</h2>
            <p className="text-xs text-white/55">
              {weekTotal}m / {weekTarget}m
            </p>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-400"
              style={{ width: `${Math.max(0, Math.min(weekPercent, 100))}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">{weekPercent}% of weekly goal</p>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {weeklyLoading
              ? Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="h-14 animate-pulse rounded-lg bg-white/10" />
                ))
              : weeklyData?.data.days.map((day) => (
                  <div key={day.date} className="rounded-lg border border-white/10 bg-black/20 p-2 text-center">
                    <p className="text-[10px] text-white/55">
                      {new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{day.focusedMinutes}m</p>
                  </div>
                ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
