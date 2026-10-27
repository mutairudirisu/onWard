export function FAQSection() {
  const faqs = [
    {
      q: "What is onWard and what problems does it solve?",
      a: "onWard is a personal productivity and workspace application that helps individuals organize their lives, manage their work, track daily activities, and keep a lasting record of their progress. It solves the fragmentation of using separate disconnected apps for to-do lists, quick notes, work records, and project management by connecting personal productivity with professional work management in one calm place.",
    },
    {
      q: "How do personal productivity and workspace management work together?",
      a: "In onWard, your personal task planning and ideas flow naturally into professional execution. You plan your daily activities in Tasks, capture ideas in Notes with mind maps and sketches, record daily contributions in Work Logs, manage initiatives in Projects, and compile your wins into verifiable Achievements.",
    },
    {
      q: "What can I do with Notes, Mind Maps, and Sketches?",
      a: "The onWard Note Studio is designed for rapid thought capture. In addition to rich formatting and bulleted lists, you can click '🌱 Create a mind map' to automatically outline ideas visually, use the built-in drawing pad to sketch diagrams, or use voice dictation to take notes hands-free.",
    },
    {
      q: "How do Work Logs and Projects help teams and individuals?",
      a: "Work Logs provide a dedicated space to record daily work activities, document key outcomes, capture lessons learned, and track blockers while they are fresh. Projects let you organize related work, track progress status (Planning, In Progress, Completed), invite team members to collaborate, and keep important work documents together.",
    },
    {
      q: "Can I install onWard on my mobile phone and use it offline?",
      a: "Yes! onWard is a Progressive Web App (PWA). You can tap 'Add to Home Screen' in Safari on iOS or Chrome on Android for an app experience with offline capability and fast local caching. When you reconnect, your data syncs securely with Supabase.",
    },
    {
      q: "What currency is used for pricing and how do I subscribe?",
      a: "All onWard pricing is in Nigerian Naira (NGN / ₦). The Personal tier is completely free forever. The Pro Workspace plan is ₦5,000 / month (or ₦4,000 / month billed annually at ₦48,000 / year). We support local debit cards, bank transfers, and standard payment channels.",
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
            Everything you need to know about onWard.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#5a625d]">
            Clear answers about features, personal productivity, workspace management, and pricing.
          </p>
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
