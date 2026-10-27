"use client";

import { useState } from "react";

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"doc" | "reminder" | "linkedin">("doc");
  const [selectedTheme, setSelectedTheme] = useState<"lime" | "slate" | "navy">("lime");

  return (
    <section id="workspace" className="py-20 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            Interactive Tour
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-[#1c221e] tracking-tight">
            See onWard in Action.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#5a625d]">
            Explore the unique features that make onWard different from ordinary task managers.
          </p>

          {/* Tab Selector Pills */}
          <div className="mt-8 inline-flex rounded-2xl bg-[#eff3eb] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("doc")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "doc"
                  ? "bg-white text-[#1c221e] shadow-xs"
                  : "text-[#677069] hover:text-[#1c221e]"
              }`}
            >
              📄 Word & PDF Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reminder")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "reminder"
                  ? "bg-white text-[#1c221e] shadow-xs"
                  : "text-[#677069] hover:text-[#1c221e]"
              }`}
            >
              ⏰ Clock Reminders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("linkedin")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "linkedin"
                  ? "bg-white text-[#1c221e] shadow-xs"
                  : "text-[#677069] hover:text-[#1c221e]"
              }`}
            >
              💼 Milestone to LinkedIn
            </button>
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="mt-12 rounded-3xl border border-[#e3e8de] bg-[#fbfdfa] p-5 sm:p-10 shadow-sm max-w-5xl mx-auto">
          {activeTab === "doc" && (
            <div className="space-y-6">
              {/* Studio Toolbar Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-500">Table Theme:</span>
                  <div className="flex gap-1.5">
                    {[
                      { id: "lime" as const, label: "onWard Lime", color: "#d3f36b" },
                      { id: "slate" as const, label: "Corporate Slate", color: "#475569" },
                      { id: "navy" as const, label: "Oceanic Navy", color: "#2563eb" },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setSelectedTheme(th.id)}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                          selectedTheme === th.id
                            ? "border-zinc-900 bg-white shadow-xs font-bold"
                            : "border-zinc-200 bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: th.color }} />
                        <span>{th.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Autosaved ✓
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-xs hover:bg-zinc-50"
                  >
                    <span>Download .doc</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl bg-[#d3f36b] px-3.5 py-1.5 text-xs font-extrabold text-[#283618] shadow-xs"
                  >
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Sample Document Paper */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
                <span className="rounded-full bg-[#f4ffe0] px-2.5 py-0.5 text-[10px] font-bold text-[#354516]">
                  FOLDER: ARCHITECTURE & SPRINT SPECS
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-zinc-900">
                  Engineering System Roadmap & Latency Budgets
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Defines the SLA targets, micro-frontends structure, and Supabase offline sync guarantees.
                </p>

                {/* Styled Table preview */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr
                        style={{
                          backgroundColor:
                            selectedTheme === "lime"
                              ? "#edf6d5"
                              : selectedTheme === "slate"
                              ? "#1e293b"
                              : "#1e40af",
                          color:
                            selectedTheme === "lime"
                              ? "#283618"
                              : "#ffffff",
                        }}
                      >
                        <th className="p-3 font-bold border">Component</th>
                        <th className="p-3 font-bold border">Target SLA</th>
                        <th className="p-3 font-bold border">Sync Fallback</th>
                        <th className="p-3 font-bold border">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      <tr className="hover:bg-zinc-50">
                        <td className="p-3 font-semibold border">Next.js Monorepo (Frontend + Website)</td>
                        <td className="p-3 border">Sub-100ms TTFB</td>
                        <td className="p-3 border">Edge Cache</td>
                        <td className="p-3 font-bold text-emerald-600 border">Ready ✓</td>
                      </tr>
                      <tr className="bg-zinc-50/50 hover:bg-zinc-50">
                        <td className="p-3 font-semibold border">Word (.doc) & PDF Engine</td>
                        <td className="p-3 border">Instant client export</td>
                        <td className="p-3 border">Local Blob Stream</td>
                        <td className="p-3 font-bold text-emerald-600 border">Verified ✓</td>
                      </tr>
                      <tr className="hover:bg-zinc-50">
                        <td className="p-3 font-semibold border">Clock Reminders</td>
                        <td className="p-3 border">Exact minute alarm</td>
                        <td className="p-3 border">PWA Service Worker</td>
                        <td className="p-3 font-bold text-emerald-600 border">Active ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reminder" && (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <span className="text-xs font-bold text-[#85a900] uppercase tracking-wider">
                  Clock Reminder Picker
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900">
                  Targeted Alarm with 12-Hour AM/PM Control
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Unlike traditional checklist apps that only record arbitrary dates, onWard lets you dial in the exact hour, minute, and AM/PM time with context notes so critical deliverables are never missed.
                </p>
                <div className="space-y-2 pt-2 text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Quick 30-minute interval adjustment buttons
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Custom context notes (e.g. &quot;Bring user journey diagrams&quot;)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Native desktop & mobile PWA notifications
                  </div>
                </div>
              </div>

              {/* Clock Mockup Card */}
              <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <span className="text-xs font-bold text-zinc-700">Set Task Reminder</span>
                  <span className="rounded-md bg-[#edf6d5] px-2 py-0.5 text-[10px] font-bold text-[#354516]">
                    Active
                  </span>
                </div>
                <div className="my-5 flex items-center justify-center gap-2">
                  <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-zinc-100 text-2xl font-extrabold text-zinc-900">
                    08
                  </div>
                  <span className="text-2xl font-bold text-zinc-400">:</span>
                  <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-zinc-100 text-2xl font-extrabold text-zinc-900">
                    30
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="rounded-lg bg-[#d3f36b] px-2.5 py-1 text-xs font-extrabold text-[#283618]">
                      AM
                    </span>
                    <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500">
                      PM
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600 border border-zinc-100">
                  <strong>Task:</strong> Ship onWard monorepo & launch marketing site<br />
                  <strong>Context:</strong> Verified with npm test & next build
                </div>
              </div>
            </div>
          )}

          {activeTab === "linkedin" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#85a900] uppercase tracking-wider">
                    onWard Proof of Work Compiler
                  </span>
                  <h3 className="text-xl font-extrabold text-zinc-900">
                    1-Click Social & Appraisal Compilation
                  </h3>
                </div>
                <span className="rounded-xl border border-[#0a66c2]/40 bg-[#0a66c2]/10 px-3 py-1.5 text-xs font-bold text-[#0a66c2]">
                  💼 Ready to publish on LinkedIn
                </span>
              </div>

              {/* Generated Post Box */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 font-mono text-xs leading-relaxed text-zinc-800 shadow-xs whitespace-pre-wrap">
{`🚀 Proud to share some key milestones and momentum onWard!

Reflecting on recent engineering and product outcomes delivered:

🔹 Monorepo Migration & Word Studio
   • Impact: Reorganized OnWard-Todo into high-velocity frontend & marketing website
   • Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase

🔹 Automated Test Quality Gate
   • Impact: 15 comprehensive unit test suites passing across database sync & PWA
   • Stack: Node test runner, ESM, strict isolation

Continuous momentum, one step at a time. A little progress, every day 🌱

#SoftwareEngineering #TechMilestones #Productivity #CareerGrowth #onWard`}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

