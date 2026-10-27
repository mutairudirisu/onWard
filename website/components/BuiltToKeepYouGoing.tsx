"use client";

import { useState } from "react";

export function BuiltToKeepYouGoing() {
  const [selectedCapsuleDuration, setSelectedCapsuleDuration] = useState("6 months");
  const [capsuleEnabled, setCapsuleEnabled] = useState(true);

  return (
    <section className="py-20 md:py-32 bg-white border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header matching Image 1 */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            MORE THAN DOCUMENTING
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-[#1c221e] tracking-tight">
            Built to keep you going
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5a625d] leading-relaxed">
            Logging is the easy part. Coming back is the hard part. onWard is built for both.
          </p>
        </div>

        {/* 4 Feature Cards Grid / Horizontal Carousel matching Image 1 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Reminders (Soft Sage/Mint Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#eaf2e8] p-6 sm:p-7 shadow-xs">
            {/* Embedded Push Notification Mockups */}
            <div className="space-y-3 pt-2 pb-6">
              {/* Notification Pill 1 */}
              <div className="rounded-2xl bg-white/95 p-3.5 shadow-sm border border-zinc-200/40">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#283618] text-white text-xs">
                    ☰
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">Receipts</span>
                      <span className="text-[10px] text-zinc-400">18:00</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-600 leading-snug">
                      What did you ship or move forward today, however small? Log it while it&apos;s fresh.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Pill 2 */}
              <div className="rounded-2xl bg-white/70 p-3 shadow-2xs border border-zinc-200/30">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#556947] text-white text-xs">
                    ☰
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800">Receipts</span>
                      <span className="text-[10px] text-zinc-400">Yesterday</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-500 leading-snug">
                      Quick one before you log off?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#d8e5d5] pt-5">
              <h3 className="font-heading text-xl font-bold text-[#1c221e]">
                Reminders
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Forget? Get a nudge by push notification or desktop alert at a time you choose, to log your work while it is still fresh.
              </p>
            </div>
          </div>

          {/* Card 2: Insights (Warm Sand / Peach Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f7efe5] p-6 sm:p-7 shadow-xs">
            {/* Embedded Evidence Goal Mockup */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200/50 text-left">
              <span className="text-[11px] font-bold text-zinc-900 block">Evidence for your goals</span>
              <span className="text-[9.5px] text-zinc-400 block mb-3">Prepare for reviews</span>

              {/* Progress Bars */}
              <div className="space-y-2 text-[10px]">
                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-0.5">
                    <span>Technical delivery</span>
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
                    <span>Problem solving</span>
                    <span className="text-amber-700 font-bold">Light</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-amber-600/70" />
                    ))}
                    {[4, 5].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-zinc-200" />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-zinc-700 mb-0.5">
                    <span>Collaboration</span>
                    <span className="font-bold text-[#2e5732]">Strong</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="h-1.5 flex-1 rounded-full bg-[#2e5732]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Gap Hint Callout */}
              <div className="mt-3 rounded-xl bg-[#fff7ed] border border-amber-200/70 p-2 text-[9.5px] text-amber-900 leading-tight">
                <strong>Gap: Learning has 1 receipt so far.</strong> It counts toward reviews. Is there a recent example you could log?
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[#e8ded1] pt-5 mt-4">
              <h3 className="font-heading text-xl font-bold text-[#1c221e]">
                Insights
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                See what your record says about you. Your stage, your strongest skills, and the gaps worth filling before your next review.
              </p>
            </div>
          </div>

          {/* Card 3: Time Capsule (Soft Mint / Sage Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f0f5ee] p-6 sm:p-7 shadow-xs">
            {/* Embedded Time Capsule Selector */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-200/50 text-left">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span className="text-xs font-bold text-zinc-900">Time Capsule</span>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] text-zinc-500 font-semibold">Optional</span>
                </div>
                {/* Switch toggle */}
                <button
                  type="button"
                  onClick={() => setCapsuleEnabled(!capsuleEnabled)}
                  className={`h-5 w-9 rounded-full transition-colors relative ${
                    capsuleEnabled ? "bg-[#283618]" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                      capsuleEnabled ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <p className="mt-2 text-[10px] text-zinc-500">
                We send this back to you at your chosen date.
              </p>

              {/* Interval Buttons matching Image 1 */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-zinc-700">
                {["3 months", "6 months", "1 year", "Pick a date"].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSelectedCapsuleDuration(dur)}
                    className={`rounded-lg py-1.5 px-2 border transition ${
                      selectedCapsuleDuration === dur
                        ? "bg-[#e8decb] border-[#8b6f47] text-[#4a3b26] font-bold"
                        : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-[9.5px] text-zinc-400 text-center font-medium">
                Arrives 20 April 2027.
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-[#dde6da] pt-5 mt-4">
              <h3 className="font-heading text-xl font-bold text-[#1c221e]">
                Time Capsule
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Write to future you. Save a receipt today, pick a date, and we send it back for the days you forget how far you have come.
              </p>
            </div>
          </div>

          {/* Card 4: Build & Compile (Soft Cream / Warm Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f7f4ed] p-6 sm:p-7 shadow-xs">
            {/* Embedded Action List matching Image 1 */}
            <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-zinc-200/50 text-left space-y-1.5">
              {[
                { icon: "🔗", title: "Social post", sub: "Draft in your voice" },
                { icon: "↗️", title: "Cold outreach", sub: "Introduce yourself" },
                { icon: "✉️", title: "Cover letter", sub: "Tailored to a role" },
                { icon: "📋", title: "Brag sheet", sub: "One-page career summary" },
                { icon: "🎙️", title: "Speaking bio", sub: "For a talk, panel" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-zinc-50 transition cursor-pointer"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-xs">
                    {item.icon}
                  </span>
                  <div>
                    <h5 className="text-[11px] font-bold text-zinc-900 leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-[9px] text-zinc-400">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-[#e8e2d5] pt-5 mt-4">
              <h3 className="font-heading text-xl font-bold text-[#1c221e]">
                Build & Compile
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#556158] leading-relaxed">
                Something coming up? Promotion review, interview, or social post? onWard builds what you need from verified records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

