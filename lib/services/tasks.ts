import api from "../api";
import type {
  TaskDeleteResponse,
  TaskListResponse,
  TaskMutationResponse,
} from "../types/task";
import { Priority, TaskStatus } from "../types/task";

export type TaskListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: Priority;
  withDeleted?: boolean;
};

export type CreateTaskPayload = {
  title: string;
  duration: number;
  description?: string;
  priority?: Priority;
};

export type UpdateTaskPayload = {
  title?: string;
  duration?: number;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
};

function toQueryParams(params: TaskListParams): Record<string, string> {
  const q: Record<string, string> = {};
  if (params.page != null) q.page = String(params.page);
  if (params.limit != null) q.limit = String(params.limit);
  if (params.search) q.search = params.search;
  if (params.status) q.status = params.status;
  if (params.priority) q.priority = params.priority;
  if (params.withDeleted === true) q.withDeleted = "true";
  return q;
}

export const taskService = {
  getTasks: async (params: TaskListParams = {}) => {
    const { data } = await api.get<TaskListResponse>("tasks", {
      params: toQueryParams(params),
    });
    return data;
  },

  getTaskById: async (id: string) => {
    const { data } = await api.get<TaskMutationResponse>(`tasks/${id}`);
    return data;
  },

  createTask: async (body: CreateTaskPayload) => {
    const { data } = await api.post<TaskMutationResponse>("tasks/create", body);
    return data;
  },

  updateTask: async (id: string, body: UpdateTaskPayload) => {
    const { data } = await api.patch<TaskMutationResponse>(
      `tasks/${id}`,
      body,
    );
    return data;
  },

  deleteTask: async (id: string) => {
    const { data } = await api.delete<TaskDeleteResponse>(`tasks/${id}`);
    return data;
  },
};
