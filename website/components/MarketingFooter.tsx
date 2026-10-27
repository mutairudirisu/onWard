import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#e3e8de] bg-[#161a17] text-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Pre-footer Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#212822] via-[#28322a] to-[#212822] border border-white/10 p-8 sm:p-14 text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#d3f36b]">
            Start Making Real Progress
          </span>
          <h2 className="font-heading mt-3 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to move your day onWard?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-zinc-300">
            Join builders and professionals who manage tasks, compose documents, and document verifiable milestones.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={APP_URL}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d3f36b] px-8 text-sm font-extrabold text-[#283618] shadow-lg shadow-[#d3f36b]/20 transition-all hover:bg-[#c4e65d] active:scale-98"
            >
              <span>Launch onWard Now</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Links & Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-decoration-none group">
              <span className="font-heading text-2xl font-extrabold tracking-tighter text-white">
                <span className="text-[#d3f36b]">o</span>nWard
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A personal productivity and workspace application that connects daily task planning, notes, achievements, work logs, and collaborative projects in one calm place.
            </p>
            <p className="text-[11px] font-semibold text-[#d3f36b]">
              A little progress, every day.
            </p>
          </div>

          {/* Column 1: Personal Productivity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Personal Productivity</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Daily Tasks & 12h Alarms
                </Link>
              </li>
              <li>
                <Link href="#workspace" className="hover:text-white transition">
                  Notes & Mind Map Studio
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white transition">
                  Achievements & Milestones
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Expandable Calendar Strip
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Workspace & Professional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Workspace Management</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="#how-it-works" className="hover:text-white transition">
                  Daily Work Logs
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Projects & Team Invites
                </Link>
              </li>
              <li>
                <Link href="#workspace" className="hover:text-white transition">
                  Word (.doc) & PDF Studio
                </Link>
              </li>
              <li>
                <Link href="#workspace" className="hover:text-white transition">
                  Workspace Drag-and-Drop Folders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Platform</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <span className="text-zinc-400">100% Offline-Capable PWA</span>
              </li>
              <li>
                <span className="text-zinc-400">Supabase Cloud Sync</span>
              </li>
              <li>
                <span className="text-zinc-400">Row-Level Security (RLS)</span>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition">
                  Transparent Naira (₦) Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} onWard. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guarantees</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

