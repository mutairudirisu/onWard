"use client";

import { useState } from "react";

export function AppShowcase() {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile" | "split">("split");

  return (
    <section className="relative -mt-10 mb-20 md:mb-32 z-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Device Switcher Pills */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="inline-flex rounded-2xl bg-zinc-900/90 p-1.5 shadow-xl backdrop-blur-md border border-white/10 text-xs font-bold text-white">
            <button
              type="button"
              onClick={() => setDeviceMode("split")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all ${
                deviceMode === "split"
                  ? "bg-[#d3f36b] text-[#283618] shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>✨ Split Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all ${
                deviceMode === "desktop"
                  ? "bg-[#d3f36b] text-[#283618] shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Desktop Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all ${
                deviceMode === "mobile"
                  ? "bg-[#d3f36b] text-[#283618] shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>Mobile PWA</span>
            </button>
          </div>
        </div>

        {/* Big Device Frame Showcase */}
        <div className="relative rounded-3xl border border-zinc-300/80 bg-gradient-to-b from-zinc-900 to-[#121614] p-3 sm:p-5 md:p-6 shadow-2xl shadow-zinc-900/40 text-left overflow-hidden">
          {/* Subtle star & ambient mesh */}
          <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#d3f36b]/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

          {/* Browser Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-[11px] text-zinc-400">https://app.onward.com/today</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Synced · 100% Offline PWA
              </span>
            </div>
          </div>

          {/* Main Visual Display: Desktop + Floating Mobile */}
          <div className="relative flex flex-col lg:flex-row gap-6 items-center lg:items-stretch">
            {/* 1. Desktop App Snapshot */}
            {(deviceMode === "desktop" || deviceMode === "split") && (
              <div className={`flex-1 w-full rounded-2xl bg-white text-zinc-900 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[520px] transition-all`}>
                {/* Embedded Sidebar Mockup */}
                <div className="hidden md:flex w-56 flex-col justify-between border-r border-zinc-200 bg-[#fafbfa] p-4 text-xs">
                  <div>
                    {/* Brand */}
                    <div className="flex items-baseline gap-1 font-heading text-lg font-extrabold tracking-tight text-zinc-900">
                      <span className="text-[#85a900]">o</span>nWard
                    </div>
                    <p className="mt-1 text-[10px] text-zinc-500 font-medium">
                      A little progress, <span className="text-[#85a900] font-bold">every day</span>
                    </p>

                    {/* Nav Items */}
                    <div className="mt-6 flex flex-col gap-1">
                      <div className="flex items-center gap-2.5 rounded-xl bg-[#edf6d5] px-3 py-2 font-bold text-[#2e3d14]">
                        <span>🏠</span>
                        <span>Today&apos;s Focus</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-zinc-600 hover:bg-zinc-100">
                        <span>✓</span>
                        <span>Tasks & Reminders</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-zinc-600 hover:bg-zinc-100">
                        <span>📝</span>
                        <span>Notes & Mind Maps</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-zinc-600 hover:bg-zinc-100">
                        <span>🏆</span>
                        <span>Achievements & Wins</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-zinc-600 hover:bg-zinc-100">
                        <span>📋</span>
                        <span>Daily Work Logs</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-zinc-600 hover:bg-zinc-100">
                        <span>📁</span>
                        <span>Projects & Workspace</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Mockup */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-2xs">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d3f36b] text-xs font-bold text-[#283618]">
                      I
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900 leading-tight">Idris M.</span>
                      <span className="text-[9.5px] text-zinc-400">Pro Workspace</span>
                    </div>
                  </div>
                </div>

                {/* Embedded App Content Area */}
                <div className="flex-1 p-5 md:p-7 flex flex-col justify-between bg-white">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                      <div>
                        <h2 className="font-heading text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">
                          Today&apos;s Journey
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          3 high-impact tasks scheduled · 2 daily work logs documented
                        </p>
                      </div>
                      <span className="rounded-xl bg-[#d3f36b] px-3 py-1.5 text-xs font-bold text-[#283618]">
                        + New Task
                      </span>
                    </div>

                    {/* Week Calendar Strip Mockup */}
                    <div className="my-5 grid grid-cols-7 gap-2 rounded-2xl bg-[#f8faf7] p-2 border border-zinc-100 text-center text-xs">
                      {[
                        { day: "Mon", date: "26", active: false },
                        { day: "Tue", date: "27", active: true },
                        { day: "Wed", date: "28", active: false },
                        { day: "Thu", date: "29", active: false },
                        { day: "Fri", date: "30", active: false },
                        { day: "Sat", date: "31", active: false },
                        { day: "Sun", date: "01", active: false },
                      ].map((d) => (
                        <div
                          key={d.date}
                          className={`rounded-xl py-2 flex flex-col items-center justify-center ${
                            d.active
                              ? "bg-[#d3f36b] text-[#283618] font-extrabold shadow-xs"
                              : "text-zinc-600 hover:bg-zinc-100"
                          }`}
                        >
                          <span className="text-[9px] uppercase font-bold">{d.day}</span>
                          <span className="text-sm font-extrabold mt-0.5">{d.date}</span>
                        </div>
                      ))}
                    </div>

                    {/* Task Cards with Clock Reminders */}
                    <div className="space-y-2.5">
                      {/* Task 1 */}
                      <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs hover:border-[#85a900]/50 transition">
                        <div className="flex items-center gap-3">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#d3f36b] text-[#283618] text-xs font-bold">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-zinc-900">
                              Publish onWard Monorepo & Product Website
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              Completed with 15/15 unit test checks passing.
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Completed ✓
                        </span>
                      </div>

                      {/* Task 2 with targeted clock reminder */}
                      <div className="flex items-center justify-between rounded-xl border border-[#85a900]/40 bg-[#fbfdf7] p-3.5 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-md border-2 border-zinc-300" />
                          <div>
                            <h4 className="text-sm font-bold text-zinc-900">
                              Draft Word (.doc) Client Proposal & PDF
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded bg-[#edf6d5] px-2 py-0.5 text-[10px] font-extrabold text-[#3d4b24]">
                                ⏰ 08:30 AM
                              </span>
                              <span className="text-[10px] text-zinc-500">
                                Folder: Engineering Specs
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          In Progress
                        </span>
                      </div>

                      {/* Task 3 */}
                      <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-md border-2 border-zinc-300" />
                          <div>
                            <h4 className="text-sm font-bold text-zinc-900">
                              Compile Monthly Wins to LinkedIn Post
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              Impact: 45% latency optimization · 4 collaborators
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                          Milestone
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Footer notification */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      All changes automatically saved to Supabase
                    </span>
                    <span className="font-semibold text-zinc-700">Port 3000 Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Floating Mobile PWA Snapshot (Matching User's Reference) */}
            {(deviceMode === "mobile" || deviceMode === "split") && (
              <div
                className={`w-full ${
                  deviceMode === "split"
                    ? "lg:w-[320px] lg:-ml-6 lg:self-center shrink-0 z-30"
                    : "max-w-[340px] mx-auto"
                } rounded-[38px] border-4 border-zinc-800 bg-white p-3 shadow-2xl transition-all`}
              >
                {/* Phone Notch / Speaker */}
                <div className="mx-auto mb-2 h-4 w-28 rounded-full bg-zinc-900 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-zinc-800" />
                </div>

                {/* Mobile Screen Container */}
                <div className="rounded-[28px] bg-white border border-zinc-200 p-3.5 flex flex-col justify-between min-h-[460px] text-left">
                  <div>
                    {/* Mobile Header Bar matching user's uploaded snapshot */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                      <span className="text-xs font-bold text-zinc-700">←</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">↶</span>
                        <span className="text-xs text-zinc-400">↷</span>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
                          N
                        </span>
                      </div>
                    </div>

                    {/* Note title and date */}
                    <div className="mt-3">
                      <h4 className="font-heading text-lg font-bold text-zinc-900">
                        Olokodana.
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        27 October 2:08 PM | 16 characters
                      </p>

                      {/* Mind map pill */}
                      <button
                        type="button"
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#b8e85e] bg-[#f4ffe0] px-3 py-1 text-[10px] font-bold text-[#496612]"
                      >
                        <span>🌱</span>
                        <span>Create a mind map</span>
                      </button>

                      <div className="mt-4 text-xs font-medium text-zinc-800 space-y-1">
                        <p>Dele</p>
                        <p className="text-zinc-500">Sprint Roadmap & Deliverables</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Tool Bar at Bottom matching user's exact uploaded snapshot */}
                  <div className="mt-6 border-t border-zinc-100 pt-2 flex items-center justify-between px-1 text-zinc-600 relative">
                    <span title="Voice" className="text-sm">🎙️</span>
                    <span title="Image" className="text-sm">🖼️</span>
                    <span title="Draw" className="text-sm">✏️</span>
                    <span title="Checklist" className="text-sm">☑️</span>
                    <span title="Format" className="text-sm font-bold">T</span>

                    {/* Floating Green Plus Button */}
                    <div className="absolute -top-7 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#d3f36b] text-[#283618] text-sm font-extrabold shadow-md">
                      +
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

