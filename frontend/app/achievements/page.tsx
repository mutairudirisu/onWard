"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useTasks, type Achievement } from "@/lib/task-context";
import { PersonalTabs } from "@/components/PersonalTabs";
import { BackButton } from "@/components/BackButton";
import { AchievementShareDialog } from "@/components/AchievementShareDialog";

export default function AchievementsPage() {
  const { achievements, setEditingAchievement, openCreateModal, openSummaryModal } = useTasks();
  const [sharingAchievement, setSharingAchievement] = useState<Achievement | null>(null);

  return (
    <div className="clean-screen">
      <header className="clean-screen-header">
        <div className="flex items-center gap-2">
          <BackButton href="/tasks" />
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Personal / Achievements
            </p>
            <h1 className="clean-screen-title">Achievements</h1>
          </div>
        </div>
        <div className="clean-screen-actions">
          <button
            type="button"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => openSummaryModal("appraisal")}
          >
            <Icon name="sparkles" size={15} />
            <span>Generate onWards</span>
          </button>
          <button
            type="button"
            className="clean-icon-button"
            onClick={() => openCreateModal("achievement")}
            aria-label="Record achievement"
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </header>

      <div className="mb-3 px-5 sm:px-0">
        <PersonalTabs />
      </div>

      {achievements.length ? (
        <div className="flex flex-col gap-3.5">
          {achievements.map((ach) => (
            <article
              key={ach.id}
              onClick={() => setEditingAchievement(ach)}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#edf6d5] px-3 py-1 text-[11px] font-bold text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]">
                    {ach.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">{ach.date}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSharingAchievement(ach);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-bold text-zinc-700 transition hover:border-[#85a900] hover:bg-[#edf6d5] hover:text-[#3d4b24] active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#d3f36b] dark:hover:bg-[#20290e] dark:hover:text-[#d3f36b]"
                      title="Share this achievement"
                      aria-label={`Share ${ach.title}`}
                    >
                      <Icon name="share" size={12} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <h3 className="mt-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {ach.title}
                </h3>

                <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                  <b className="font-bold text-[#85a900]">Impact: </b>
                  {ach.impact}
                </div>

                {ach.details && (
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {ach.details}
                  </p>
                )}
              </div>

              {ach.skills.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  {ach.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-focus">
          <div>
            <Icon name="award" size={20} />
          </div>
          <b>No achievements logged yet.</b>
          <span>Record milestone results and accomplishments over time.</span>
          <button type="button" onClick={() => openCreateModal("achievement")}>
            Record achievement <Icon name="arrow" size={15} />
          </button>
        </div>
      )}

      {sharingAchievement && (
        <AchievementShareDialog
          achievement={sharingAchievement}
          close={() => setSharingAchievement(null)}
        />
      )}
    </div>
  );
}
