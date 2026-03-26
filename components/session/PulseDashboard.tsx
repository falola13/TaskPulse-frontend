"use client";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import moment from "moment";
import Link from "next/link";
import { sessionType, useSessions } from "@/hooks/useSessions";
import { useGoal } from "@/lib/queries/goals";
import { useSessionHistory } from "@/lib/queries/session";
import { useStreak } from "@/lib/queries/streaks";
import { useTask, useTasks } from "@/lib/queries/tasks";
import { TaskStatus } from "@/lib/types/task";
import { siteName } from "@/lib/metadata";

/** Matches `app/(dashboard)/dashboard/page.tsx` metadata title + root template. */
const DASHBOARD_DOCUMENT_TITLE = `Focus timer | ${siteName}`;

const NOOP_SUBSCRIBE = () => () => {};
const SERVER_SNAPSHOT = () => 0;

const useNow = (enabled: boolean) => {
  const subscribe = useMemo(() => {
    if (!enabled) return NOOP_SUBSCRIBE;
    return (callback: () => void) => {
      const id = setInterval(callback, 1000);
      return () => clearInterval(id);
    };
  }, [enabled]);

  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    SERVER_SNAPSHOT,
  );
};

const RING_RADIUS = 42;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

type RingAccent = {
  track: string;
  stroke: string;
  glow: string;
};

function getRingAccent(type: string | undefined): RingAccent {
  if (type === sessionType.SHORT_BREAK) {
    return {
      track: "rgba(56, 189, 248, 0.12)",
      stroke: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.35)",
    };
  }
  if (type === sessionType.LONG_BREAK) {
    return {
      track: "rgba(167, 139, 250, 0.14)",
      stroke: "#a78bfa",
      glow: "rgba(167, 139, 250, 0.35)",
    };
  }
  return {
    track: "rgba(52, 211, 153, 0.12)",
    stroke: "#34d399",
    glow: "rgba(52, 211, 153, 0.38)",
  };
}

