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
            <Link href="/" className="flex items-baseline gap-1.5 text-decoration-none group">
              <span className="font-heading text-2xl font-extrabold tracking-tighter text-white">
                <span className="text-[#d3f36b]">o</span>nWard
              </span>
              <span className="flex flex-col text-[8.5px] font-bold tracking-tight text-zinc-400 leading-tight">
                <span className="text-[7.5px] font-medium">by</span>
                <span>GIGS Labs</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A little progress, everyday. Designed for builders who value calm focus and tangible career momentum.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Product</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Daily Journey & Calendar
                </Link>
              </li>
              <li>
                <Link href="#workspace" className="hover:text-white transition">
                  Word & PDF Studio
                </Link>
              </li>
              <li>
                <Link href="#milestones" className="hover:text-white transition">
                  Clock Reminders
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition">
                  Milestone to LinkedIn
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Ecosystem</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <a href={APP_URL} className="hover:text-white transition">
                  Web Application
                </a>
              </li>
              <li>
                <span className="text-zinc-500">iOS & Android PWA</span>
              </li>
              <li>
                <span className="text-zinc-500">Supabase Cloud Sync</span>
              </li>
              <li>
                <span className="text-zinc-500">MS Word (.doc) Exporter</span>
              </li>
            </ul>
          </div>

          {/* Column 3: GIGS Labs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Company</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <span className="text-zinc-400">GIGS Labs Innovations</span>
              </li>
              <li>
                <span className="text-zinc-400">Security & Privacy First</span>
              </li>
              <li>
                <span className="text-zinc-400">Open API & Extensibility</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} onWard by GIGS Labs. All rights reserved.</p>
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

