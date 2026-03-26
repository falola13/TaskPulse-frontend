"use client";
import { useCallback } from "react";
import { useCurrentSession, useSessionMutation } from "@/lib/queries/session";
import { useSessionStore } from "@/lib/store/sessionStore";

export enum sessionType {
  PULSE = "pulse",
  SHORT_BREAK = "short_break",
  LONG_BREAK = "long_break",
}

export const useSessions = () => {
  const {
    selectedType,
    setSelectedType,
    selectedTaskId,
    setSelectedTaskId,
  } = useSessionStore();
  const { startSessionMutation, endSessionMutation } = useSessionMutation();
  const { data: currentSessionData, isLoading: currentSessionLoading } =
    useCurrentSession();

  const startSession = useCallback(() => {
    if (startSessionMutation.isPending) return;
    const shouldAttachTask = selectedType === sessionType.PULSE && selectedTaskId;
    startSessionMutation.mutate({
      type: selectedType,
      taskId: shouldAttachTask ? selectedTaskId : undefined,
    });
  }, [startSessionMutation, selectedType, selectedTaskId]);

  const endSession = useCallback(() => {
    if (!currentSessionData?.id || endSessionMutation.isPending) return;
    endSessionMutation.mutate(currentSessionData.id);
  }, [currentSessionData?.id, endSessionMutation]);

  const isLoading = {
    currentSession: currentSessionLoading,
    startLoading: startSessionMutation.isPending,
    endLoading: endSessionMutation.isPending,
  };

  return {
    startSession,
    endSession,
    selectedType,
    setSelectedType: (type: sessionType) => setSelectedType(type),
    selectedTaskId,
    setSelectedTaskId,
    currentSession: currentSessionData,
    isLoading,
  };
};
