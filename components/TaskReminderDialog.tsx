"use client";

import { DraggableModal } from "@/components/DraggableModal";
import type { Task } from "@/lib/task-context";

export function TaskReminderDialog({
  task,
  close,
  onComplete,
}: {
  task: Task;
  close: () => void;
  onComplete?: (task: Task) => void;
}) {
  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Task reminder">
      <div className="flex flex-col items-center px-2 py-4 text-center">
        <h3 className="mb-3 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Task reminder
        </h3>
        <p className="mb-1 text-base font-medium text-zinc-800 dark:text-zinc-200">
          {task.title}
        </p>
        {task.details && (
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {task.details}
          </p>
        )}

        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 active:scale-[0.98] dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            onClick={close}
            autoFocus
          >
            OK
          </button>
          {onComplete && !task.completed && (
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center rounded-full border border-zinc-200 text-xs font-semibold text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              onClick={() => {
                onComplete(task);
                close();
              }}
            >
              Mark as completed
            </button>
          )}
        </div>
      </div>
    </DraggableModal>
  );
}
