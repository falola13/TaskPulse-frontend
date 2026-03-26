import type { Metadata } from "next";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { siteName } from "@/lib/metadata";

export const metadata: Metadata = {
  title: `Analytics | ${siteName}`,
  description:
    "Understand productivity trends across focus time, sessions, tasks, goals, and streaks.",
};

const AnalyticsPage = () => {
  return <AnalyticsDashboard />;
};

export default AnalyticsPage;
