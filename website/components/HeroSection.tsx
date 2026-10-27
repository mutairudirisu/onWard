import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 h-[520px] w-[780px] rounded-full bg-gradient-to-tr from-[#d3f36b]/40 to-[#edf6d5]/20 blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#85a900]/30 bg-[#f4ffe0] px-4 py-1.5 text-xs font-bold text-[#354516] shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#85a900] animate-pulse" />
            <span>onWard 2.0 Released</span>
            <span className="text-[#85a900]">·</span>
            <span className="text-zinc-600 font-medium">Word & PDF Studio, Clock Reminders & Monorepo</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mt-8 text-center">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1c221e] leading-[1.08]">
            A little progress,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#587309]">every day</span>
              <span className="absolute bottom-2 left-0 z-0 h-3.5 w-full bg-[#d3f36b]/70 rounded-md -rotate-1" />
            </span>
            .
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl font-normal text-[#5a625d] leading-relaxed">
            The calm, high-velocity productivity hub for ambitious builders. Plan daily focus, manage rich documents with native Word & PDF export, and compile daily wins into verified career milestones.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={APP_URL}
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#d3f36b] px-7 text-sm font-extrabold text-[#283618] shadow-md shadow-[#85a900]/20 transition-all hover:bg-[#c4e65d] hover:shadow-lg active:scale-98"
            >
              <span>Get Started Free</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <Link
              href="#workspace"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 hover:border-zinc-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Explore Workspace Tour</span>
            </Link>
          </div>

          {/* Micro social proof chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="text-[#85a900]">✓</span> 100% Offline-capable PWA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#85a900]">✓</span> Word (.doc) & PDF Export
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#85a900]">✓</span> 1-Click LinkedIn Milestone Publisher
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#85a900]">✓</span> Secure Supabase Sync
            </span>
          </div>
        </div>

        {/* Visual Product Mockup Preview */}
        <div className="mt-14 sm:mt-18 rounded-3xl border border-[#e3e8de] bg-gradient-to-b from-[#f9fbf8] to-white p-3 sm:p-5 shadow-2xl shadow-zinc-200/60">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-8 shadow-xs">
            {/* Top window bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-bold text-zinc-400">onWard Productivity Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#f4ffe0] px-2.5 py-1 text-[11px] font-bold text-[#354516]">
                  ● Active Workspace: OnWard Engineering
                </span>
              </div>
            </div>

            {/* Interactive Grid Representation inside Hero */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pillar 1: Daily Focus & Clock Reminder */}
              <div className="rounded-xl border border-zinc-200/80 bg-[#fbfdf9] p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#85a900] uppercase tracking-wider">
                      Daily Focus & Reminders
                    </span>
                    <span className="rounded-full bg-[#edf6d5] px-2 py-0.5 text-[10px] font-extrabold text-[#3d4b24]">
                      08:30 AM
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-900">
                    Ship Monorepo & Word Studio
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Targeted alarm configured with context notes and notifications.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <span className="font-semibold text-zinc-600">Status: In Progress</span>
                  <span className="font-bold text-[#85a900]">✓ High Priority</span>
                </div>
              </div>

              {/* Pillar 2: Workspace Folders & Document Studio */}
              <div className="rounded-xl border border-zinc-200/80 bg-[#fbfdf9] p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      Workspace Studio
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                      Word + PDF
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-900">
                    Architecture & User Journeys
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Styled tables with onWard Lime theme, revision history, and Word export.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <span className="font-semibold text-zinc-600">📁 Sprint Planning</span>
                  <span className="text-zinc-400">4 Collaborators</span>
                </div>
              </div>

              {/* Pillar 3: Verified Milestones & LinkedIn Compiler */}
              <div className="rounded-xl border border-zinc-200/80 bg-[#fbfdf9] p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Proof of Work
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                      1-Click Share
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-900">
                    45% API Latency Optimization
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Compiled directly into professional performance appraisal & LinkedIn posts.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <span className="font-bold text-zinc-700">#SoftwareEngineering</span>
                  <span className="rounded bg-[#d3f36b] px-2 py-0.5 text-[10px] font-bold text-[#283618]">
                    Shared ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

