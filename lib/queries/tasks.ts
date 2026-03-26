import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  taskService,
  type CreateTaskPayload,
  type TaskListParams,
  type UpdateTaskPayload,
} from "../services/tasks";

export const TASKS_QUERY_KEY = ["tasks"] as const;

export const useTasks = (params: TaskListParams = {}) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, params] as const,
    queryFn: () => taskService.getTasks(params),
  });
};

export const useTask = (id: string | null) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, "detail", id] as const,
    queryFn: () => taskService.getTaskById(id!),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTaskPayload) => taskService.createTask(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTaskPayload }) =>
      taskService.updateTask(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
