"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoal, useUpsertGoal, useWeeklyGoalSummary } from "@/lib/queries/goals";
import { handleError } from "@/utils/errorHandler";

const GoalsDashboard = () => {
  const { data: goalData, isLoading: goalLoading } = useGoal();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyGoalSummary();
  const upsertGoalMutation = useUpsertGoal();
  const [goalForm, setGoalForm] = useState({
    dailySessionTarget: 1,
    dailyFocusTarget: 60,
    weeklyFocusTarget: 300,
  });

  useEffect(() => {
    if (!goalData?.data) return;
    setGoalForm({
      dailySessionTarget: goalData.data.dailySessionTarget,
      dailyFocusTarget: goalData.data.dailyFocusTarget,
      weeklyFocusTarget: goalData.data.weeklyFocusTarget,
    });
  }, [goalData?.data]);

  const onSaveGoals = async () => {
    try {
      await upsertGoalMutation.mutateAsync(goalForm);
      toast.success("Goals updated");
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const applyPreset = (preset: "starter" | "steady" | "deep") => {
    if (preset === "starter") {
      setGoalForm({ dailySessionTarget: 2, dailyFocusTarget: 50, weeklyFocusTarget: 250 });
      return;
    }
    if (preset === "steady") {
      setGoalForm({ dailySessionTarget: 4, dailyFocusTarget: 120, weeklyFocusTarget: 600 });
      return;
    }
    setGoalForm({ dailySessionTarget: 6, dailyFocusTarget: 180, weeklyFocusTarget: 900 });
  };

  const weekTotalFocused = weeklyData?.data.days.reduce((acc, day) => acc + day.focusedMinutes, 0) ?? 0;
  const weekMax = Math.max(
    ...(weeklyData?.data.days.map((day) => day.focusedMinutes) ?? [0]),
    weeklyData?.data.dailyFocusTarget ?? 0,
  );

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.16),transparent_32%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            Focus Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Goals
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            Configure your focus targets and track daily and weekly progress.
          </p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Target Settings</h2>
            {goalLoading ? <span className="text-xs text-white/55">Loading...</span> : null}
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset("starter")}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            >
              Starter
            </button>
            <button
              type="button"
              onClick={() => applyPreset("steady")}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            >
              Steady
            </button>
            <button
              type="button"
              onClick={() => applyPreset("deep")}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            >
              Deep Work
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-xs text-white/60">
              Daily sessions
              <input
                type="number"
                min={1}
                value={goalForm.dailySessionTarget}
                onChange={(e) =>
                  setGoalForm((prev) => ({
                    ...prev,
                    dailySessionTarget: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-300/60"
              />
            </label>
            <label className="text-xs text-white/60">
              Daily focus (min)
              <input
                type="number"
                min={1}
                value={goalForm.dailyFocusTarget}
                onChange={(e) =>
                  setGoalForm((prev) => ({
                    ...prev,
                    dailyFocusTarget: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-300/60"
              />
            </label>
            <label className="text-xs text-white/60">
              Weekly focus (min)
              <input
                type="number"
                min={1}
                value={goalForm.weeklyFocusTarget}
                onChange={(e) =>
                  setGoalForm((prev) => ({
                    ...prev,
                    weeklyFocusTarget: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-300/60"
              />
            </label>
          </div>
          <button
            onClick={onSaveGoals}
            disabled={upsertGoalMutation.isPending}
            className="mt-5 rounded-xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {upsertGoalMutation.isPending ? "Saving..." : "Save Goals"}
          </button>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Progress Overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Sessions Today
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {goalData?.data?.todayCompletedSessions ?? 0}
              </p>
              <p className="mt-1 text-xs text-white/50">
                Target: {goalForm.dailySessionTarget}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Daily Focus
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {goalData?.data?.todayFocusedMinutes ?? 0}m
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-sky-400"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(goalData?.data?.dailyFocusProgressPercent ?? 0, 100),
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-white/50">
                {goalData?.data?.dailyFocusProgressPercent ?? 0}% of{" "}
                {goalForm.dailyFocusTarget}m
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Weekly Focus
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {goalData?.data?.weekFocusedMinutes ?? 0}m
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(goalData?.data?.weeklyFocusProgressPercent ?? 0, 100),
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-white/50">
                {goalData?.data?.weeklyFocusProgressPercent ?? 0}% of{" "}
                {goalForm.weeklyFocusTarget}m
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">This Week Breakdown</h3>
              <p className="text-xs text-white/55">
                {weekTotalFocused}m / {weeklyData?.data.weeklyFocusTarget ?? goalForm.weeklyFocusTarget}m
              </p>
            </div>
            {weeklyLoading ? (
              <div className="h-24 animate-pulse rounded-lg bg-white/10" />
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {weeklyData?.data.days.map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1">
                    <div className="h-20 w-full rounded-md bg-white/8 p-1">
                      <div
                        className="w-full rounded-sm bg-indigo-400"
                        style={{
                          height: `${Math.max(
                            6,
                            weekMax > 0 ? (day.focusedMinutes / weekMax) * 100 : 6,
                          )}%`,
                          marginTop: "auto",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-white/55">
                      {new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-[10px] text-white/75">{day.focusedMinutes}m</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GoalsDashboard;
