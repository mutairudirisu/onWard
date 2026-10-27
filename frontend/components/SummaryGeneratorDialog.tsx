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

    if (format === "linkedin") {
      let out = `🚀 Proud to share some key milestones and momentum onWard!\n\n`;
      out += `Reflecting on recent engineering and product outcomes delivered:\n\n`;
      selectedAchievements.forEach((ach) => {
        out += `🔹 ${ach.title}\n`;
        out += `   • Impact: ${ach.impact}\n`;
        if (ach.skills.length) out += `   • Stack / Competencies: ${ach.skills.join(", ")}\n`;
        out += `\n`;
      });
      if (selectedWorkLogs.length) {
        out += `Operational takeaways from the field:\n`;
        selectedWorkLogs.slice(0, 3).forEach((log) => {
          out += `💡 ${log.title}: ${log.lessons_learned || log.outcomes}\n`;
        });
        out += `\n`;
      }
      out += `Continuous momentum, one step at a time. A little progress, every day 🌱\n\n`;
      out += `#SoftwareEngineering #TechMilestones #Productivity #CareerGrowth #onWard #BuildInPublic`;
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
    setNotice("onWards copied to clipboard.");
  }

  function shareLinkedIn() {
    navigator.clipboard.writeText(generatedText);
    setNotice("Post copied to clipboard! Opening LinkedIn...");
    const url = "https://www.linkedin.com/feed/?shareActive=true&text=" + encodeURIComponent(generatedText);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareTwitter() {
    const tweet =
      generatedText.length > 250
        ? generatedText.slice(0, 240) + "...\n#onWard"
        : generatedText;
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function shareNative() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "onWard Professional Milestones",
          text: generatedText,
        });
        setNotice("Shared successfully.");
      } catch {
        // user dismissed dialog
      }
    } else {
      copyToClipboard();
    }
  }

  function downloadMarkdown() {
    const blob = new Blob([generatedText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `onWard-${format}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Downloaded markdown file.");
  }

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} ariaLabel="Generate onWards">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              GENERATE ONWARDS
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Turn everyday progress into shareable proof
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

        {/* Format Selector with LinkedIn Post */}
        <div className="grid grid-cols-4 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setFormat("linkedin")}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              format === "linkedin"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm font-extrabold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            LinkedIn Post
          </button>
          <button
            type="button"
            onClick={() => setFormat("appraisal")}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              format === "appraisal"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm font-extrabold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Appraisal
          </button>
          <button
            type="button"
            onClick={() => setFormat("cv")}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              format === "cv"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm font-extrabold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            CV / Resume
          </button>
          <button
            type="button"
            onClick={() => setFormat("portfolio")}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              format === "portfolio"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm font-extrabold"
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
            Select records to compile ({selectedAchievements.length + selectedWorkLogs.length} selected):
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Compiled onWard Output:</span>
            <span className="text-[10px] text-zinc-400">Ready to publish & share</span>
          </div>
          <textarea
            readOnly
            value={generatedText}
            rows={7}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-800 outline-none select-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>

        {/* Sharing Action Toolbar & Controls */}
        <div className="mt-1 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400">Share to:</span>
            <button
              type="button"
              onClick={shareLinkedIn}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[#0a66c2]/30 bg-[#0a66c2]/10 px-3 text-xs font-bold text-[#0a66c2] transition hover:bg-[#0a66c2]/20 active:scale-95 dark:bg-[#0a66c2]/20 dark:text-[#70b5f9]"
              title="Copy post and open LinkedIn"
            >
              <span>💼 LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={shareTwitter}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-3 text-xs font-bold text-zinc-800 transition hover:bg-zinc-200 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              title="Share snippet to X / Twitter"
            >
              <span>𝕏 Post</span>
            </button>
            <button
              type="button"
              onClick={shareNative}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              title="Open device sharing options"
            >
              <Icon name="share" size={13} />
              <span>More...</span>
            </button>
            <button
              type="button"
              onClick={downloadMarkdown}
              className="ml-auto text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              ↓ Download .md
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
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
              <span>Copy onWards</span>
            </button>
          </div>
        </div>
      </div>
    </DraggableModal>
  );
}
