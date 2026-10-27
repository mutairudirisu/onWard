export function FAQSection() {
  const faqs = [
    {
      q: "What makes onWard different from ordinary task lists?",
      a: "Most task managers only track completion checkboxes. onWard is built around career and project momentum: it integrates daily focus planning, clock reminders with context notes, rich document workspaces with Word & PDF export, and an automated Proof of Work compiler that turns your completed tasks into quantified achievements ready to share on LinkedIn or performance appraisals.",
    },
    {
      q: "Can I install onWard as a mobile app on my phone?",
      a: "Yes! onWard is a Progressive Web App (PWA). When you visit the app in Safari on iOS or Chrome on Android, you can tap 'Add to Home Screen' to install it as a standalone app with offline support and native responsiveness.",
    },
    {
      q: "How does the Word (.doc) and PDF document studio work?",
      a: "Inside any workspace, click 'New Document' or open an existing file. You can format headers, insert checklists, add sketch notes, and style tables with curated palettes (Lime, Corporate Slate, Oceanic Navy, etc.). With one click on 'Download .doc', onWard generates a real Microsoft Word document file, or click 'Print PDF' to export an executive-ready PDF.",
    },
    {
      q: "Does onWard work completely offline?",
      a: "Yes. onWard is architected with client-side state caching and service worker support. You can add tasks, take notes, and make edits offline. As soon as your device reconnects, changes sync smoothly back to your Supabase cloud backend.",
    },
    {
      q: "How does the Achievement to LinkedIn compiler work?",
      a: "When you log a milestone in onWard, select your domain (Tech, Leadership, Product, Operations) and impact suggestions. The compiler generates formatted LinkedIn and X (Twitter) posts with metrics, competencies, and tags that you can publish in a single click.",
    },
    {
      q: "Where is my data stored and is it secure?",
      a: "Your data is stored in your dedicated Supabase PostgreSQL instance protected by Row-Level Security (RLS) policies. Only you and team members you explicitly invite can access your workspace documents.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-white border-t border-[#e3e8de]/80">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#85a900]">
            Frequently Asked Questions
          </p>
          <h2 className="font-heading mt-3 text-3xl sm:text-4xl font-extrabold text-[#1c221e] tracking-tight">
            Got questions? We have answers.
          </h2>
        </div>

        <div className="mt-14 space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/90 bg-[#fafcfa] p-6 sm:p-7 shadow-xs"
            >
              <h3 className="font-heading text-base sm:text-lg font-bold text-zinc-900">
                {faq.q}
              </h3>
              <p className="mt-2.5 text-sm text-[#5a625d] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

