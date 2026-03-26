"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/lib/queries/tasks";
import { Priority, Task, TaskStatus } from "@/lib/types/task";
import { useSessionStore } from "@/lib/store/sessionStore";
import { handleError } from "@/utils/errorHandler";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListTodo,
  Pencil,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z.number().int().min(1).max(24 * 60),
  description: z.string().optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
});

const updateFormSchema = formSchema.extend({
  status: z.enum([
    TaskStatus.PENDING,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETED,
  ]),
});

type FormValues = z.infer<typeof formSchema>;
type UpdateFormValues = z.infer<typeof updateFormSchema>;

function statusLabel(s: TaskStatus) {
  switch (s) {
    case TaskStatus.PENDING:
      return "Pending";
    case TaskStatus.IN_PROGRESS:
      return "In progress";
    case TaskStatus.COMPLETED:
      return "Completed";
    default:
      return s;
  }
}

function priorityLabel(p: Priority) {
  switch (p) {
    case Priority.LOW:
      return "Low";
    case Priority.MEDIUM:
      return "Medium";
    case Priority.HIGH:
      return "High";
    default:
      return p;
  }
}

function statusBadgeClass(status: TaskStatus) {
  switch (status) {
    case TaskStatus.PENDING:
      return "bg-amber-400/15 text-amber-100 border-amber-400/25";
    case TaskStatus.IN_PROGRESS:
      return "bg-sky-400/15 text-sky-100 border-sky-400/25";
    case TaskStatus.COMPLETED:
      return "bg-emerald-400/15 text-emerald-100 border-emerald-400/25";
    default:
      return "bg-white/10 text-white/80 border-white/15";
  }
}

function priorityBadgeClass(priority: Priority) {
  switch (priority) {
    case Priority.LOW:
      return "bg-white/10 text-white/75 border-white/15";
    case Priority.MEDIUM:
      return "bg-indigo-400/15 text-indigo-100 border-indigo-400/25";
    case Priority.HIGH:
      return "bg-rose-400/15 text-rose-100 border-rose-400/25";
    default:
      return "bg-white/10 text-white/80 border-white/15";
  }
}

