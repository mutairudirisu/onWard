"use client";

import { FormEvent, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { useTasks, type Achievement } from "@/lib/task-context";

type WorkDomain = "general" | "leadership" | "tech" | "product" | "operations";

const DOMAINS: { id: WorkDomain; label: string; icon: string }[] = [
  { id: "general", label: "Core & Universal", icon: "⭐" },
  { id: "leadership", label: "Leadership & Strategy", icon: "👑" },
  { id: "tech", label: "Tech & Eng", icon: "💻" },
  { id: "product", label: "Product & Design", icon: "🎨" },
  { id: "operations", label: "Operations & Business", icon: "📈" },
];

const RECEIPT_TYPES = [
  { label: "Win", icon: "🏆", category: "Delivery" as const },
  { label: "Lesson", icon: "💡", category: "Innovation" as const },
  { label: "Challenge", icon: "🧗", category: "Technical" as const },
  { label: "Feedback", icon: "⭐", category: "Leadership" as const },
  { label: "Milestone", icon: "🚩", category: "Impact" as const },
];

const IMPACT_SUGGESTIONS_BY_DOMAIN: Record<WorkDomain, string[]> = {
  general: [
    "🤝 Aligned 8+ cross-functional stakeholders on key goals",
    "⏱️ Saved 10+ team hours weekly via workflow revamp",
    "🎯 Delivered high-priority organizational milestone on schedule",
    "🌟 Elevated team satisfaction and stakeholder feedback to 95%",
    "💡 Championed new initiative adopted department-wide",
  ],
  leadership: [
    "🌱 Mentored 4 team members through successful project completions",
    "🎯 Defined strategic roadmap and OKRs across 3 squads",
    "🤝 Resolved critical cross-team bottleneck boosting velocity by 30%",
    "🌟 Built high-trust team culture with 100% retention rate",
    "📣 Delivered executive briefing with unanimous leadership buy-in",
  ],
  tech: [
    "⚡ Accelerated page load / API latency by 45%",
    "🛡️ Maintained zero critical production incidents or regressions",
    "💰 Reduced monthly cloud infrastructure egress by 30%",
    "🚀 Automated CI/CD pipeline cutting deployment time to 2 minutes",
    "🏗️ Architected modular services improving test reliability to 99%",
  ],
  product: [
    "📈 Increased user activation and conversion rate by 22%",
    "🎨 Conducted 15 user research interviews and redesigned onboarding",
    "🧩 Created and shipped unified design system across 40+ components",
    "💡 Validated high-impact MVP feature with 92% positive reception",
    "⏱️ Cut time-to-value for new customer cohorts from 14d to 48h",
  ],
  operations: [
    "🏆 Exceeded quarterly target milestone by 125%",
    "🚀 Streamlined operational turnaround time from 5 days to 24 hours",
    "🤝 Negotiated strategic partner agreement saving $40k annually",
    "📊 Built automated reporting dashboard saving 8 management hrs/week",
    "🛡️ Achieved 100% compliance audit score with zero findings",
  ],
};

const SKILLS_BY_DOMAIN: Record<WorkDomain, string[]> = {
  general: [
    "Leadership",
    "Problem solving",
    "Communication",
    "Collaboration",
    "Strategy",
    "Mentoring",
    "Creativity",
    "Learning",
    "Advocacy",
    "Technical delivery",
  ],
  leadership: [
    "Leadership",
    "Strategy",
    "Mentoring",
    "Communication",
    "Change Management",
    "Executive Presence",
    "Collaboration",
    "Conflict Resolution",
    "Advocacy",
  ],
  tech: [
    "Technical delivery",
    "Problem solving",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Supabase",
    "System Architecture",
    "API Design",
    "Performance Tuning",
    "CI/CD",
  ],
  product: [
    "User Research",
    "UI/UX Design",
    "Product Strategy",
    "Prototyping",
    "Creativity",
    "Communication",
    "Data Analysis",
    "Collaboration",
    "Problem solving",
  ],
  operations: [
    "Process Optimization",
    "Strategy",
    "Collaboration",
    "Risk Mitigation",
    "Project Management",
    "Communication",
    "Problem solving",
    "Stakeholder Relations",
  ],
};

export function AchievementDialog({
  achievement,
  close,
}: {
  achievement: Achievement;
  close: () => void;
}) {
  const { saveAchievement, removeAchievement } = useTasks();
  const [skillsStr, setSkillsStr] = useState(achievement.skills.join(", "));
  const [impact, setImpact] = useState(achievement.impact || "");
  const [category, setCategory] = useState<Achievement["category"]>(achievement.category || "Technical");

  // Load domain based on stored user profile preference, defaulting to general
  const [selectedDomain, setSelectedDomain] = useState<WorkDomain>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("onward-work-domain");
      if (saved && ["general", "leadership", "tech", "product", "operations"].includes(saved)) {
        return saved as WorkDomain;
      }
    }
    return "general";
  });

  function handleDomainChange(d: WorkDomain) {
    setSelectedDomain(d);
    if (typeof window !== "undefined") {
      localStorage.setItem("onward-work-domain", d);
    }
  }

  const currentSkillsList = skillsStr
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  function toggleSkill(skillName: string) {
    const list = skillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const index = list.findIndex((s) => s.toLowerCase() === skillName.toLowerCase());
    let next: string[];
    if (index >= 0) {
      next = list.filter((_, idx) => idx !== index);
    } else {
      next = [...list, skillName];
    }
    setSkillsStr(next.join(", "));
  }

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
      category,
      impact: impact.trim(),
      skills,
      details: String(data.get("details") || "").trim() || null,
    });
    close();
  }

  const isNew = !achievement.title;
  const activeImpacts = IMPACT_SUGGESTIONS_BY_DOMAIN[selectedDomain] || IMPACT_SUGGESTIONS_BY_DOMAIN.general;
  const activeSkills = SKILLS_BY_DOMAIN[selectedDomain] || SKILLS_BY_DOMAIN.general;

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

        {/* Receipt Type Pill Chips (matching user visual) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
            Receipt Type
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {RECEIPT_TYPES.map((rt) => {
              const isSelected = category === rt.category;
              return (
                <button
                  key={rt.label}
                  type="button"
                  onClick={() => setCategory(rt.category)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition active:scale-95 ${
                    isSelected
                      ? "border border-[#85a900] bg-[#edf6d5] text-[#283618] shadow-xs dark:border-[#d3f36b] dark:bg-[#20290e] dark:text-[#d3f36b]"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>{rt.icon}</span>
                  <span>{rt.label}</span>
                  {isSelected && <span className="text-[#85a900] dark:text-[#d3f36b]">•</span>}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Achievement title
          <input
            name="title"
            defaultValue={achievement.title}
            placeholder="e.g. Aligned leadership on 2026 roadmap or Reduced latency by 45%"
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
              value={category}
              onChange={(e) => setCategory(e.target.value as Achievement["category"])}
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

        {/* Work Focus Selector: adapts suggestions to user's work type */}
        <div className="flex flex-col gap-1 rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">
              Suggestions based on Work Focus:
            </span>
            <span className="text-[10px] font-semibold text-[#85a900] dark:text-[#d3f36b]">
              Adapts to your role
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {DOMAINS.map((dm) => (
              <button
                key={dm.id}
                type="button"
                onClick={() => handleDomainChange(dm.id)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:scale-95 ${
                  selectedDomain === dm.id
                    ? "bg-[#d3f36b] text-[#283618] shadow-xs"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                <span>{dm.icon}</span>
                <span>{dm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Measurable Impact with Role-Aware Suggestions */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Measurable impact / outcome
            </label>
            <span className="text-[10px] text-zinc-400 font-medium">Click suggestion to autofill</span>
          </div>
          <input
            name="impact"
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            placeholder="e.g. Aligned 8+ cross-functional stakeholders on strategic delivery"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {activeImpacts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setImpact(item)}
                className="rounded-full border border-zinc-200 bg-zinc-100/90 px-2.5 py-0.5 text-[10.5px] font-semibold text-zinc-600 transition hover:border-[#85a900] hover:bg-[#edf6d5] hover:text-[#283618] active:scale-95 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-[#c4f843] dark:hover:bg-[#20290e] dark:hover:text-[#d3f36b]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Spotted: Cross-Functional & Role-Specific Suggestions */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Skills demonstrated (comma separated)
            </label>
            <span className="text-[10px] text-zinc-400 font-medium">Tap to add / remove</span>
          </div>
          <input
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="e.g. Leadership, Strategy, Problem solving, Technical delivery"
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {activeSkills.map((skill) => {
              const isSelected = currentSkillsList.includes(skill.toLowerCase());
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold transition active:scale-95 ${
                    isSelected
                      ? "bg-[#d3f36b] text-[#283618] font-bold shadow-xs ring-1 ring-[#85a900]/50"
                      : "border border-zinc-200 bg-zinc-100/90 text-zinc-600 hover:border-[#85a900] hover:bg-[#edf6d5] hover:text-[#283618] dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-[#c4f843] dark:hover:bg-[#20290e] dark:hover:text-[#d3f36b]"
                  }`}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

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
