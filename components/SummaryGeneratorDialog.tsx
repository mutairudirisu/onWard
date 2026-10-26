"use client";

import { useMemo, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import { useTasks, type SummaryType } from "@/lib/task-context";

export function SummaryGeneratorDialog({
  isOpen,
  onClose,
  initialType = "appraisal",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialType?: SummaryType;
}) {
  const { achievements, workLogs, setNotice } = useTasks();
  const [format, setFormat] = useState<SummaryType>(initialType);
  const [selectedAchievementIds, setSelectedAchievementIds] = useState<string[]>(
    achievements.map((a) => a.id)
  );
  const [selectedWorkLogIds, setSelectedWorkLogIds] = useState<string[]>(
    workLogs.map((w) => w.id)
  );

  const selectedAchievements = useMemo(
    () => achievements.filter((a) => selectedAchievementIds.includes(a.id)),
    [achievements, selectedAchievementIds]
  );

  const selectedWorkLogs = useMemo(
    () => workLogs.filter((w) => selectedWorkLogIds.includes(w.id)),
    [workLogs, selectedWorkLogIds]
  );

  // Deterministic summary generation directly from saved entries - ZERO hallucinations
  const generatedText = useMemo(() => {
    if (!selectedAchievements.length && !selectedWorkLogs.length) {
      return "Select at least one achievement or work log to compile a summary.";
    }

    if (format === "appraisal") {
      let out = `## Professional Performance Appraisal\n\n### Key Achievements & Measured Impact\n`;
      selectedAchievements.forEach((ach) => {
        out += `• ${ach.title} (${ach.date})\n  - Impact: ${ach.impact}\n  - Core Skills: ${ach.skills.join(", ") || "General"}\n`;
        if (ach.details) out += `  - Details: ${ach.details}\n`;
      });
      out += `\n### Continuous Delivery & Problem Solving\n`;
      selectedWorkLogs.forEach((log) => {
        out += `• ${log.title} (${log.date})\n  - Outcome: ${log.outcomes}\n  - Key Lesson: ${log.lessons_learned}\n`;
      });
      return out;
    }

    if (format === "cv") {
      let out = `## Curriculum Vitae / Resume Accomplishment Highlights\n\n`;
      selectedAchievements.forEach((ach) => {
        out += `• Spearheaded "${ach.title}", resulting in ${ach.impact.toLowerCase().startsWith("accelerated") || ach.impact.toLowerCase().startsWith("reduced") ? ach.impact : `measurable impact: ${ach.impact}`} [Skills: ${ach.skills.join(", ")}].\n`;
      });
      selectedWorkLogs.forEach((log) => {
        out += `• Executed "${log.title}", delivering ${log.outcomes} while applying lessons in ${log.lessons_learned}.\n`;
      });
      return out;
    }

    // Portfolio
    let out = `## Project Portfolio & Case Studies\n\n`;
    selectedAchievements.forEach((ach, idx) => {
      out += `### Project ${idx + 1}: ${ach.title}\n`;
      out += `**Date:** ${ach.date} | **Category:** ${ach.category}\n`;
      out += `**Measurable Result:** ${ach.impact}\n`;
      out += `**Technologies / Competencies:** ${ach.skills.join(", ")}\n`;
      if (ach.details) out += `**Overview:** ${ach.details}\n`;
      out += `\n`;
    });
    if (selectedWorkLogs.length) {
      out += `### Technical Work Logs & Operational Insights\n`;
      selectedWorkLogs.forEach((log) => {
        out += `• **${log.title}** (${log.date}): Delivered ${log.outcomes} (Takeaway: ${log.lessons_learned})\n`;
      });
    }
    return out;
  }, [format, selectedAchievements, selectedWorkLogs]);

  function copyToClipboard() {
    navigator.clipboard.writeText(generatedText);
    setNotice("Summary copied to clipboard.");
  }

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} ariaLabel="Generate Professional Summary">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              PROFESSIONAL SUMMARY GENERATOR
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Derive insights from real records
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            ×
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setFormat("appraisal")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              format === "appraisal"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Appraisal
          </button>
          <button
            type="button"
            onClick={() => setFormat("cv")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              format === "cv"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            CV / Resume
          </button>
          <button
            type="button"
            onClick={() => setFormat("portfolio")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              format === "portfolio"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Portfolio
          </button>
        </div>

        {/* Data verification guarantee banner */}
        <div className="flex items-center gap-2 rounded-xl bg-[#edf6d5] p-2.5 text-xs font-semibold text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]">
          <Icon name="check" size={16} />
          <span>Verified from actual saved records: Zero hallucinations or fabricated metrics.</span>
        </div>

        {/* Record selection toggles */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-zinc-500">
            Select records to include ({selectedAchievements.length + selectedWorkLogs.length} selected):
          </span>
          <div className="flex max-h-36 flex-col gap-1.5 overflow-y-auto rounded-xl border border-zinc-200 p-2 dark:border-zinc-800">
            {achievements.map((ach) => (
              <label
                key={ach.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={selectedAchievementIds.includes(ach.id)}
                  onChange={(e) => {
                    setSelectedAchievementIds((prev) =>
                      e.target.checked
                        ? [...prev, ach.id]
                        : prev.filter((id) => id !== ach.id)
                    );
                  }}
                  className="rounded text-[#85a900]"
                />
                <span className="font-semibold text-[#85a900]">[Achievement]</span>
                <span className="truncate">{ach.title}</span>
              </label>
            ))}
            {workLogs.map((log) => (
              <label
                key={log.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={selectedWorkLogIds.includes(log.id)}
                  onChange={(e) => {
                    setSelectedWorkLogIds((prev) =>
                      e.target.checked
                        ? [...prev, log.id]
                        : prev.filter((id) => id !== log.id)
                    );
                  }}
                  className="rounded text-[#85a900]"
                />
                <span className="font-semibold text-blue-600">[Work Log]</span>
                <span className="truncate">{log.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generated output preview */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-zinc-500">Generated Text Output:</span>
          <textarea
            readOnly
            value={generatedText}
            rows={7}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-800 outline-none select-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>

        <div className="mt-1 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-zinc-200 px-5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
          >
            Close
          </button>
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d3f36b] text-sm font-bold text-[#283618] shadow-md shadow-[#718d3725] transition hover:bg-[#c4e65d] active:scale-[0.98]"
          >
            <Icon name="duplicate" size={16} />
            <span>Copy summary</span>
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
