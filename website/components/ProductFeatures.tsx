export function ProductFeatures() {
  const personalFeatures = [
    {
      id: "tasks",
      title: "Daily Tasks & Clock Reminders",
      description:
        "Organize daily activities, set priorities, and establish exact 12-hour AM/PM reminder times with contextual notes so high-stakes work is never forgotten.",
      bullets: [
        "12-hour AM/PM clock picker with rapid interval adjustments",
        "Color-coded focus categories (Work, Personal, Health, Study)",
        "Calendar strip with expandable monthly planner",
      ],
      icon: "✓",
      badge: "Organization",
    },
    {
      id: "notes",
      title: "Notes, Mind Maps & Sketches",
      description:
        "Capture ideas, thoughts, and meeting takeaways the moment inspiration strikes. Turn any note into an interactive mind map or draw quick visual sketches.",
      bullets: [
        "1-click mind map generator (🌱 Create a mind map)",
        "Drawing canvas for hand-drawn sketches and diagrams",
        "Voice dictation and rich text formatting studio",
      ],
      icon: "📝",
      badge: "Idea Capture",
    },
    {
      id: "achievements",
      title: "Achievements & Personal Milestones",
      description:
        "Record completed goals, personal milestones, and wins across key domains (Technical, Leadership, Delivery, Innovation). Never lose track of how far you've come.",
      bullets: [
        "Track quantifiable impact and demonstrated skills",
        "Domain-level progress bars for performance appraisals",
        "1-click formatted publishing to LinkedIn and professional profiles",
      ],
      icon: "🏆",
      badge: "Personal Growth",
    },
  ];

  const workspaceFeatures = [
    {
      id: "work-logs",
      title: "Daily Work Logs & Accountability",
      description:
        "Document daily work activities, contributions, outcomes, and lessons learned. Maintain an auditable history of everything you and your team deliver.",
      bullets: [
        "Record key outcomes, deliverables, and blockers solved",
        "Capture retrospective lessons learned while work is fresh",
        "Link directly to active projects for end-to-end accountability",
      ],
      icon: "📋",
      badge: "Accountability",
    },
    {
      id: "projects",
      title: "Projects & Collaborator Management",
      description:
        "Organize projects, track progress status from planning to completion, manage activities, and invite team members to collaborate seamlessly.",
      bullets: [
        "Track project status (Planning, In Progress, Completed)",
        "Collaborator invitations with role-based member visibility",
        "Centralized project documents, work logs, and deliverables",
      ],
      icon: "🚀",
      badge: "Collaboration",
    },
    {
      id: "documents",
      title: "Workspace Folders & Word/PDF Studio",
      description:
        "Organize documents into intuitive drag-and-drop workspace folders. Compose specifications with styled tables and export directly to Word (.doc) and PDF.",
      bullets: [
        "Drag-and-drop document cards into organized folders",
        "Executive table themes (Lime, Corporate Slate, Oceanic Navy)",
        "1-click Microsoft Word (.doc) download and clean PDF prints",
      ],
      icon: "📁",
      badge: "Documentation",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-[#fbfcfa] border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            The onWard Platform
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-[#1c221e] tracking-tight">
            Personal productivity meets professional workspace
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5a625d] leading-relaxed">
            Most tools force you to choose between a simple personal to-do list and an overly complicated enterprise project manager. onWard bridges both seamlessly.
          </p>
        </div>

        {/* Section 1: Personal Productivity */}
        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200/80 pb-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#587309]">
                Pillar 1
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1c221e] mt-1">
                Personal Productivity
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5a625d] mt-2 sm:mt-0 max-w-md">
              Organize your days, capture ideas instantly, and build a lasting record of your personal wins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {personalFeatures.map((feat) => (
              <div
                key={feat.id}
                className="flex flex-col justify-between rounded-3xl border border-[#e3e8de] bg-white p-6 sm:p-7 shadow-xs hover:border-[#85a900]/50 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4ffe0] text-lg font-bold text-[#283618]">
                      {feat.icon}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600">
                      {feat.badge}
                    </span>
                  </div>

                  <h4 className="font-heading mt-4 text-lg font-bold text-[#1c221e]">
                    {feat.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#5a625d] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-100 pt-4">
                  <ul className="space-y-2 text-xs text-[#3b433e]">
                    {feat.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#85a900] font-bold shrink-0">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Workspace & Professional Productivity */}
        <div className="mt-20 sm:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200/80 pb-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                Pillar 2
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1c221e] mt-1">
                Workspace & Professional Productivity
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5a625d] mt-2 sm:mt-0 max-w-md">
              Document daily work contributions, manage projects with team members, and export executive documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {workspaceFeatures.map((feat) => (
              <div
                key={feat.id}
                className="flex flex-col justify-between rounded-3xl border border-[#e3e8de] bg-white p-6 sm:p-7 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                      {feat.icon}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h4 className="font-heading mt-4 text-lg font-bold text-[#1c221e]">
                    {feat.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#5a625d] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-100 pt-4">
                  <ul className="space-y-2 text-xs text-[#3b433e]">
                    {feat.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Connected Loop Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#edf6d5] via-[#f7f9f2] to-[#edf6d5] border border-[#d3f36b]/60 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#3d4b24]">
              ONE CONNECTED EXPERIENCE
            </span>
            <h4 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1c221e] mt-2">
              How onWard turns daily effort into lasting progress
            </h4>
            <p className="text-xs sm:text-sm text-[#556158] mt-2">
              Plan your morning in <strong>Tasks</strong> → Jot thoughts and sketches in <strong>Notes</strong> → Document contributions in <strong>Work Logs</strong> → Move <strong>Projects</strong> forward → Recognize growth in <strong>Achievements</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
