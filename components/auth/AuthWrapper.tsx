import Image from "next/image";

type AuthWrapperProps = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: AuthWrapperProps) => {
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
