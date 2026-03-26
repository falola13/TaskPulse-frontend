import type { Metadata } from "next";
import TasksClient from "@/components/tasks/TasksClient";
import { siteName } from "@/lib/metadata";

export const metadata: Metadata = {
  title: `Tasks | ${siteName}`,
  description:
    "Create and manage tasks with priority and status, search and filter your list, and sync with your Task Pulse backend.",
};

const TasksPage = () => {
  return <TasksClient />;
};

export default TasksPage;
