import type { Metadata } from "next";
import StreakDashboard from "@/components/streaks/StreakDashboard";
import { siteName } from "@/lib/metadata";

export const metadata: Metadata = {
  title: `Streaks | ${siteName}`,
  description:
    "View current and longest streaks, active days, and consistency trends from pulse sessions.",
};

const StreaksPage = () => {
  return <StreakDashboard />;
};

export default StreaksPage;