function FocusTimerRing({
  timeLabel,
  percentLabel,
  percentHint,
  progress,
  accent,
  subtitle,
}: {
  timeLabel: string;
  percentLabel: string;
  percentHint?: string;
  progress: number;
  accent: RingAccent;
  subtitle: string;
}) {
  const clamped = Math.min(1, Math.max(0, progress));
  const dashOffset = RING_CIRC * (1 - clamped);

  return (
    <div className="relative mx-auto flex w-full max-w-[min(100%,20rem)] flex-col items-center">
      <div
        className="relative aspect-square w-full max-w-[280px] sm:max-w-[300px]"
        style={{ filter: `drop-shadow(0 0 32px ${accent.glow})` }}
      >
        <div
          className="pointer-events-none absolute inset-[12%] rounded-full bg-linear-to-b from-white/[0.07] to-transparent ring-1 ring-white/6"
          aria-hidden
        />
        <svg
          className="relative h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke={accent.track}
            strokeWidth="2.5"
          />
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke={accent.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-in-out"
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
            {subtitle}
          </p>
          <p className="mt-2 font-mono text-[clamp(2.1rem,7.5vw,3.1rem)] font-semibold leading-none tabular-nums tracking-tight text-white">
            {timeLabel}
          </p>
          <div className="mt-4 flex flex-col items-center gap-0.5">
            <p className="text-xl font-semibold tabular-nums text-white/80">
              {percentLabel}
            </p>
            {percentHint ? (
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                {percentHint}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const PulseDashboard = () => {
  const {
    currentSession,
    endSession,
    isLoading,
    startSession,
    selectedType,
    setSelectedType,
    selectedTaskId,
    setSelectedTaskId,
  } = useSessions();
  const { data: sessionHistory, isLoading: historyLoading } = useSessionHistory(
    { page: 1, limit: 10 },
  );
  const { data: goalData } = useGoal();
  const { data: streakData } = useStreak();
  const { data: taskListData, isLoading: tasksLoading } = useTasks({
    page: 1,
    limit: 50,
  });
  const activeSessionTaskId = currentSession?.taskId ?? null;
  const { data: activeSessionTaskData, isLoading: activeTaskLoading } = useTask(
    activeSessionTaskId,
  );

  const sessionOptions = [
    {
      key: sessionType.PULSE,
      label: "Pulse",
    },
    {
      key: sessionType.SHORT_BREAK,
      label: "Short Break",
    },
    {
      key: sessionType.LONG_BREAK,
      label: "Long Break",
    },
  ];

  const hasActiveSession = !!currentSession && !currentSession.endTime;
  const now = useNow(hasActiveSession);
  const selectableTasks = useMemo(() => {
    const allTasks = taskListData?.tasks ?? [];
    return allTasks.filter(
      (task) =>
        task.status === TaskStatus.PENDING || task.status === TaskStatus.IN_PROGRESS,
    );
  }, [taskListData?.tasks]);
  const selectedTask = useMemo(
    () => selectableTasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectableTasks, selectedTaskId],
  );
  const isPulseType = selectedType === sessionType.PULSE;
  const canStartSession = !isPulseType || !!selectedTaskId;
  const totalTasks = taskListData?.pagination?.total ?? 0;
  const inProgressTasks =
    taskListData?.tasks?.filter((task) => task.status === TaskStatus.IN_PROGRESS)
      .length ?? 0;

  let timeLeft = 0;
  let isRunning = false;

  if (hasActiveSession) {
    const startedAt = Math.floor(
      new Date(currentSession.startTime).getTime() / 1000,
    );

    const elapsed = now - startedAt;
    const remaining = currentSession.expectedDuration - elapsed;

    if (remaining > 0) {
      timeLeft = remaining;
      isRunning = true;
    }
  }

  const totalSeconds =
    hasActiveSession && currentSession ? currentSession.expectedDuration : 0;

  const remainingFraction =
    totalSeconds > 0 && isRunning
      ? Math.min(1, Math.max(0, timeLeft / totalSeconds))
      : 0;

  const ringAccent = getRingAccent(currentSession?.type ?? selectedType);

  const formatTime = (seconds: number) => {
    return moment.utc(seconds * 1000).format("mm:ss");
  };

  const formatSessionType = (type: string) =>
    type
      .split("_")
      .map((segment) => segment[0].toUpperCase() + segment.slice(1))
      .join(" ");

  const formatDuration = (duration: string | number | null) => {
    if (typeof duration === "number") return formatTime(duration);
    const asNumber = Number(duration);
    if (!Number.isNaN(asNumber) && asNumber > 0) return formatTime(asNumber);
    return "--:--";
  };
  const formatTaskClock = (seconds: number) =>
    moment.utc(Math.max(0, seconds) * 1000).format("mm:ss");

  const getTypeAccent = (type: string) => {
    if (type === sessionType.PULSE) return "bg-emerald-400/15 text-emerald-200";
    if (type === sessionType.SHORT_BREAK) return "bg-sky-400/15 text-sky-200";
    return "bg-violet-400/15 text-violet-200";
  };

  useEffect(() => {
    if (isLoading.currentSession) return;

    if (!isRunning || timeLeft <= 0) {
      document.title = DASHBOARD_DOCUMENT_TITLE;
      return;
    }

    const timeStr = moment.utc(timeLeft * 1000).format("mm:ss");
    const pct =
      totalSeconds > 0 ? Math.round((timeLeft / totalSeconds) * 100) : 0;
    const label = currentSession?.type
      ? formatSessionType(currentSession.type)
      : "Focus";

    document.title = `${timeStr} · ${pct}% · ${label} | ${siteName}`;
  }, [
    isLoading.currentSession,
    isRunning,
    timeLeft,
    totalSeconds,
    currentSession?.type,
  ]);

  useEffect(() => {
    return () => {
      document.title = DASHBOARD_DOCUMENT_TITLE;
    };
  }, []);

  useEffect(() => {
    if (!isPulseType) return;
    if (selectedTaskId) return;
    if (!selectableTasks.length) return;
    setSelectedTaskId(selectableTasks[0].id);
  }, [isPulseType, selectedTaskId, selectableTasks, setSelectedTaskId]);


  if (isLoading.currentSession) {
    return (
      <div className="fixed z-50 inset-0 flex flex-col justify-center h-screen items-center w-full bg-black/50 backdrop-blur">
        <div className="size-10 border-t-2 rounded-full animate-spin border-secondary border-b" />
      </div>
    );
  }
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.16),transparent_32%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mb-6 rounded-3xl border border-white/10 bg-linear-to-br from-indigo-500/18 via-fuchsia-500/10 to-slate-900/40 p-5 shadow-2xl backdrop-blur-xl sm:mb-7 sm:p-7">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Focus Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Task Pulse Dashboard
          </h1>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            Run focused sessions, monitor momentum, and keep goals and streaks visible.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/tasks"
              className="rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/12"
            >
              Open tasks
            </Link>
            <Link
              href="/dashboard/goals"
              className="rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/12"
            >
              Open goals
            </Link>
            <Link
              href="/dashboard/streaks"
              className="rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/12"
            >
              Open streaks
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Current Streak
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {streakData?.data?.currentStreakDays ?? 0}d
            </p>
            <p className="mt-1 text-xs text-white/55">
              Longest: {streakData?.data?.longestStreakDays ?? 0}d
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Focus Today
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {goalData?.data?.todayFocusedMinutes ?? 0}m
            </p>
            <p className="mt-1 text-xs text-white/55">
              Goal: {goalData?.data?.dailyFocusTarget ?? 0}m
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Sessions Today
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {goalData?.data?.todayCompletedSessions ?? 0}
            </p>
            <p className="mt-1 text-xs text-white/55">
              Target: {goalData?.data?.dailySessionTarget ?? 0}
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Tasks Active
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">{inProgressTasks}</p>
            <p className="mt-1 text-xs text-white/55">Total: {totalTasks}</p>
          </article>
        </div>

        <div className="grid gap-6 lg:items-start lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Current Session
                </p>
                <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                  {currentSession?.type
                    ? formatSessionType(currentSession.type)
                    : "Ready to focus"}
                </h2>
              </div>
              {isLoading.currentSession && (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                  Syncing...
                </span>
              )}
            </div>

            <div className="mb-8 flex flex-col items-center rounded-2xl border border-white/10 bg-black/20 px-4 py-10 sm:px-8">
              <FocusTimerRing
                timeLabel={isRunning ? formatTime(timeLeft) : "00:00"}
                percentLabel={
                  isRunning && totalSeconds > 0
                    ? `${Math.round(remainingFraction * 100)}%`
                    : "—"
                }
                percentHint={
                  isRunning && totalSeconds > 0 ? "remaining" : undefined
                }
                progress={remainingFraction}
                accent={ringAccent}
                subtitle={
                  isRunning && currentSession?.type
                    ? formatSessionType(currentSession.type)
                    : "Focus timer"
                }
              />
            </div>

            {!isRunning ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {sessionOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedType(option.key)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        selectedType === option.key
                          ? "border-indigo-300/60 bg-indigo-500/25 text-white"
                          : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {isPulseType ? (
                  <div>
                    <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                      Linked task
                    </label>
                    <select
                      value={selectedTaskId ?? ""}
                      onChange={(e) => setSelectedTaskId(e.target.value || null)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-300/60 focus:ring-2 focus:ring-indigo-500/25"
                      disabled={tasksLoading}
                    >
                      {!selectableTasks.length ? (
                        <option value="">
                          {tasksLoading ? "Loading tasks..." : "No pending/in-progress task"}
                        </option>
                      ) : null}
                      {selectableTasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.title} ({Math.min(task.progressPercent, 100)}%)
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-white/50">
                      Pulse sessions can be attached to a task so work logs stay aligned.
                    </p>
                  </div>
                ) : null}

                <button
                  onClick={() => startSession()}
                  disabled={isLoading.startLoading || !canStartSession}
                  className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 font-semibold shadow-lg shadow-indigo-900/35 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading.startLoading
                    ? "Starting..."
                    : canStartSession
                      ? "Start Session"
                      : "Select task to start pulse"}
                </button>
              </div>
            ) : (
              <button
                onClick={endSession}
                disabled={isLoading.endLoading}
                className="w-full rounded-xl bg-rose-600 px-6 py-3 font-semibold shadow-lg shadow-rose-950/40 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading.endLoading ? "Ending..." : "End Session"}
              </button>
            )}
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:flex lg:h-[calc(100dvh-20rem)] lg:flex-col lg:overflow-hidden">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Session History</h2>
                <p className="text-sm text-white/65">Latest 10 sessions</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75">
                {sessionHistory?.pagination?.total ?? 0} total
              </span>
            </div>

            {historyLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-b border-t-2 border-white/70" />
              </div>
            ) : sessionHistory?.data?.length ? (
              <div className="no-scrollbar space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
                {hasActiveSession ? (
                  <article className="rounded-xl border border-indigo-300/25 bg-indigo-500/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-indigo-400/20 px-2.5 py-1 text-xs font-medium text-indigo-100">
                        Active focus task
                      </span>
                      {activeTaskLoading ? (
                        <p className="text-xs text-white/55">Loading...</p>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {activeSessionTaskData?.data?.title ??
                        selectedTask?.title ??
                        "No task linked"}
                    </p>
                    {activeSessionTaskData?.data ? (
                      <p className="mt-1 text-xs text-white/60">
                        {formatTaskClock(activeSessionTaskData.data.actualDurationSeconds)} /{" "}
                        {formatTaskClock(activeSessionTaskData.data.plannedDurationSeconds)} ·{" "}
                        {activeSessionTaskData.data.status.replace("_", " ")}
                      </p>
                    ) : null}
                  </article>
                ) : null}
                {sessionHistory.data.map((session) => (
                  <article
                    key={session.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTypeAccent(
                          session.type,
                        )}`}
                      >
                        {formatSessionType(session.type)}
                      </span>
                      <p className="text-xs text-white/60">
                        {moment(session.startTime).format("DD MMM, HH:mm")}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <p className="text-white/70">Duration</p>
                      <p className="font-medium tabular-nums text-white">
                        {formatDuration(session.duration)}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <p className="text-white/70">Target</p>
                      <p className="font-medium tabular-nums text-white">
                        {formatTime(session.expectedDuration)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-10 text-center">
                <p className="text-sm text-white/70">No session history yet.</p>
                <p className="mt-1 text-xs text-white/50">
                  Start your first focus session to build momentum.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PulseDashboard;
