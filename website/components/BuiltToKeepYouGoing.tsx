"use client";

export function BuiltToKeepYouGoing() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            CONNECTED PRODUCTIVITY SYSTEM
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-[#1c221e] tracking-tight">
            Built to keep your momentum going
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5a625d] leading-relaxed">
            Planning tasks is easy. Capturing ideas, documenting real contributions, and seeing your actual progress over time is where most tools fail. onWard connects all of them.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Tasks & Clock Reminders (Soft Sage/Mint Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#eaf2e8] p-6 sm:p-7 shadow-xs">
            {/* Embedded Push Notification / Reminder Mockup */}
            <div className="space-y-3 pt-2 pb-6">
              {/* Notification Pill 1 */}
              <div className="rounded-2xl bg-white/95 p-3.5 shadow-sm border border-zinc-200/40">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#283618] text-white text-xs">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">Task Reminder</span>
                      <span className="text-[10px] font-bold text-[#85a900]">08:30 AM</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-600 leading-snug">
                      Ship Architecture Spec & Review PRs
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-semibold text-zinc-400">
                      High Priority · Engineering
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification Pill 2 */}
              <div className="rounded-2xl bg-white/75 p-3 shadow-2xs border border-zinc-200/30">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#556947] text-white text-xs">
                    ⏰
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800">Upcoming Due</span>
                      <span className="text-[10px] text-zinc-400">Today</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-500 leading-snug">
                      Prepare quarterly project roadmap review
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#d8e5d5] pt-5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#587309]">
                Personal Productivity
              </span>
              <h3 className="font-heading text-xl font-bold text-[#1c221e] mt-1">
                Tasks & Reminders
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Organize daily activities, set priorities, and get precision 12-hour AM/PM clock alarms with contextual notes so critical work never slips.
              </p>
            </div>
          </div>

          {/* Card 2: Notes & Mind Maps (Warm Sand / Peach Card - Matches User's Note Snapshot!) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f7efe5] p-6 sm:p-7 shadow-xs">
            {/* Embedded Note Editor Preview matching user's uploaded snapshot */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200/50 text-left">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2.5">
                <span className="text-[10px] font-bold text-zinc-400">QUICK NOTE</span>
                <span className="text-[9.5px] text-zinc-400">2:08 PM</span>
              </div>

              <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                Sprint Retrospective & Ideas
              </h4>
              <p className="text-[9.5px] text-zinc-400 mt-0.5">
                27 October | 16 characters
              </p>

              {/* Exact Mind Map Pill from user's app */}
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8e85e] bg-[#f4ffe0] px-2.5 py-0.5 text-[9.5px] font-bold text-[#496612]">
                  <span>🌱</span>
                  <span>Create a mind map</span>
                </span>
              </div>

              {/* Note sketch/bullet preview */}
              <div className="mt-3 rounded-lg bg-zinc-50 p-2 text-[10px] text-zinc-600 space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#85a900]" />
                  <span>Streamline user onboarding flow</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                  <span>Export specs to Word & PDF</span>
                </div>
              </div>

              {/* Mini toolbar icons */}
              <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 text-zinc-400 text-xs">
                <span>🎙️</span>
                <span>🖼️</span>
                <span>✏️</span>
                <span>☑️</span>
                <span className="font-bold text-zinc-600">T</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#e8ded1] pt-5 mt-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                Personal Productivity
              </span>
              <h3 className="font-heading text-xl font-bold text-[#1c221e] mt-1">
                Notes & Ideas
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Capture thoughts and reminders instantly. Generate visual mind maps, draw sketches, record voice dictation, and keep ideas organized.
              </p>
            </div>
          </div>

          {/* Card 3: Achievements & Milestones (Soft Mint / Sage Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f0f5ee] p-6 sm:p-7 shadow-xs">
            {/* Embedded Milestone & Skill Progress Mockup */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200/50 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-zinc-900 block">Personal Progress</span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  5 Milestones
                </span>
              </div>
              <span className="text-[9.5px] text-zinc-400 block mb-3">Skills & Domain Progress</span>

              {/* Progress Bars for Real Domains */}
              <div className="space-y-2 text-[10px]">
                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-0.5">
                    <span>Technical Delivery</span>
                    <span className="font-bold text-[#2e5732]">Strong</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-[#2e5732]" />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-0.5">
                    <span>Problem Solving</span>
                    <span className="text-[#85a900] font-bold">Good</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-[#85a900]" />
                    ))}
                    {[5].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-zinc-200" />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-0.5">
                    <span>Leadership & Impact</span>
                    <span className="font-bold text-[#2e5732]">Strong</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-[#2e5732]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Callout */}
              <div className="mt-3 rounded-xl bg-[#edf6d5] border border-[#c4e65d]/50 p-2 text-[9.5px] text-[#283618] leading-tight">
                <strong>Recent Win:</strong> Shipped 45% latency improvement with zero breaking changes.
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#dde6da] pt-5 mt-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2e5732]">
                Personal Growth
              </span>
              <h3 className="font-heading text-xl font-bold text-[#1c221e] mt-1">
                Achievements & Wins
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Record completed goals, major milestones, and demonstrable skills. Build a verified history of your growth for reviews and appraisals.
              </p>
            </div>
          </div>

          {/* Card 4: Work Logs & Projects (Soft Cream / Warm Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f7f4ed] p-6 sm:p-7 shadow-xs">
            {/* Embedded Work Log & Project Mockup */}
            <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-zinc-200/50 text-left space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Daily Work Log</span>
                <span className="text-[9.5px] text-zinc-400">Oct 27</span>
              </div>

              <div>
                <h5 className="text-[11px] font-bold text-zinc-900">
                  Project: OnWard Mobile & Web 2.0
                </h5>
                <p className="text-[9.5px] text-zinc-500 mt-0.5">
                  Organized modules, ran 15 test suites, and verified builds.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 p-2 text-[9.5px] text-zinc-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">Outcomes Delivered:</span>
                  <span className="text-[#85a900] font-bold">100%</span>
                </div>
                <p className="text-[9px] text-zinc-500">
                  Lessons learned: Decouple marketing from application bundles for optimal velocity.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[9.5px]">
                <span className="text-zinc-500">📁 Client Deliverables</span>
                <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-700">
                  4 Collaborators
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#e8e2d5] pt-5 mt-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8b6f47]">
                Workspace Management
              </span>
              <h3 className="font-heading text-xl font-bold text-[#1c221e] mt-1">
                Work Logs & Projects
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Document daily contributions, track project status, invite collaborators, and maintain an organized record of everything your team ships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
