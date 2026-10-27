"use client";

import { FormEvent } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { useTasks, type WorkLog } from "@/lib/task-context";

export function WorkLogDialog({
  workLog,
  close,
}: {
  workLog: WorkLog;
  close: () => void;
}) {
  const { saveWorkLog, removeWorkLog } = useTasks();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") || "").trim();
    if (!title) return;

    const hoursVal = data.get("hours");
    const hours = hoursVal ? parseFloat(String(hoursVal)) : null;

    void saveWorkLog({
      ...workLog,
      title,
      date: String(data.get("date")) || workLog.date,
      category: data.get("category") as WorkLog["category"],
      outcomes: String(data.get("outcomes") || "").trim(),
      lessons_learned: String(data.get("lessons_learned") || "").trim(),
      hours: isNaN(hours as number) ? null : hours,
    });
    close();
  }

  const isNew = !workLog.title;

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Record Work Log">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {isNew ? "NEW WORK LOG ENTRY" : "EDIT WORK LOG ENTRY"}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {isNew ? "Document your work and lessons." : "Refine your work record."}
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
          Activity / task completed
          <input
            name="title"
            defaultValue={workLog.title}
            placeholder="e.g. Migrated user session persistence"
            autoFocus
            required
            maxLength={180}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Category
            <select
              name="category"
              defaultValue={workLog.category}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            >
              <option value="Engineering">Engineering</option>
              <option value="Architecture">Architecture</option>
              <option value="Operations">Operations</option>
              <option value="Research">Research</option>
              <option value="Client Engagement">Client Engagement</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Date completed
            <input
              name="date"
              type="date"
              defaultValue={workLog.date}
              required
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Hours spent
            <input
              name="hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              defaultValue={workLog.hours || ""}
              placeholder="e.g. 3.5"
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Outcomes & deliverables
          <textarea
            name="outcomes"
            defaultValue={workLog.outcomes}
            placeholder="What was produced, resolved, or improved?"
            rows={2}
            required
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Lessons learned & insights
          <textarea
            name="lessons_learned"
            defaultValue={workLog.lessons_learned}
            placeholder="What worked well, what would you do differently next time?"
            rows={2}
            required
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={() => {
                void removeWorkLog(workLog.id);
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
            Save work log
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
