"use client";

import { FormEvent, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { useTasks, type Achievement } from "@/lib/task-context";

export function AchievementDialog({
  achievement,
  close,
}: {
  achievement: Achievement;
  close: () => void;
}) {
  const { saveAchievement, removeAchievement } = useTasks();
  const [skillsStr, setSkillsStr] = useState(achievement.skills.join(", "));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") || "").trim();
    if (!title) return;

    const skills = skillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    void saveAchievement({
      ...achievement,
      title,
      date: String(data.get("date")) || achievement.date,
      category: data.get("category") as Achievement["category"],
      impact: String(data.get("impact") || "").trim(),
      skills,
      details: String(data.get("details") || "").trim() || null,
    });
    close();
  }

  const isNew = !achievement.title;

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Record Achievement">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {isNew ? "NEW ACHIEVEMENT RECORD" : "EDIT ACHIEVEMENT RECORD"}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {isNew ? "Celebrate what you accomplished." : "Refine your milestone."}
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
          Achievement title
          <input
            name="title"
            defaultValue={achievement.title}
            placeholder="e.g. Reduced API latency by 45% with query caching layer"
            autoFocus
            required
            maxLength={180}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Category
            <select
              name="category"
              defaultValue={achievement.category}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            >
              <option value="Technical">Technical</option>
              <option value="Leadership">Leadership</option>
              <option value="Delivery">Delivery</option>
              <option value="Innovation">Innovation</option>
              <option value="Impact">Impact</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Date achieved
            <input
              name="date"
              type="date"
              defaultValue={achievement.date}
              required
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Measurable impact / outcome
          <input
            name="impact"
            defaultValue={achievement.impact}
            placeholder="e.g. Accelerated page load to sub-100ms and saved 20GB monthly egress"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Skills demonstrated (comma separated)
          <input
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="e.g. PostgreSQL, Next.js, Redis, Performance Tuning"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Context & details (optional)
          <textarea
            name="details"
            defaultValue={achievement.details || ""}
            placeholder="Add background, challenges overcome, or team dependencies"
            rows={2}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={() => {
                void removeAchievement(achievement.id);
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
            Save achievement
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
