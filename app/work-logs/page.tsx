"use client";

import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import { PersonalTabs } from "@/components/PersonalTabs";
import { BackButton } from "@/components/BackButton";

export default function WorkLogsPage() {
  const { workLogs, setEditingWorkLog, openCreateModal, openSummaryModal } = useTasks();

  return (
    <div className="clean-screen">
      <header className="clean-screen-header">
        <div className="flex items-center gap-2">
          <BackButton href="/tasks" />
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Personal / Work Logs
            </p>
            <h1 className="clean-screen-title">Work Logs</h1>
          </div>
        </div>
        <div className="clean-screen-actions">
          <button
            type="button"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => openSummaryModal("cv")}
          >
            <Icon name="sparkles" size={15} />
            <span>Generate summary</span>
          </button>
          <button
            type="button"
            className="clean-icon-button"
            onClick={() => openCreateModal("worklog")}
            aria-label="New work log"
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </header>

      <div className="mb-3 px-5 sm:px-0">
        <PersonalTabs />
      </div>

      {workLogs.length ? (
        <div className="flex flex-col gap-3.5">
          {workLogs.map((log) => (
            <article
              key={log.id}
              onClick={() => setEditingWorkLog(log)}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                    {log.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    {log.hours && <span>{log.hours}h · </span>}
                    <span>{log.date}</span>
                  </div>
                </div>

                <h3 className="mt-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {log.title}
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                    <b className="block font-bold text-zinc-900 dark:text-zinc-100">
                      Deliverables & Outcomes:
                    </b>
                    <span className="mt-1 block leading-relaxed">{log.outcomes}</span>
                  </div>

                  <div className="rounded-xl bg-[#edf6d5]/70 p-3 text-xs text-[#3d4b24] dark:bg-[#20290e]/70 dark:text-[#d3f36b]">
                    <b className="block font-bold">
                      Lessons Learned:
                    </b>
                    <span className="mt-1 block leading-relaxed">{log.lessons_learned}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-focus">
          <div>
            <Icon name="bookOpen" size={20} />
          </div>
          <b>No work logs yet.</b>
          <span>Document completed activities, outcomes, and insights over time.</span>
          <button type="button" onClick={() => openCreateModal("worklog")}>
            New work log <Icon name="arrow" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
