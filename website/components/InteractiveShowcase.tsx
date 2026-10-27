"use client";

import { useState } from "react";

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"tasks" | "notes" | "worklogs" | "doc">("tasks");
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
            Explore the core features that connect your personal productivity with professional work management.
          </p>

          {/* Tab Selector Pills */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl bg-[#eff3eb] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("tasks")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "tasks"
                  ? "bg-white text-[#1c221e] shadow-xs"
                  : "text-[#677069] hover:text-[#1c221e]"
              }`}
            >
              ⏰ Tasks & Clock
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "notes"
                  ? "bg-white text-[#1c221e] shadow-xs"
                  : "text-[#677069] hover:text-[#1c221e]"
              }`}
            >
              📝 Notes & Mind Maps
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("worklogs")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "worklogs"
                  ? "bg-white text-[#1c221e] shadow-xs"
                  : "text-[#677069] hover:text-[#1c221e]"
              }`}
            >
              📋 Work Logs & Projects
            </button>
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
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="mt-12 rounded-3xl border border-[#e3e8de] bg-[#fbfdfa] p-5 sm:p-10 shadow-sm max-w-5xl mx-auto">
          {/* TAB 1: Tasks & Clock Reminders */}
          {activeTab === "tasks" && (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4 text-left">
                <span className="text-xs font-bold text-[#85a900] uppercase tracking-wider">
                  Targeted Time Management
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900">
                  Targeted Alarms with 12-Hour AM/PM Control
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Unlike traditional checklist apps that only record arbitrary dates, onWard lets you dial in the exact hour, minute, and AM/PM time with context notes so critical deliverables are never missed.
                </p>
                <div className="space-y-2 pt-2 text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Quick 30-minute interval adjustment buttons
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Custom context notes (e.g. &quot;Prepare sprint roadmap slides&quot;)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Native desktop & mobile PWA notifications
                  </div>
                </div>
              </div>

              {/* Clock Mockup Card */}
              <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-left">
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

          {/* TAB 2: Notes & Mind Maps */}
          {activeTab === "notes" && (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4 text-left">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Idea Capture & Visual Thinking
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900">
                  Notes with Instant Mind Map Generation
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Capture fleeting thoughts, meeting notes, and architecture outlines. Tap <strong>🌱 Create a mind map</strong> to instantly visualize connections, or use the drawing pad to sketch concepts.
                </p>
                <div className="space-y-2 pt-2 text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> 1-Click Mind Map generator from note contents
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Built-in sketch canvas for quick hand-drawn diagrams
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#85a900]">✓</span> Voice dictation for hands-free thought capture
                  </div>
                </div>
              </div>

              {/* Note Editor Mockup matching User's Snapshot */}
              <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <span className="text-xs font-bold text-zinc-700">← Back</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">↶</span>
                    <span className="text-xs text-zinc-400">↷</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
                      N
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-heading text-lg font-bold text-zinc-900">
                    Olokodana.
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    27 October 2:08 PM | 16 characters
                  </p>

                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8e85e] bg-[#f4ffe0] px-3 py-1 text-[10px] font-bold text-[#496612]">
                      <span>🌱</span>
                      <span>Create a mind map</span>
                    </span>
                  </div>

                  <div className="mt-4 text-xs font-medium text-zinc-800 space-y-1">
                    <p>Dele</p>
                    <p className="text-zinc-500">System Architecture & Scalability</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-zinc-100 pt-3 flex items-center justify-between px-1 text-zinc-600 relative">
                  <span title="Voice" className="text-sm">🎙️</span>
                  <span title="Image" className="text-sm">🖼️</span>
                  <span title="Draw" className="text-sm">✏️</span>
                  <span title="Checklist" className="text-sm">☑️</span>
                  <span title="Format" className="text-sm font-bold">T</span>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d3f36b] text-[#283618] text-xs font-extrabold shadow-sm">
                    +
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Work Logs & Projects */}
          {activeTab === "worklogs" && (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4 text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Professional Visibility
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900">
                  Document Daily Contributions & Track Projects
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Never forget what you shipped last week. onWard helps you record daily work logs, document lessons learned, resolve blockers, and keep project teams completely synchronized.
                </p>
                <div className="space-y-2 pt-2 text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Daily contributions logged with measurable outcomes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Retrospective lessons learned & blocker resolution tracking
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Multi-user project collaboration and invitations
                  </div>
                </div>
              </div>

              {/* Work Log Mockup */}
              <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm text-left space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-xs font-bold text-zinc-900">Daily Work Log</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Logged
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-zinc-900">
                    Project: OnWard Mobile & Web 2.0
                  </h5>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Migrated to Next.js 15 monorepo, decoupled website bundle, and verified 15/15 tests.
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 text-xs space-y-1.5 border border-zinc-100">
                  <div>
                    <span className="font-bold text-zinc-700 block text-[10.5px]">Outcomes Delivered:</span>
                    <span className="text-zinc-600 text-[11px]">Clean build pipeline and sub-100ms load time.</span>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-700 block text-[10.5px]">Lessons Learned:</span>
                    <span className="text-zinc-600 text-[11px]">Separate app bundles from marketing logic for faster builds.</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
                  <span>Linked to Project: Core Architecture</span>
                  <span className="font-semibold text-blue-600">4 Collaborators</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Word & PDF Studio */}
          {activeTab === "doc" && (
            <div className="space-y-6 text-left">
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
        </div>
      </div>
    </section>
  );
}
