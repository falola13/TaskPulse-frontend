import Image from "next/image";
import Link from "next/link";

type AuthWrapperProps = {
  children: React.ReactNode;
  mode?: "login" | "register";
};

const AuthWrapper = ({ children, mode }: AuthWrapperProps) => {
  const switchHref = mode === "login" ? "/register" : "/login";
  const switchLabel = mode === "login" ? "Create account" : "Sign in";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background: subtle gradient + soft pattern */}
      <div
        className="absolute inset-0 -z-10 bg-linear-to-br from-zinc-50 via-white to-amber-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      {/* Accent glow (brand tint) */}
      <div
        className="absolute top-0 right-0 w-[80vmin] h-[80vmin] -translate-y-1/2 translate-x-1/2 rounded-full bg-(--secondary)/5 dark:bg-(--secondary)/10 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-[60vmin] h-[60vmin] translate-y-1/2 -translate-x-1/2 rounded-full bg-(--accent)/5 dark:bg-(--accent)/10 blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="w-full max-w-md relative">
        {/* Mini navbar for auth pages */}
        <div className="mb-4 flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-black/5 dark:text-zinc-200 dark:hover:text-white dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20"
            aria-label="Go to home"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-zinc-800 dark:text-white">
              TP
            </span>
            <span>Home</span>
          </Link>

          {mode ? (
            <Link
              href={switchHref}
              className="inline-flex items-center rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm shadow-zinc-200/30 hover:bg-white transition-colors dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-white dark:hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20"
            >
              {switchLabel}
            </Link>
          ) : null}
        </div>

        {/* Card: clean with subtle border and accent */}
        <div
          className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-700/80 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/20 p-8 sm:p-10 ring-1 ring-zinc-100 dark:ring-zinc-800/50 overflow-hidden
        "
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-linear-to-r from-secondary to-accent" />

          {/* Logo / Header */}
          <div className="relative mb-6 h-12 w-48 flex items-start text-gray-800 dark:text-zinc-100">
            <Image
              src="/TaskPulse.png"
              alt="TaskPulse Logo"
              fill
              className="h-auto w-auto object-contain object-left"
            />
          </div>
          {children}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-500 mt-6">
          Stay on top of what matters.
        </p>
      </div>
    </div>
  );
};

export default AuthWrapper;
