"use client";

import { useState } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const isAnnual = billingCycle === "annually";
  const proPrice = isAnnual ? "₦4,000" : "₦5,000";
  const proPeriod = isAnnual ? "/ user / month, billed annually" : "/ user / month";

  return (
    <section id="pricing" className="py-20 md:py-32 bg-[#f8faf7] border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            Simple & Transparent
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-[#1c221e] tracking-tight">
            Plans for individual focus and team momentum.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#5a625d]">
            Start free with full personal productivity features. Upgrade only when you need collaborative team workspaces and executive exports.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center rounded-2xl bg-zinc-200/70 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annually")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isAnnual
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-[#d3f36b] px-2 py-0.5 text-[10px] font-extrabold text-[#283618]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tier 1: Personal Free */}
          <div className="rounded-3xl border border-[#e3e8de] bg-white p-8 sm:p-10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-2xl font-bold text-zinc-900">Personal</h3>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                  Free Forever
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Ideal for individuals, indie builders, and students tracking daily focus.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900">₦0</span>
                <span className="text-xs font-semibold text-zinc-400">/ user</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm text-zinc-700">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Daily Journey & Expandable Calendar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Unlimited tasks with 12h clock reminders</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Personal notes with sketch drawing pad</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Achievement tracking with LinkedIn post compiler</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>100% Offline PWA support on iOS & Android</span>
                </li>
              </ul>
            </div>

            <a
              href={APP_URL}
              className="mt-10 flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-800 transition hover:bg-zinc-100"
            >
              Get Started Free
            </a>
          </div>

          {/* Tier 2: Pro Workspace */}
          <div className="relative rounded-3xl border-2 border-[#85a900] bg-white p-8 sm:p-10 shadow-xl flex flex-col justify-between">
            {/* Top pill */}
            <div className="absolute -top-3.5 right-8 rounded-full bg-[#d3f36b] px-3.5 py-0.5 text-[11px] font-extrabold text-[#283618] uppercase tracking-wider shadow-sm">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-2xl font-bold text-zinc-900">Pro Workspace</h3>
                <span className="rounded-full bg-[#f4ffe0] px-3 py-1 text-xs font-bold text-[#354516]">
                  For Teams & Builders
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                For professionals, consultants, and teams delivering cross-functional outcomes.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-zinc-900">{proPrice}</span>
                <span className="text-xs font-semibold text-zinc-400">{proPeriod}</span>
              </div>
              {isAnnual && (
                <p className="mt-1 text-xs font-semibold text-emerald-600">
                  Billed annually at ₦48,000 / year (save ₦12,000)
                </p>
              )}

              <ul className="mt-8 space-y-3 text-sm text-zinc-700">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span><strong>Everything in Personal</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Drag-and-drop workspace folders & permissions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Word (.doc) & PDF Studio with custom table themes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Document audit trail, revisions, & threaded comments</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#85a900] font-bold">✓</span>
                  <span>Team work logs & automated executive reports</span>
                </li>
              </ul>
            </div>

            <a
              href={APP_URL}
              className="mt-10 flex h-12 items-center justify-center rounded-xl bg-[#d3f36b] text-sm font-extrabold text-[#283618] shadow-md shadow-[#85a900]/20 transition hover:bg-[#c4e65d] active:scale-98"
            >
              Start 14-Day Free Trial
            </a>
          </div>
        </div>

        {/* Local payment methods disclaimer */}
        <p className="mt-10 text-center text-xs text-zinc-400">
          All pricing displayed in Nigerian Naira (NGN / ₦). Supports local bank transfers, debit cards, and USSD payments.
        </p>
      </div>
    </section>
  );
}
