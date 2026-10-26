"use client";

import { FormEvent } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { categoriesByPlan, planLabels, useTasks, type Task } from "@/lib/task-context";

export function TaskDialog({
  task,
  close,
}: {
  task: Task;
  close: () => void;
}) {
  const { saveTask, remove } = useTasks();
  const label = planLabels[task.plan_type];
  const prompt =
    task.plan_type === "project"
      ? "What are you working toward?"
      : task.plan_type === "community"
      ? "How would you like to contribute?"
      : "What needs doing?";
  const categories = categoriesByPlan[task.plan_type];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") || "").trim();
    if (!title) return;
    const reminderTime = String(data.get("reminder_time") || "").trim();
    const rawDetails = String(data.get("details") || "").trim();
    const details = reminderTime
      ? rawDetails
        ? `${reminderTime} · ${rawDetails}`
        : reminderTime
      : rawDetails;

    void saveTask({
      ...task,
      title,
      details: details || null,
      category: String(data.get("category")),
      due_date: String(data.get("due_date")) || task.due_date,
    });
    close();
  }

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel={`Edit ${label}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {task.title ? `EDIT ${label.toUpperCase()}` : `NEW ${label.toUpperCase()}`}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {task.title ? "Make it clearer." : "Make space for it."}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            ×
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          {label} title
          <input
            name="title"
            defaultValue={task.title}
            placeholder={prompt}
            autoFocus
            required
            maxLength={140}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Reminder time
            <input
              name="reminder_time"
              type="text"
              placeholder="e.g. 07:45 am"
              defaultValue={task.details || ""}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Due date
            <input
              name="due_date"
              type="date"
              defaultValue={task.due_date}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Category
          <select
            name="category"
            defaultValue={categories.includes(task.category) ? task.category : categories[0]}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Details (optional)
          <textarea
            name="details"
            defaultValue={task.details || ""}
            placeholder="Add context or notes"
            rows={3}
            maxLength={1000}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          {task.title && (
            <button
              type="button"
              onClick={() => {
                remove(task);
                close();
              }}
              className="h-11 rounded-xl border border-red-200 px-4 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="h-11 flex-1 rounded-xl bg-[#d3f36b] text-sm font-bold text-[#283618] shadow-md shadow-[#718d3725] transition hover:bg-[#c4e65d] active:scale-[0.98]"
          >
            Save {label.toLowerCase()}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
