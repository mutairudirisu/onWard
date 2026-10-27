export function ProductFeatures() {
  const features = [
    {
      id: "journey",
      tag: "Day-to-Day Momentum",
      title: "Daily Journey & Expandable Calendar",
      description:
        "Focus on what matters today without being overwhelmed by a massive backlog. Expand to the full calendar view to plan weeks ahead with clean visual indicators.",
      bullets: [
        "Dynamic week-strip and full month planner",
        "Color-coded focus categories (Work, Personal, Health, Study)",
        "Instant completion tracking with sound and visual feedback",
      ],
      badge: "Core Workflow",
    },
    {
      id: "reminders",
      tag: "Targeted Time Management",
      title: "Clock Reminders with Context Notes",
      description:
        "Never miss high-stakes deadlines. Set explicit 12-hour AM/PM reminder times with contextual notes and direct browser/PWA notifications.",
      bullets: [
        "Interactive 12-hour AM/PM time dial",
        "Quick adjustment presets and native system time picker",
        "Notification permissions with automatic wake-up reminders",
      ],
      badge: "High Precision",
    },
    {
      id: "workspace",
      tag: "Team & Personal Workspace",
      title: "Drag-and-Drop Document Organization",
      description:
        "Group documents into intuitive workspace folders. Organize project deliverables, team specifications, and sprint briefs effortlessly.",
      bullets: [
        "Drag-and-drop document cards directly into target folders",
        "Folder badges with real-time document and project counts",
        "Fine-grained permissions and collaborator invites",
      ],
      badge: "Collaboration",
    },
    {
      id: "studio",
      tag: "Document Studio",
      title: "Word & PDF Studio with Styled Tables",
      description:
        "Write specifications with corporate-grade table palettes (Lime, Slate, Navy, Emerald, Amber). Export directly to Microsoft Word (.doc) and PDF.",
      bullets: [
        "Full WYSIWYG canvas with header formatting and checklists",
        "Professional table styling matching executive standards",
        "1-click .doc download and native PDF print optimization",
      ],
      badge: "Enterprise Ready",
    },
    {
      id: "milestones",
      tag: "Career Momentum",
      title: "Achievements & 1-Click LinkedIn Publishing",
      description:
        "Turn daily tasks into verified proof of work. Document quantifiable metrics across Tech, Leadership, Product, and Operations, and publish directly to LinkedIn.",
      bullets: [
        "Domain-specific impact suggestions and skill tags",
        "1-click LinkedIn Post and X/Twitter copy generation",
        "Export markdown case studies for performance reviews",
      ],
      badge: "Career Growth",
    },
    {
      id: "analytics",
      tag: "Productivity Insights",
      title: "Real Analytics & Team Work Logs",
      description:
        "Visualize your productivity trends based on real recorded completions, overdue items, and operational work logs.",
      bullets: [
        "Weekly completion trends and velocity breakdowns",
        "Audit trail and version history for document changes",
        "Comprehensive team work logs with lessons learned",
      ],
      badge: "Data-Driven",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-[#fbfcfa] border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            Engineered for High Output
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-[#1c221e] tracking-tight">
            Everything you need to move forward every day.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5a625d]">
            Most productivity apps are just infinite checklists. onWard is designed to turn your everyday output into tangible career momentum.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e3e8de] bg-white p-6 sm:p-7 shadow-xs hover:border-[#85a900]/50 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#85a900] uppercase tracking-wider">
                    {feat.tag}
                  </span>
                  <span className="rounded-full bg-[#f4ffe0] px-2.5 py-0.5 text-[10px] font-bold text-[#354516]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-heading mt-3 text-xl font-bold text-[#1c221e]">
                  {feat.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#5a625d] leading-relaxed">
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
    </section>
  );
}

