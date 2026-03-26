import type { Metadata } from "next";
import PulseDashboard from "@/components/session/PulseDashboard";

export const metadata: Metadata = {
  title: "Focus timer",
  description:
    "Run Pomodoro-style focus sessions with a live countdown and remaining time on the ring, track progress as a percentage, and review session history in one minimal workspace.",
  openGraph: {
    title: "Focus timer — timed sessions & history",
    description:
      "Timed work blocks, short and long breaks, and session history—see remaining time and progress at a glance.",
  },
};

const DashboardPage = () => {
  return <PulseDashboard />;
};

export default DashboardPage;
