import type { Metadata } from "next";

/** Canonical site URL for Open Graph, metadataBase, and absolute URLs. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  return "http://localhost:3000";
}

export const siteName = "TaskPulse";

export const siteDescription =
  "TaskPulse is a Pomodoro-style focus app: timed work sessions, breaks, session history, streaks, and goals—so you can protect deep work and ship consistently.";

/** Shared defaults merged into the root layout. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteName} — Pomodoro focus timer & session tracking`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Pomodoro",
    "focus timer",
    "deep work",
    "time tracking",
    "productivity",
    "focus sessions",
    "work breaks",
    "session history",
    "TaskPulse",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName,
    title: `${siteName} — Pomodoro focus timer & session tracking`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Pomodoro focus timer`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};
