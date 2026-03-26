import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "../services/session";
import { SessionType } from "../store/sessionStore";
import { TASKS_QUERY_KEY } from "./tasks";
import { GOALS_QUERY_KEY } from "./goals";
import { STREAKS_QUERY_KEY } from "./streaks";

export interface PulseSession {
  id: number;
  userId: string;
  type: SessionType;
  startTime: string;
  endTime: string | null;
  duration: string | number | null;
  expectedDuration: number;
  taskId: string | null;
}

interface SessionHistoryResponse {
  message: string;
  data: PulseSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const SESSION_KEY = ["currentSession"] as const;
const HISTORY_KEY = ["session-history"] as const;
const EMPTY_SESSION = { data: null };

const isActiveSession = (session: PulseSession | null | undefined): boolean =>
  !!session && !session.endTime;

export const useSessionMutation = () => {
  const queryClient = useQueryClient();

  const startSessionMutation = useMutation({
    mutationFn: (payload: { type: SessionType; taskId?: string }) =>
      sessionService.startSession(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(SESSION_KEY, response);
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STREAKS_QUERY_KEY });
    },
  });

  const endSessionMutation = useMutation({
    mutationFn: sessionService.endSession,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: SESSION_KEY });
      const previous = queryClient.getQueryData(SESSION_KEY);
      queryClient.setQueryData(SESSION_KEY, EMPTY_SESSION);
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STREAKS_QUERY_KEY });
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SESSION_KEY, context.previous);
      }
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
    },
  });

  return { startSessionMutation, endSessionMutation };
};

export const useCurrentSession = () => {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: sessionService.getCurrentSession,
    select: (data) => (data as { data: PulseSession | null })?.data ?? null,
    refetchInterval: (query) => {
      const session = (query.state.data as { data: PulseSession | null })?.data;
      return isActiveSession(session) ? 5000 : false;
    },
  });
};

interface SessionHistoryParams {
  page?: number;
  limit?: number;
}

export const useSessionHistory = ({
  page = 1,
  limit = 10,
}: SessionHistoryParams = {}) => {
  return useQuery({
    queryKey: [...HISTORY_KEY, page, limit],
    queryFn: () => sessionService.getSessionHistory({ page, limit }),
    select: (data) => data.data as SessionHistoryResponse,
  });
};
