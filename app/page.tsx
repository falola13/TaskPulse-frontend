import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description:
    "TaskPulse helps you stay in flow with Pomodoro focus sessions, timed breaks, streaks, and goals—start free and build a sustainable deep-work habit.",
};

export default function Home() {
  return (
    <div className="relative min-h-[calc(100dvh-1px)] overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.22),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(236,72,153,0.18),transparent_35%)]" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-20 text-center sm:pb-28 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
          Focus. Build. Ship.
        </p>

        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Stay in the zone with{" "}
          <span className="bg-linear-to-r from-indigo-300 via-indigo-200 to-fuchsia-200 bg-clip-text text-transparent">
            TaskPulse
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
          Pomodoro-powered focus sessions linked to your tasks. Track progress,
          build streaks, and ship faster with a clean workflow.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/35 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-14 grid w-full max-w-5xl gap-4 text-left sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm font-semibold">Focus sessions</p>
            <p className="mt-2 text-sm text-white/65">
              Start a pulse, take breaks, and keep the timer aligned with your
              day.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm font-semibold">Session history</p>
            <p className="mt-2 text-sm text-white/65">
              Review recent sessions to see patterns and protect deep-work time.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm font-semibold">Streaks & goals</p>
            <p className="mt-2 text-sm text-white/65">
              Build momentum with streak tracking and measurable goals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
