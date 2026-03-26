"use client";

import moment from "moment";
import { Flame, CalendarCheck2, Trophy, Activity } from "lucide-react";
import { useStreak, useStreakActivity } from "@/lib/queries/streaks";

const StreakDashboard = () => {
  const { data: streakData, isLoading } = useStreak();
  const { data: activityData, isLoading: activityLoading } = useStreakActivity(84);
  const streak = streakData?.data;
  const activityDays = activityData?.data.days ?? [];
  const maxCount = Math.max(...activityDays.map((day) => day.count), 0);

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.16),transparent_32%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            Focus Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Streaks
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            Track your consistency and keep momentum every day.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-32 animate-pulse rounded-2xl bg-white/8" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-orange-300/20 bg-orange-500/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-orange-100/70">
                    Current Streak
                  </p>
                  <Flame className="h-5 w-5 text-orange-300" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {streak?.currentStreakDays ?? 0}
                  <span className="ml-1 text-lg text-white/70">days</span>
                </p>
              </article>

              <article className="rounded-2xl border border-violet-300/20 bg-violet-500/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-100/70">
                    Longest Streak
                  </p>
                  <Trophy className="h-5 w-5 text-violet-300" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {streak?.longestStreakDays ?? 0}
                  <span className="ml-1 text-lg text-white/70">days</span>
                </p>
              </article>

              <article className="rounded-2xl border border-sky-300/20 bg-sky-500/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-100/70">
                    Active Days
                  </p>
                  <CalendarCheck2 className="h-5 w-5 text-sky-300" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {streak?.totalActiveDays ?? 0}
                </p>
              </article>

              <article className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/70">
                    Today
                  </p>
                  <Activity className="h-5 w-5 text-emerald-300" />
                </div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {streak?.activeToday ? "Active" : "No pulse yet"}
                </p>
              </article>
            </div>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="text-lg font-semibold text-white">Streak Details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Last Active Date
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {streak?.lastActiveDate
                      ? moment(streak.lastActiveDate).format("DD MMM YYYY")
                      : "No activity yet"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Momentum
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {(streak?.currentStreakDays ?? 0) >= 7
                      ? "Strong weekly rhythm"
                      : "Build consistency day by day"}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="text-lg font-semibold text-white">84-Day Activity</h2>
              {activityLoading ? (
                <div className="mt-4 h-32 animate-pulse rounded-xl bg-white/8" />
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-12 gap-1.5">
                    {activityDays.map((day) => {
                      const level =
                        maxCount === 0 ? 0 : Math.min(4, Math.ceil((day.count / maxCount) * 4));
                      const color =
                        level === 0
                          ? "bg-white/8"
                          : level === 1
                            ? "bg-emerald-500/30"
                            : level === 2
                              ? "bg-emerald-500/45"
                              : level === 3
                                ? "bg-emerald-400/70"
                                : "bg-emerald-300";

                      return (
                        <div
                          key={day.date}
                          title={`${day.date}: ${day.count} pulse sessions`}
                          className={`aspect-square rounded-[4px] ${color}`}
                        />
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-white/55">
                    Darker cells indicate more completed pulse sessions on that day.
                  </p>
                </>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default StreakDashboard;
