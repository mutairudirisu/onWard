"use client";

import { useState } from "react";

type RoleId = "engineers" | "product" | "founders" | "consultants";

export function PersonaShowcase() {
  const [activeRole, setActiveRole] = useState<RoleId>("engineers");

  const roles: Record<
    RoleId,
    {
      tab: string;
      title: string;
      description: string;
      metrics: { label: string; value: string; status: string }[];
      tags: string[];
      cardBadge: string;
    }
  > = {
    engineers: {
      tab: "For Engineers",
      title: "Software Engineers & Architects",
      description:
        "Document performance breakthroughs, ship modular systems, maintain structured daily work logs, and compile achievements ready for promotion appraisals.",
      cardBadge: "Engineering Velocity",
      metrics: [
        { label: "API Latency Optimization", value: "Sub-100ms", status: "Shipped ✓" },
        { label: "Monorepo & Type Architecture", value: "Zero Errors", status: "Verified ✓" },
        { label: "Offline PWA Service Worker", value: "100% Cache", status: "Active ✓" },
      ],
      tags: ["Next.js 15", "TypeScript", "PostgreSQL", "Supabase", "System Design"],
    },
    product: {
      tab: "For Product Leads",
      title: "Product Managers & Designers",
      description:
        "Organize user journeys into workspace folders, write detailed specs with styled tables, export Word & PDF documents, and keep cross-functional squads aligned.",
      cardBadge: "Roadmap Delivery",
      metrics: [
        { label: "Q4 User Onboarding Redesign", value: "Shipped", status: "Live ✓" },
        { label: "Executive Word (.doc) Spec", value: "Approved", status: "Signed ✓" },
        { label: "Sprint Velocity", value: "+32%", status: "On Track ✓" },
      ],
      tags: ["User Research", "Roadmap", "Design System", "Word Studio", "PRDs"],
    },
    founders: {
      tab: "For Founders",
      title: "Founders & Indie Builders",
      description:
        "Eliminate cognitive overload. Set targeted 12-hour AM/PM clock alarms, maintain personal notes with sketches, and publish consistent momentum updates to LinkedIn and X.",
      cardBadge: "Build In Public",
      metrics: [
        { label: "Daily Shipping Streak", value: "24 Days", status: "Active 🔥" },
        { label: "Product Marketing Site Launch", value: "Complete", status: "Live ✓" },
        { label: "Quarterly Milestone Goals", value: "8 Completed", status: "Achieved ✓" },
      ],
      tags: ["Bootstrapping", "Growth", "Marketing", "Execution", "Daily Habits"],
    },
    consultants: {
      tab: "For Consultants",
      title: "Consultants & Agency Leads",
      description:
        "Deliver polished client reports. Drag project briefs into custom client folders, export client deliverables to branded Microsoft Word files, and log billable work logs.",
      cardBadge: "Client Deliverables",
      metrics: [
        { label: "Client Architecture Review", value: "Delivered", status: "Signed ✓" },
        { label: "Branded PDF Export", value: "Executive Style", status: "Ready ✓" },
        { label: "Collaborator Invites", value: "8 Members", status: "Active ✓" },
      ],
      tags: ["Client Reporting", "Deliverables", "Word Export", "Work Logs", "Pro Hub"],
    },
  };

  const current = roles[activeRole];

  return (
    <section className="py-20 md:py-32 bg-[#fbfdfa] border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Role Tab Navigation matching Image 5 */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-zinc-200/70 p-1.5 shadow-inner">
            {(Object.keys(roles) as RoleId[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveRole(key)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  activeRole === key
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {roles[key].tab}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Display Container matching Image 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-zinc-200/90 bg-white p-8 sm:p-12 lg:p-16 shadow-xs max-w-6xl mx-auto">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              {current.title}
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              {current.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <a
                href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-zinc-800"
              >
                <span>Launch {current.tab} Experience</span>
                <span className="text-sm">→</span>
              </a>
            </div>
          </div>

          {/* Right Visual Layered Cards Stack matching Image 5 */}
          <div className="lg:col-span-7 relative flex justify-center py-4">
            {/* Background layered card tilt */}
            <div className="absolute top-0 right-10 w-4/5 h-48 rounded-2xl bg-gradient-to-tr from-purple-200 to-amber-200 opacity-60 -rotate-3 blur-xs" />
            <div className="absolute top-4 right-14 w-4/5 h-48 rounded-2xl bg-gradient-to-tr from-blue-300 to-emerald-200 opacity-70 rotate-2" />

            {/* Foreground Main Card matching Image 5 */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl text-left">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="font-heading text-sm font-bold text-zinc-900">
                  {current.cardBadge}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Itemized metrics */}
              <div className="mt-4 space-y-3">
                {current.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-[#f8faf7] p-3 text-xs border border-zinc-100"
                  >
                    <div>
                      <span className="font-bold text-zinc-900 block">{m.label}</span>
                      <span className="text-[11px] text-zinc-500">{m.value}</span>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-[#85a900] shadow-2xs">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

