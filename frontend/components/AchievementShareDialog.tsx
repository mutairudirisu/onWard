"use client";

import { useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import type { Achievement } from "@/lib/task-context";

export function AchievementShareDialog({
  achievement,
  close,
}: {
  achievement: Achievement;
  close: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  const formattedShareText = `🚀 Milestone Achievement on onWard:

"${achievement.title}"

🎯 Category: ${achievement.category}
📊 Impact: ${achievement.impact}
${achievement.details ? `📝 Details: ${achievement.details}\n` : ""}🛠️ Skills: ${achievement.skills.join(", ")}
📅 Completed: ${achievement.date}

#onWard #CareerGrowth #Milestone #ProfessionalImpact`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setCopyFeedback("Post text copied!");
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback("");
      }, 3000);
    } catch {
      setCopyFeedback("Failed to copy. Please select and copy manually.");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Milestone: ${achievement.title}`,
          text: formattedShareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled or error, fallback to copy
        void handleCopyText();
      }
    } else {
      void handleCopyText();
    }
  };

  const handleLinkedInShare = () => {
    const text = encodeURIComponent(formattedShareText);
    const url = encodeURIComponent(window.location.origin);
    // Open LinkedIn feed share
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleTwitterShare = () => {
    const tweet = encodeURIComponent(
      `🎯 Milestone achieved: "${achievement.title}"\n\nImpact: ${achievement.impact}\n\nTracked with @onWard #careergrowth`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(formattedShareText);
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Share achievement">
      <div className="flex flex-col gap-4 pt-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#85a900] uppercase">
              <Icon name="award" size={13} />
              <span>Share Individual Achievement</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Celebrate your milestone
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Milestone Brag Card Preview */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#d3f36b]/60 bg-gradient-to-br from-white via-zinc-50 to-[#edf6d5]/30 p-4.5 shadow-sm dark:border-[#3d4b24] dark:from-zinc-900 dark:via-zinc-900 dark:to-[#20290e]/30">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d3f36b] px-3 py-0.5 text-[10px] font-extrabold tracking-wide text-[#283618] uppercase">
              ✦ {achievement.category}
            </span>
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
              {achievement.date}
            </span>
          </div>

          <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
            {achievement.title}
          </h3>

          <div className="mt-2 rounded-xl border-l-2 border-[#85a900] bg-white/80 p-3 text-xs text-zinc-700 shadow-xs dark:bg-zinc-800/80 dark:text-zinc-300">
            <span className="font-bold text-[#85a900]">Measurable Impact: </span>
            <span className="font-medium">{achievement.impact}</span>
          </div>

          {achievement.details && (
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {achievement.details}
            </p>
          )}

          {achievement.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {achievement.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  #{s}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3.5 flex items-center justify-between border-t border-zinc-200/60 pt-2 text-[10px] text-zinc-400 dark:border-zinc-800">
            <span className="font-semibold text-zinc-500 dark:text-zinc-400">
              Verified Achievement
            </span>
            <span className="font-bold text-[#85a900]">onWard Progress Tracker</span>
          </div>
        </div>

        {/* Share Buttons Grid */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold text-zinc-500 uppercase dark:text-zinc-400">
            Share to Platform
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleLinkedInShare}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold text-zinc-800 transition hover:border-[#0077b5] hover:bg-[#0077b5]/5 hover:text-[#0077b5] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-[#0077b5]"
            >
              <Icon name="linkedin" size={18} className="text-[#0077b5]" />
              <span>LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={handleTwitterShare}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-white"
            >
              <Icon name="twitter" size={18} />
              <span>X / Twitter</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold text-zinc-800 transition hover:border-[#25d366] hover:bg-[#25d366]/5 hover:text-[#25d366] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-[#25d366]"
            >
              <Icon name="whatsapp" size={18} className="text-[#25d366]" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition ${
                copied
                  ? "border-[#85a900] bg-[#edf6d5] text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              <Icon name={copied ? "check" : "copy"} size={15} />
              <span>{copied ? "Copied to clipboard!" : "Copy formatted post"}</span>
            </button>

            {typeof navigator !== "undefined" && Boolean(navigator.share) && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#d3f36b] px-4 text-xs font-bold text-[#283618] shadow-sm transition hover:bg-[#c4e65d] active:scale-95"
                title="Open device share menu"
              >
                <Icon name="share" size={15} />
                <span>Device share</span>
              </button>
            )}
          </div>

          {copyFeedback && (
            <p className="text-center text-xs font-semibold text-[#85a900]">{copyFeedback}</p>
          )}
        </div>
      </div>
    </DraggableModal>
  );
}
