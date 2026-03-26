export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export type Task = {
  id: string;
  userId: string;
  title: string;
  duration: number;
  priority: Priority;
  status: TaskStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  remainingDurationSeconds: number;
  progressPercent: number;
};

export type TaskListResponse = {
  message: string;
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TaskMutationResponse = {
  message: string;
  data: Task;
};

export type TaskDeleteResponse = {
  message: string;
};
