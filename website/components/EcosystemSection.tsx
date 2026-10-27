export function EcosystemSection() {
  const integrations = [
    { name: "Microsoft Word", icon: "📄", desc: "Native .doc export" },
    { name: "Supabase DB", icon: "⚡", desc: "Realtime PostgreSQL" },
    { name: "LinkedIn", icon: "💼", desc: "1-Click Post Compiler" },
    { name: "Apple & Android", icon: "📱", desc: "Standalone PWA" },
    { name: "Google Calendar", icon: "📅", desc: "Daily planning sync" },
    { name: "PDF Print Studio", icon: "🖨️", desc: "Clean executive prints" },
    { name: "X / Twitter", icon: "𝕏", desc: "Build in public updates" },
    { name: "WhatsApp & Alerts", icon: "💬", desc: "Direct reminder shares" },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-[#fbfcfa] border-t border-[#e3e8de]/80">
      {/* Background radial rays */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[600px] w-[600px] rounded-full border border-dashed border-zinc-300" />
        <div className="absolute h-[850px] w-[850px] rounded-full border border-dashed border-zinc-200" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
        {/* Headline matching Image 4 */}
        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1c221e] tracking-tight leading-tight">
          We keep your{" "}
          <span className="italic font-serif text-[#2563eb] underline decoration-[#d3f36b] decoration-4 underline-offset-4">
            work
          </span>{" "}
          <span className="italic font-serif text-[#16a34a]">
            up and running.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-[#5a625d]">
          Your competitor&apos;s daily focus just slipped. Yours didn&apos;t: never worry about fragmented notes, missed deadlines, or lost proof of work again.
        </p>

        {/* Central CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
            className="flex h-12 items-center gap-2 rounded-xl bg-zinc-900 px-7 text-sm font-extrabold text-white shadow-lg shadow-zinc-900/10 transition hover:bg-zinc-800 active:scale-98"
          >
            <span>Get Started Now</span>
            <span className="text-base">→</span>
          </a>
        </div>

        {/* Radiating Integration Chips Grid matching Image 4 */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs hover:border-[#85a900] hover:shadow-md transition-all duration-200"
            >
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-xs font-bold text-zinc-900">{item.name}</span>
              <span className="text-[10.5px] text-zinc-500 mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

