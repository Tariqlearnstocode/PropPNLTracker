import { FAQAccordion } from '@/components/FAQ';
import { homepageFAQs } from '@/lib/faq-data';

export function FAQSection() {
  return (
    <section className="py-24 bg-terminal-card border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          {/* Left: heading + link */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-profit/20 bg-profit/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-profit" />
              <span className="text-xs font-mono text-profit/80 tracking-wide">FAQ</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-terminal-text mb-4 leading-tight">
              Questions?
              <span className="block text-profit mt-1">Answers.</span>
            </h2>
            <p className="text-terminal-muted mb-8 leading-relaxed">
              The most common things traders ask before connecting their bank.
            </p>
          </div>

          {/* Right: accordion */}
          <div>
            <FAQAccordion faqs={homepageFAQs} />
          </div>
        </div>
      </div>
    </section>
  );
}
