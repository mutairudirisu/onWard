"use client";

import { FormEvent, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import {
  useWorkspace,
  type ReportSection,
  type ReportType,
  type WorkspaceReport,
} from "@/lib/workspace-context";

export function ReportDialog({
  report,
  close,
}: {
  report: WorkspaceReport;
  close: () => void;
}) {
  const { tasks, achievements, workLogs } = useTasks();
  const {
    saveReport,
    deleteReport,
    projects,
    setExportingReport,
    activeWorkspace,
  } = useWorkspace();

  const [title, setTitle] = useState(report.title);
  const [reportType, setReportType] = useState<ReportType>(report.report_type);
  const [reportingPeriod, setReportingPeriod] = useState(report.reporting_period);
  const [projectId, setProjectId] = useState(report.project_id || "");
  const [status, setStatus] = useState<"draft" | "published">(report.status);
  const [sections, setSections] = useState<ReportSection[]>(report.sections);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>(
    report.source_record_ids || []
  );

  const isNew = !report.id;

  // Add a section
  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        title: "New Section",
        content: "",
      },
    ]);
  }

  function updateSection(id: string, key: "title" | "content", value: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  // Pre-seed sections from selected real source records (Zero Hallucination)
  function compileFromSourceRecords() {
    const selectedTasks = tasks.filter((t) => selectedRecordIds.includes(t.id));
    const selectedAchievements = achievements.filter((a) =>
      selectedRecordIds.includes(a.id)
    );
    const selectedLogs = workLogs.filter((w) => selectedRecordIds.includes(w.id));

    const newSections: ReportSection[] = [];

    if (selectedTasks.length) {
      newSections.push({
        id: `sec-tasks-${Date.now()}`,
        title: "Tasks & Completed Milestones",
        content: selectedTasks
          .map(
            (t) =>
              `• ${t.title} [${t.category}] - Status: ${t.completed ? "Completed" : "In Progress"} (Due: ${t.due_date})`
          )
          .join("\n"),
      });
    }

    if (selectedAchievements.length) {
      newSections.push({
        id: `sec-achieve-${Date.now()}`,
        title: "Key Achievements & Measured Impact",
        content: selectedAchievements
          .map(
            (a) =>
              `• ${a.title} (${a.date})\n  - Impact: ${a.impact}\n  - Skills: ${a.skills.join(", ")}`
          )
          .join("\n"),
      });
    }

    if (selectedLogs.length) {
      newSections.push({
        id: `sec-logs-${Date.now()}`,
        title: "Operational Work Logs & Lessons Learned",
        content: selectedLogs
          .map(
            (w) =>
              `• ${w.title} (${w.date})\n  - Deliverable: ${w.outcomes}\n  - Lesson Learned: ${w.lessons_learned}`
          )
          .join("\n"),
      });
    }

    if (newSections.length) {
      setSections(newSections);
      setShowSourcePicker(false);
    }
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    const saved = await saveReport({
      ...(report.id ? { id: report.id } : {}),
      title: title.trim(),
      report_type: reportType,
      reporting_period: reportingPeriod.trim(),
      project_id: projectId || null,
      status,
      sections,
      source_record_ids: selectedRecordIds,
    });

    close();
    return saved;
  }

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Report Editor">
      <form onSubmit={handleSave} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {activeWorkspace?.name || "WORKSPACE"} / {isNew ? "NEW REPORT" : "EDIT REPORT"}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title || "Professional Report"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={() => {
                  setExportingReport({
                    ...report,
                    title,
                    report_type: reportType,
                    reporting_period: reportingPeriod,
                    sections,
                    status,
                  });
                }}
                className="flex h-8 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
              >
                <Icon name="share" size={14} />
                <span>Export preview</span>
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            >
              ×
            </button>
          </div>
        </div>

        {/* Title & Reporting Period */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Report title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Sprint Technical & Delivery Report"
              required
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Reporting period
            <input
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              placeholder="e.g. Oct 20 - Oct 26, 2026"
              required
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </label>
        </div>

        {/* Report Type, Project & Status */}
        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Report template / type
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="weekly">Weekly Work Report</option>
              <option value="project_update">Project Update</option>
              <option value="meeting">Meeting Report</option>
              <option value="activity">Activity Report</option>
              <option value="general">General Report</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Linked Project
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">No project link</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        {/* Generate from source records button */}
        <div className="flex items-center justify-between rounded-xl bg-[#edf6d5]/70 p-3 text-xs dark:bg-[#1a2208]">
          <div className="flex items-center gap-2 text-[#3d4b24] dark:text-[#d3f36b]">
            <Icon name="sparkles" size={16} />
            <span>Generate report sections from actual tasks, logs, and achievements</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSourcePicker(!showSourcePicker)}
            className="rounded-lg bg-[#d3f36b] px-3 py-1 font-bold text-[#283618] hover:bg-[#c4e65d]"
          >
            {showSourcePicker ? "Hide Picker" : "Select Source Records"}
          </button>
        </div>

        {/* Source records picker modal drawer */}
        {showSourcePicker && (
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-xl border border-zinc-200 p-2 text-xs dark:border-zinc-800">
            <span className="font-bold text-zinc-500">Pick records:</span>
            {tasks.map((t) => (
              <label key={t.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRecordIds.includes(t.id)}
                  onChange={(e) =>
                    setSelectedRecordIds((prev) =>
                      e.target.checked ? [...prev, t.id] : prev.filter((id) => id !== t.id)
                    )
                  }
                />
                <span className="text-[#85a900]">[Task]</span>
                <span className="truncate">{t.title}</span>
              </label>
            ))}
            {achievements.map((a) => (
              <label key={a.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRecordIds.includes(a.id)}
                  onChange={(e) =>
                    setSelectedRecordIds((prev) =>
                      e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)
                    )
                  }
                />
                <span className="text-purple-600">[Achievement]</span>
                <span className="truncate">{a.title}</span>
              </label>
            ))}
            {workLogs.map((w) => (
              <label key={w.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRecordIds.includes(w.id)}
                  onChange={(e) =>
                    setSelectedRecordIds((prev) =>
                      e.target.checked ? [...prev, w.id] : prev.filter((id) => id !== w.id)
                    )
                  }
                />
                <span className="text-blue-600">[Work Log]</span>
                <span className="truncate">{w.title}</span>
              </label>
            ))}
            <button
              type="button"
              onClick={compileFromSourceRecords}
              className="mt-1 rounded bg-[#d3f36b] py-1 text-center font-bold text-[#283618]"
            >
              Insert Selected into Report
            </button>
          </div>
        )}

        {/* Report Sections builder */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Report Sections ({sections.length})
            </span>
            <button
              type="button"
              onClick={addSection}
              className="text-xs font-bold text-[#85a900] hover:underline"
            >
              + Add Section
            </button>
          </div>

          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
            {sections.map((sec) => (
              <div
                key={sec.id}
                className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <input
                    value={sec.title}
                    onChange={(e) => updateSection(sec.id, "title", e.target.value)}
                    placeholder="Section title"
                    className="font-bold text-zinc-900 outline-none dark:text-zinc-100"
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sec.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                      title="Remove section"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <textarea
                  value={sec.content}
                  onChange={(e) => updateSection(sec.id, "content", e.target.value)}
                  placeholder="Section findings, analysis, and data..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-100 bg-zinc-50 p-2 text-xs leading-relaxed outline-none dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-200"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={async () => {
                await deleteReport(report.id);
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
            Save report
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