function formatSeconds(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function progressTone(progressPercent: number) {
  if (progressPercent >= 100) {
    return {
      text: "text-emerald-200",
      track: "bg-emerald-500/20",
      fill: "bg-emerald-400",
    };
  }
  if (progressPercent >= 70) {
    return {
      text: "text-sky-200",
      track: "bg-sky-500/20",
      fill: "bg-sky-400",
    };
  }
  return {
    text: "text-indigo-200",
    track: "bg-indigo-500/20",
    fill: "bg-indigo-400",
  };
}

type ModalMode = "create" | "edit" | null;

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/25";
const statusTabs: Array<{ label: string; value: TaskStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Todo", value: TaskStatus.PENDING },
  { label: "In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "Done", value: TaskStatus.COMPLETED },
];

const TasksClient = () => {
  const router = useRouter();
  const { setSelectedTaskId, setSelectedType } = useSessionStore();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");

  const [modal, setModal] = useState<ModalMode>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const listParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
    }),
    [page, limit, debouncedSearch, statusFilter, priorityFilter],
  );

  const { data, isLoading, isError, error, refetch } = useTasks(listParams);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const createForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: 25,
      description: "",
      priority: Priority.MEDIUM,
    },
  });

  const editForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
  });

  const openCreate = () => {
    setEditingTask(null);
    createForm.reset({
      title: "",
      duration: 25,
      description: "",
      priority: Priority.MEDIUM,
    });
    setModal("create");
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    editForm.reset({
      title: task.title,
      duration: task.duration,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditingTask(null);
  };

  const onCreate: SubmitHandler<FormValues> = async (values) => {
    try {
      await createMutation.mutateAsync({
        title: values.title,
        duration: values.duration,
        description: values.description || undefined,
        priority: values.priority,
      });
      toast.success("Task created");
      closeModal();
    } catch (e) {
      toast.error(handleError(e));
    }
  };

  const onUpdate: SubmitHandler<UpdateFormValues> = async (values) => {
    if (!editingTask) return;
    try {
      const body: {
        title: string;
        duration: number;
        description?: string;
        priority: Priority;
        status?: TaskStatus;
      } = {
        title: values.title,
        duration: values.duration,
        description: values.description,
        priority: values.priority,
      };
      if (editingTask.status !== TaskStatus.COMPLETED) {
        body.status = values.status;
      }
      await updateMutation.mutateAsync({
        id: editingTask.id,
        body,
      });
      toast.success("Task updated");
      closeModal();
    } catch (e) {
      toast.error(handleError(e));
    }
  };

  const onDelete = async (task: Task) => {
    const ok = window.confirm(`Delete “${task.title}”? This cannot be undone.`);
    if (!ok) return;
    try {
      await deleteMutation.mutateAsync(task.id);
      toast.success("Task deleted");
    } catch (e) {
      toast.error(handleError(e));
    }
  };

  const onQuickStatus = async (task: Task, status: TaskStatus) => {
    try {
      await updateMutation.mutateAsync({ id: task.id, body: { status } });
      toast.success("Task updated");
    } catch (e) {
      toast.error(handleError(e));
    }
  };

  const onFocusTask = (task: Task) => {
    setSelectedType("pulse");
    setSelectedTaskId(task.id);
    router.push("/dashboard");
  };

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;
  const overview = useMemo(() => {
    const totalPlannedSeconds = tasks.reduce(
      (acc, task) => acc + task.plannedDurationSeconds,
      0,
    );
    const totalActualSeconds = tasks.reduce(
      (acc, task) => acc + task.actualDurationSeconds,
      0,
    );
    const completedByTime = tasks.filter((task) => task.progressPercent >= 100).length;
    return { totalPlannedSeconds, totalActualSeconds, completedByTime };
  }, [tasks]);
  const byStatusCount = useMemo(
    () => ({
      pending: tasks.filter((task) => task.status === TaskStatus.PENDING).length,
      inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
    }),
    [tasks],
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.12),transparent_32%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              <ListTodo className="h-8 w-8 text-violet-300/90" aria-hidden />
              Task Manager
            </h1>
            <p className="mt-2 text-sm text-white/60 sm:text-base">
              {pagination?.total ?? tasks.length} tasks · {byStatusCount.inProgress} in
              progress
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-900/35 transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/25 p-2">
            {statusTabs.map((tab) => {
              const isActive = statusFilter === tab.value;
              const count =
                tab.value === ""
                  ? pagination?.total ?? tasks.length
                  : tab.value === TaskStatus.PENDING
                    ? byStatusCount.pending
                    : tab.value === TaskStatus.IN_PROGRESS
                      ? byStatusCount.inProgress
                      : byStatusCount.completed;

              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-white/12 text-white"
                      : "text-white/65 hover:bg-white/8 hover:text-white/90"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-xl sm:grid-cols-2">
            <input
              className={fieldClass}
              placeholder="Search title or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <select
              className={fieldClass}
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter((e.target.value as Priority | "") || "")
              }
            >
              <option value="">Priority: All</option>
              <option value={Priority.LOW}>{priorityLabel(Priority.LOW)}</option>
              <option value={Priority.MEDIUM}>{priorityLabel(Priority.MEDIUM)}</option>
              <option value={Priority.HIGH}>{priorityLabel(Priority.HIGH)}</option>
            </select>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          {tasks.length > 0 ? (
            <div className="mb-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Planned
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatSeconds(overview.totalPlannedSeconds)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Focused
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatSeconds(overview.totalActualSeconds)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Reached 100%
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {overview.completedByTime} / {tasks.length}
                </p>
              </div>
            </div>
          ) : null}
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="size-10 animate-spin rounded-full border-b-2 border-t-2 border-white/60" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-6 text-center">
              <p className="text-sm text-rose-100">{handleError(error)}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Retry
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-14 text-center">
              <p className="text-sm text-white/75">No tasks match your filters.</p>
              <p className="mt-1 text-xs text-white/45">
                Create a task or adjust search and filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="group rounded-2xl border border-white/10 bg-linear-to-br from-[#121833] to-[#0b1021] p-4 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="line-clamp-1 text-base font-semibold text-white">
                          {task.title}
                        </h2>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityBadgeClass(
                            task.priority,
                          )}`}
                        >
                          {priorityLabel(task.priority)}
                        </span>
                      </div>
                      {task.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-white/60">
                          {task.description}
                        </p>
                      ) : null}
                      <div className="mt-3 rounded-lg border border-white/8 bg-black/20 p-2.5">
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className={`${progressTone(task.progressPercent).text}`}>
                            Progress {Math.min(task.progressPercent, 100)}%
                          </span>
                          <span className="text-white/55">
                            {formatSeconds(task.actualDurationSeconds)} /{" "}
                            {formatSeconds(task.plannedDurationSeconds)}
                          </span>
                        </div>
                        <div
                          className={`h-1.5 w-full rounded-full ${progressTone(task.progressPercent).track}`}
                        >
                          <div
                            className={`h-full rounded-full ${progressTone(task.progressPercent).fill}`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(task.progressPercent, 100),
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-white/45">
                          Remaining: {formatSeconds(task.remainingDurationSeconds)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs text-white/50">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-medium ${statusBadgeClass(
                          task.status,
                        )}`}
                      >
                        {statusLabel(task.status)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5 text-orange-300" />
                          {Math.round(task.actualDurationSeconds / 60)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {Math.round(task.remainingDurationSeconds / 60)}m
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {task.progressPercent >= 100 &&
                      task.status !== TaskStatus.COMPLETED ? (
                        <button
                          type="button"
                          onClick={() => onQuickStatus(task, TaskStatus.COMPLETED)}
                          disabled={updateMutation.isPending}
                          className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50"
                        >
                          Mark done
                        </button>
                      ) : null}
                      {task.status !== TaskStatus.COMPLETED ? (
                        <button
                          type="button"
                          onClick={() => onFocusTask(task)}
                          className="rounded-lg border border-indigo-300/30 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-100 hover:bg-indigo-500/25"
                        >
                          Focus
                        </button>
                      ) : null}
                      {task.status === TaskStatus.PENDING ? (
                        <button
                          type="button"
                          onClick={() => onQuickStatus(task, TaskStatus.IN_PROGRESS)}
                          disabled={updateMutation.isPending}
                          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          Start
                        </button>
                      ) : null}
                      {task.status === TaskStatus.IN_PROGRESS ? (
                        <button
                          type="button"
                          onClick={() => onQuickStatus(task, TaskStatus.COMPLETED)}
                          disabled={updateMutation.isPending}
                          className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50"
                        >
                          Complete
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => openEdit(task)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 ? (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
              <p className="text-xs text-white/50">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total}{" "}
                tasks
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          aria-labelledby="task-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 id="task-modal-title" className="text-lg font-semibold text-white">
              {modal === "create" ? "New task" : "Edit task"}
            </h2>

            {modal === "create" ? (
              <form
                className="mt-5 space-y-4"
                onSubmit={createForm.handleSubmit(onCreate)}
              >
                <div>
                  <label className="text-xs font-medium text-white/60">Title</label>
                  <input
                    className={`${fieldClass} mt-1`}
                    {...createForm.register("title")}
                  />
                  {createForm.formState.errors.title ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {createForm.formState.errors.title.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    className={`${fieldClass} mt-1`}
                    {...createForm.register("duration", { valueAsNumber: true })}
                  />
                  {createForm.formState.errors.duration ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {createForm.formState.errors.duration.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">
                    Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} mt-1 resize-y min-h-[88px]`}
                    {...createForm.register("description")}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">Priority</label>
                  <select
                    className={`${fieldClass} mt-1`}
                    {...createForm.register("priority")}
                  >
                    <option value={Priority.LOW}>{priorityLabel(Priority.LOW)}</option>
                    <option value={Priority.MEDIUM}>
                      {priorityLabel(Priority.MEDIUM)}
                    </option>
                    <option value={Priority.HIGH}>
                      {priorityLabel(Priority.HIGH)}
                    </option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/35 disabled:opacity-60"
                  >
                    {createMutation.isPending ? "Saving…" : "Create"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={editForm.handleSubmit(onUpdate)}
              >
                {editingTask ? (
                  <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs">
                    <p className="text-white/70">
                      Focused:{" "}
                      <span className="font-medium text-white">
                        {formatSeconds(editingTask.actualDurationSeconds)}
                      </span>{" "}
                      / Planned{" "}
                      <span className="font-medium text-white">
                        {formatSeconds(editingTask.plannedDurationSeconds)}
                      </span>
                    </p>
                    <p className="mt-1 text-white/55">
                      Remaining: {formatSeconds(editingTask.remainingDurationSeconds)} ·
                      Progress: {Math.min(editingTask.progressPercent, 100)}%
                    </p>
                  </div>
                ) : null}
                <div>
                  <label className="text-xs font-medium text-white/60">Title</label>
                  <input
                    className={`${fieldClass} mt-1`}
                    {...editForm.register("title")}
                  />
                  {editForm.formState.errors.title ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {editForm.formState.errors.title.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    className={`${fieldClass} mt-1`}
                    {...editForm.register("duration", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} mt-1 resize-y min-h-[88px]`}
                    {...editForm.register("description")}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">Priority</label>
                  <select
                    className={`${fieldClass} mt-1`}
                    {...editForm.register("priority")}
                  >
                    <option value={Priority.LOW}>{priorityLabel(Priority.LOW)}</option>
                    <option value={Priority.MEDIUM}>
                      {priorityLabel(Priority.MEDIUM)}
                    </option>
                    <option value={Priority.HIGH}>
                      {priorityLabel(Priority.HIGH)}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60">Status</label>
                  <select
                    className={`${fieldClass} mt-1`}
                    {...editForm.register("status")}
                    disabled={editingTask?.status === TaskStatus.COMPLETED}
                  >
                    <option value={TaskStatus.PENDING}>
                      {statusLabel(TaskStatus.PENDING)}
                    </option>
                    <option value={TaskStatus.IN_PROGRESS}>
                      {statusLabel(TaskStatus.IN_PROGRESS)}
                    </option>
                    <option value={TaskStatus.COMPLETED}>
                      {statusLabel(TaskStatus.COMPLETED)}
                    </option>
                  </select>
                  {editingTask?.status === TaskStatus.COMPLETED ? (
                    <p className="mt-1 text-xs text-white/45">
                      Completed tasks cannot change status.
                    </p>
                  ) : null}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="rounded-xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/35 disabled:opacity-60"
                  >
                    {updateMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TasksClient;
