"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { BackButton } from "@/components/BackButton";
import { useTasks, addDays, fromKey, todayKey } from "@/lib/task-context";
import { useWorkspace } from "@/lib/workspace-context";

type Range = "Week" | "Month" | "Year";

export default function InsightsPage() {
  const { tasks, achievements, workLogs, openSummaryModal } = useTasks();
  const {
    activeWorkspace,
    projects,
    reports,
    members,
    openCreateReport,
    setInspectingRecords,
  } = useWorkspace();

  const [insightSection, setInsightSection] = useState<"personal" | "workspace">("personal");
  const [range, setRange] = useState<Range>("Week");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const today = useMemo(() => fromKey(todayKey()), []);
  const periodDays = range === "Week" ? 7 : range === "Month" ? 30 : 365;
  const beginning = useMemo(() => addDays(today, -(periodDays - 1)), [today, periodDays]);
  const prevBeginning = useMemo(() => addDays(beginning, -periodDays), [beginning, periodDays]);

  const inRange = (dateStr: string, start: Date, end: Date) => {
    try {
      const d = fromKey(dateStr);
      return d >= start && d <= end;
    } catch {
      return false;
    }
  };

  // --- Personal Calculations ---
  const scopedTasks = useMemo(
    () => tasks.filter((t) => inRange(t.due_date, beginning, today)),
    [tasks, beginning, today]
  );
  const earlierTasks = useMemo(
    () => tasks.filter((t) => inRange(t.due_date, prevBeginning, addDays(beginning, -1))),
    [tasks, prevBeginning, beginning]
  );

  const completedTasks = scopedTasks.filter((t) => t.completed);
  const completionRate = scopedTasks.length
    ? Math.round((completedTasks.length / scopedTasks.length) * 100)
    : 0;
  const prevCompletedTasks = earlierTasks.filter((t) => t.completed).length;

  const scopedAchievements = useMemo(
    () => achievements.filter((a) => inRange(a.date, beginning, today)),
    [achievements, beginning, today]
  );

  const scopedWorkLogs = useMemo(
    () => workLogs.filter((w) => inRange(w.date, beginning, today)),
    [workLogs, beginning, today]
  );
  const totalLogHours = scopedWorkLogs.reduce((sum, w) => sum + (w.hours || 0), 0);

  const overdueTasks = tasks.filter((t) => !t.completed && t.due_date < todayKey());

  const labels = range === "Week" ? ["M", "T", "W", "T", "F", "S", "S"] : ["1", "2", "3", "4", "5", "6"];
  const bars = labels.map((_, idx) =>
    completedTasks.filter((t) =>
      range === "Week"
        ? (fromKey(t.due_date).getDay() + 6) % 7 === idx
        : Math.floor((today.getTime() - fromKey(t.due_date).getTime()) / 86400000 / 5) === idx
    ).length
  );
  const maxBar = Math.max(...bars, 1);

  // --- Workspace Calculations ---
  const activeWorkspaceProjects = useMemo(() => {
    const wsId = activeWorkspace?.id;
    return projects.filter((p) => (wsId ? p.workspace_id === wsId : true));
  }, [projects, activeWorkspace]);

  const filteredProjects = useMemo(() => {
    if (selectedProjectId === "all") return activeWorkspaceProjects;
    return activeWorkspaceProjects.filter((p) => p.id === selectedProjectId);
  }, [activeWorkspaceProjects, selectedProjectId]);

  const projectStatusCounts = useMemo(() => {
    return {
      planned: filteredProjects.filter((p) => p.status === "planned").length,
      in_progress: filteredProjects.filter((p) => p.status === "in_progress").length,
      completed: filteredProjects.filter((p) => p.status === "completed").length,
      on_hold: filteredProjects.filter((p) => p.status === "on_hold").length,
    };
  }, [filteredProjects]);

  const scopedReports = useMemo(() => {
    const wsId = activeWorkspace?.id;
    return reports.filter(
      (r) =>
        (wsId ? r.workspace_id === wsId : true) &&
        (selectedProjectId === "all" ? true : r.project_id === selectedProjectId)
    );
  }, [reports, activeWorkspace, selectedProjectId]);

  const currentMembers = useMemo(() => {
    const wsId = activeWorkspace?.id;
    return members.filter((m) => (wsId ? m.workspace_id === wsId : true));
  }, [members, activeWorkspace]);

  return (
    <div className="clean-screen">
      {/* Top Header */}
      <header className="clean-screen-header">
        <div className="flex items-start gap-2">
          <BackButton href="/" />
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Productivity Insights
            </p>
            <h1 className="clean-screen-title">Progress, at a glance.</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              A gentle look at real verified activity derived strictly from application data.
            </p>
          </div>
        </div>

        <div className="clean-screen-actions">
          <button
            type="button"
            onClick={() => openSummaryModal("appraisal")}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Icon name="sparkles" size={15} />
            <span>Generate summary</span>
          </button>
        </div>
      </header>

      {/* Primary Section Filter: Personal vs. Workspace */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setInsightSection("personal")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition ${
              insightSection === "personal"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Icon name="user" size={14} />
            <span>Personal Insights</span>
          </button>
          <button
            type="button"
            onClick={() => setInsightSection("workspace")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition ${
              insightSection === "workspace"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Icon name="briefcase" size={14} />
            <span>Workspace Insights</span>
          </button>
        </div>

        {/* Date Period Filter */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-900">
          {(["Week", "Month", "Year"] as Range[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`rounded-lg px-3 py-1.5 transition ${
                range === item
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Project Filter (only shown in Workspace tab) */}
      {insightSection === "workspace" && (
        <div className="mb-5 flex items-center justify-between rounded-xl bg-zinc-50 p-3 text-xs dark:bg-zinc-800/60">
          <div className="flex items-center gap-2">
            <b className="text-zinc-700 dark:text-zinc-300">
              Workspace: {activeWorkspace?.name || "Active Workspace"}
            </b>
            <span className="text-zinc-400">· Filter by project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold outline-none dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="all">All Projects ({activeWorkspaceProjects.length})</option>
              {activeWorkspaceProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() =>
              openCreateReport(
                "project_update",
                filteredProjects.map((p) => p.id)
              )
            }
            className="text-xs font-bold text-[#85a900] hover:underline"
          >
            Start report from these metrics ›
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 1: PERSONAL INSIGHTS */}
      {/* ============================================================ */}
      {insightSection === "personal" && (
        <>
          {/* Key Metric Tiles (Clickable to inspect underlying records) */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              onClick={() =>
                setInspectingRecords({
                  title: `Tasks Completed (${range})`,
                  recordIds: completedTasks.map((t) => t.id),
                  type: "tasks",
                })
              }
              className="group cursor-pointer rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-xs font-semibold text-zinc-400">Tasks Completed</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {completedTasks.length}
              </b>
              <span className="mt-1 block text-[11px] text-zinc-400 group-hover:text-[#85a900]">
                {earlierTasks.length
                  ? `${completedTasks.length - prevCompletedTasks >= 0 ? "+" : ""}${completedTasks.length - prevCompletedTasks} vs. previous`
                  : "View records ›"}
              </span>
            </div>

            <div
              onClick={() =>
                setInspectingRecords({
                  title: `Achievements Recorded (${range})`,
                  recordIds: scopedAchievements.map((a) => a.id),
                  type: "achievements",
                })
              }
              className="group cursor-pointer rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-xs font-semibold text-zinc-400">Achievements</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {scopedAchievements.length}
              </b>
              <span className="mt-1 block text-[11px] text-[#85a900]">
                Inspect achievements ›
              </span>
            </div>

            <div
              onClick={() =>
                setInspectingRecords({
                  title: `Work Logs (${range})`,
                  recordIds: scopedWorkLogs.map((w) => w.id),
                  type: "worklogs",
                })
              }
              className="group cursor-pointer rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-xs font-semibold text-zinc-400">Work Logs</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {scopedWorkLogs.length}
              </b>
              <span className="mt-1 block text-[11px] text-zinc-400 group-hover:text-[#85a900]">
                {totalLogHours ? `${totalLogHours} hours documented ›` : "View work logs ›"}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs font-semibold text-zinc-400">Completion Rate</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {completionRate}%
              </b>
              <span className="mt-1 block text-[11px] text-zinc-400">
                {scopedTasks.length ? `${completedTasks.length} of ${scopedTasks.length} tasks` : "No tasks due"}
              </span>
            </div>
          </div>

          {/* Activity Trend Chart */}
          <section className="mb-6 rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  ACTIVITY TREND
                </p>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Tasks completed over {range.toLowerCase()}
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                {completedTasks.length} total completed
              </span>
            </div>

            <div className="flex h-36 items-end gap-2 sm:gap-3">
              {bars.map((count, index) => {
                const heightPercent = Math.max((count / maxBar) * 100, count ? 14 : 4);
                return (
                  <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400">
                      {count > 0 ? count : ""}
                    </span>
                    <div className="w-full rounded-t-lg bg-zinc-100 dark:bg-zinc-800">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-lg bg-[#d3f36b] transition-all duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400">
                      {labels[index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Task Breakdown & Encouragement */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                STATUS BREAKDOWN
              </p>
              <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Where things stand
              </h3>

              <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  style={{
                    width: `${scopedTasks.length ? (completedTasks.length / scopedTasks.length) * 100 : 0}%`,
                  }}
                  className="bg-[#d3f36b]"
                />
                <div
                  style={{
                    width: `${scopedTasks.length ? ((scopedTasks.length - completedTasks.length) / scopedTasks.length) * 100 : 0}%`,
                  }}
                  className="bg-zinc-300 dark:bg-zinc-600"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#d3f36b]" />
                  Completed ({completedTasks.length})
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  Pending ({scopedTasks.length - completedTasks.length})
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  Overdue ({overdueTasks.length})
                </span>
              </div>
            </section>

            <section className="rounded-3xl border border-[#b8e85e] bg-[#f4ffe0]/60 p-5 dark:border-[#496612] dark:bg-[#1f280a]/30">
              <p className="text-[10px] font-bold tracking-widest text-[#496612] uppercase dark:text-[#d3f36b]">
                PROFESSIONAL SUMMARY READY
              </p>
              <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Turn your saved records into summaries
              </h3>
              <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                You have {scopedAchievements.length} achievements and {scopedWorkLogs.length} work logs documented. Ready to compile into verified CV bullets or appraisal points with zero hallucinations.
              </p>
              <button
                type="button"
                onClick={() => openSummaryModal("appraisal")}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#d3f36b] px-4 py-2 text-xs font-bold text-[#283618] shadow-sm hover:bg-[#c4e65d]"
              >
                <Icon name="sparkles" size={14} />
                <span>Open summary generator</span>
              </button>
            </section>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: WORKSPACE INSIGHTS */}
      {/* ============================================================ */}
      {insightSection === "workspace" && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              onClick={() =>
                setInspectingRecords({
                  title: `Active Projects (${activeWorkspace?.name || ""})`,
                  recordIds: filteredProjects.map((p) => p.id),
                  type: "projects",
                })
              }
              className="group cursor-pointer rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-xs font-semibold text-zinc-400">Projects Tracked</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {filteredProjects.length}
              </b>
              <span className="mt-1 block text-[11px] text-[#85a900]">
                {projectStatusCounts.in_progress} in progress ›
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs font-semibold text-zinc-400">Reports Created</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {scopedReports.length}
              </b>
              <span className="mt-1 block text-[11px] text-zinc-400">
                {scopedReports.filter((r) => r.status === "published").length} published
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs font-semibold text-zinc-400">Team Collaborators</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {currentMembers.length}
              </b>
              <span className="mt-1 block text-[11px] text-zinc-400">
                {currentMembers.filter((m) => m.role === "editor").length} editors
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs font-semibold text-zinc-400">Completed Projects</span>
              <b className="mt-1 block text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {projectStatusCounts.completed}
              </b>
              <span className="mt-1 block text-[11px] text-zinc-400">
                {projectStatusCounts.planned} planned
              </span>
            </div>
          </div>

          {/* Project Status Breakdown Grid */}
          <section className="mb-6 rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  PROJECT PIPELINE
                </p>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Project Status & Milestone Alignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  openCreateReport(
                    "project_update",
                    filteredProjects.map((p) => p.id)
                  )
                }
                className="flex items-center gap-1 text-xs font-bold text-[#85a900] hover:underline"
              >
                <Icon name="chart" size={13} />
                <span>Compile Project Report</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-blue-50/70 p-3 text-center dark:bg-blue-950/30">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  In Progress
                </span>
                <b className="mt-1 block text-xl font-black text-blue-950 dark:text-blue-100">
                  {projectStatusCounts.in_progress}
                </b>
              </div>
              <div className="rounded-xl bg-amber-50/70 p-3 text-center dark:bg-amber-950/30">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Planned
                </span>
                <b className="mt-1 block text-xl font-black text-amber-950 dark:text-amber-100">
                  {projectStatusCounts.planned}
                </b>
              </div>
              <div className="rounded-xl bg-[#edf6d5] p-3 text-center dark:bg-[#20290e]">
                <span className="text-xs font-semibold text-[#3d4b24] dark:text-[#d3f36b]">
                  Completed
                </span>
                <b className="mt-1 block text-xl font-black text-[#283618] dark:text-[#d3f36b]">
                  {projectStatusCounts.completed}
                </b>
              </div>
              <div className="rounded-xl bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  On Hold
                </span>
                <b className="mt-1 block text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {projectStatusCounts.on_hold}
                </b>
              </div>
            </div>
          </section>

          {/* Team Activity Overview */}
          <section className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              TEAM COLLABORATION
            </p>
            <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
              Authorized Workspace Members ({currentMembers.length})
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {currentMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 text-xs dark:border-zinc-800"
                >
                  <div>
                    <b className="text-zinc-900 dark:text-zinc-100">{m.name}</b>
                    <span className="block text-zinc-400">{m.email}</span>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {m.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
