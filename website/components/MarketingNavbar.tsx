"use client";

import { useState } from "react";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e3e8de]/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-1.5 text-decoration-none group">
          <span className="font-heading text-2xl font-extrabold tracking-tighter text-[#1c221e]">
            <span className="text-[#85a900] group-hover:text-[#a0cc00] transition-colors">o</span>nWard
          </span>
          <span className="flex flex-col text-[8.5px] font-bold tracking-tight text-[#808784] leading-tight">
            <span className="text-[7.5px] font-medium">by</span>
            <span>GIGS Labs</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5a625d]">
          <Link href="#features" className="transition-colors hover:text-[#1c221e]">
            Features
          </Link>
          <Link href="#workspace" className="transition-colors hover:text-[#1c221e]">
            Workspace Studio
          </Link>
          <Link href="#milestones" className="transition-colors hover:text-[#1c221e]">
            Milestones
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-[#1c221e]">
            Pricing
          </Link>
          <Link href="#faq" className="transition-colors hover:text-[#1c221e]">
            FAQ
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={APP_URL}
            className="flex h-10 items-center justify-center rounded-xl px-4 text-xs font-bold text-[#31372f] transition hover:bg-[#eff3eb]"
          >
            Sign In
          </a>
          <a
            href={APP_URL}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#d3f36b] px-4.5 text-xs font-extrabold text-[#283618] shadow-sm transition hover:bg-[#c3e856] active:scale-95"
          >
            <span>Launch onWard App</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 md:hidden items-center justify-center rounded-xl border border-zinc-200 text-zinc-700"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#e3e8de] bg-white px-6 py-6 md:hidden animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-4 text-base font-semibold text-[#31372f]">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#85a900]"
            >
              Features
            </Link>
            <Link
              href="#workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#85a900]"
            >
              Workspace Studio
            </Link>
            <Link
              href="#milestones"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#85a900]"
            >
              Milestones
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#85a900]"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#85a900]"
            >
              FAQ
            </Link>
            <div className="pt-3 flex flex-col gap-2.5">
              <a
                href={APP_URL}
                className="flex h-11 items-center justify-center rounded-xl bg-[#d3f36b] text-sm font-extrabold text-[#283618]"
              >
                Launch onWard App
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

