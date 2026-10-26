"use client";

import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import { useWorkspace } from "@/lib/workspace-context";

export function RecordDetailsDrawer({
  data,
  close,
}: {
  data: {
    title: string;
    recordIds: string[];
    type: "tasks" | "achievements" | "worklogs" | "projects";
  };
  close: () => void;
}) {
  const { tasks, achievements, workLogs, setEditingTask, setEditingAchievement, setEditingWorkLog } =
    useTasks();
  const { projects, openCreateReport } = useWorkspace();

  const matchingTasks = tasks.filter((t) => data.recordIds.includes(t.id));
  const matchingAchievements = achievements.filter((a) => data.recordIds.includes(a.id));
  const matchingLogs = workLogs.filter((w) => data.recordIds.includes(w.id));
  const matchingProjects = projects.filter((p) => data.recordIds.includes(p.id));

  function handleCreateReportFromThis() {
    close();
    openCreateReport("activity", data.recordIds);
  }

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Underlying Records">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              SUPPORTING APPLICATION RECORDS
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {data.title}
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

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The verified records below directly support this metric. Click any entry to inspect or edit.
        </p>

        {/* List of records */}
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
          {matchingTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                close();
                setEditingTask(t);
              }}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 p-3 text-xs transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
            >
              <div>
                <b className="text-zinc-900 dark:text-zinc-100">{t.title}</b>
                <span className="block text-zinc-400">Due: {t.due_date} · {t.category}</span>
              </div>
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {t.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))}

          {matchingAchievements.map((a) => (
            <div
              key={a.id}
              onClick={() => {
                close();
                setEditingAchievement(a);
              }}
              className="flex cursor-pointer flex-col gap-1 rounded-xl border border-zinc-200 p-3 text-xs transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
            >
              <div className="flex items-center justify-between">
                <b className="text-zinc-900 dark:text-zinc-100">{a.title}</b>
                <span className="text-zinc-400">{a.date}</span>
              </div>
              <p className="text-[#85a900]">{a.impact}</p>
            </div>
          ))}

          {matchingLogs.map((w) => (
            <div
              key={w.id}
              onClick={() => {
                close();
                setEditingWorkLog(w);
              }}
              className="flex cursor-pointer flex-col gap-1 rounded-xl border border-zinc-200 p-3 text-xs transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
            >
              <div className="flex items-center justify-between">
                <b className="text-zinc-900 dark:text-zinc-100">{w.title}</b>
                <span className="text-zinc-400">{w.date}</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300">{w.outcomes}</p>
            </div>
          ))}

          {matchingProjects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 text-xs dark:border-zinc-800"
            >
              <div>
                <b className="text-zinc-900 dark:text-zinc-100">{p.title}</b>
                <span className="block text-zinc-400">Due: {p.due_date}</span>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {p.status}
              </span>
            </div>
          ))}
        </div>

        {/* Start report from this action */}
        <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={close}
            className="h-10 rounded-xl px-4 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleCreateReportFromThis}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#d3f36b] px-4 text-xs font-bold text-[#283618] shadow-sm hover:bg-[#c4e65d]"
          >
            <Icon name="sparkles" size={14} />
            <span>Use as basis for report</span>
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
