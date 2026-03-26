import type { Metadata } from "next";
import GoalsDashboard from "@/components/goals/GoalsDashboard";
import { siteName } from "@/lib/metadata";

export const metadata: Metadata = {
  title: `Goals | ${siteName}`,
  description:
    "Set daily and weekly focus targets and track progress against your focus goals.",
};

const GoalsPage = () => {
  return <GoalsDashboard />;
};

export default GoalsPage;
