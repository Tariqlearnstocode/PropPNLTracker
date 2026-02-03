import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDES } from '@/lib/guides';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | Prop Firm Trading Guide | Prop PNL`,
    description: guide.description,
    openGraph: {
      title: `${guide.title} | Prop PNL`,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const sortedGuides = [...GUIDES].sort((a, b) => a.order - b.order);
  const currentIndex = sortedGuides.findIndex((g) => g.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const guide = sortedGuides[currentIndex];
  const prevGuide = currentIndex > 0 ? sortedGuides[currentIndex - 1] : null;
  const nextGuide =
    currentIndex < sortedGuides.length - 1
      ? sortedGuides[currentIndex + 1]
      : null;

  const Content = guide.content;

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <section
        className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link
                href="/guide"
                className="text-sm font-mono text-profit hover:text-profit/80 transition-colors flex items-center gap-1.5"
              >
                <span>←</span>
                All guides
              </Link>
            </div>

            {/* Guide number + meta */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-profit text-terminal-bg rounded-full flex items-center justify-center text-lg font-bold font-mono flex-shrink-0">
                {guide.order}
              </div>
              <span className="text-sm text-terminal-muted font-mono">
                Guide {guide.order} of {sortedGuides.length}
              </span>
              <span className="text-terminal-border">·</span>
              <span className="flex items-center gap-1.5 text-sm text-terminal-muted font-mono">
                <span>⏱️</span>
                {guide.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-terminal-text leading-tight">
              {guide.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-12 sm:py-16 bg-terminal-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl mx-auto">
            <Content />
          </article>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto flex items-stretch justify-between gap-4">
            {prevGuide ? (
              <Link
                href={`/guide/${prevGuide.slug}`}
                className="flex-1 bg-terminal-card rounded-lg border border-terminal-border p-4 sm:p-6 hover:border-profit/30 transition-colors group"
              >
                <span className="flex items-center gap-1.5 text-sm text-terminal-muted font-mono mb-2">
                  <span>←</span>
                  Previous
                </span>
                <span className="text-terminal-text font-semibold group-hover:text-profit transition-colors">
                  {prevGuide.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextGuide ? (
              <Link
                href={`/guide/${nextGuide.slug}`}
                className="flex-1 bg-terminal-card rounded-lg border border-terminal-border p-4 sm:p-6 hover:border-profit/30 transition-colors group text-right"
              >
                <span className="flex items-center justify-end gap-1.5 text-sm text-terminal-muted font-mono mb-2">
                  Next
                  <span>→</span>
                </span>
                <span className="text-terminal-text font-semibold group-hover:text-profit transition-colors">
                  {nextGuide.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 border-t border-profit/20"
        style={{
          background:
            'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-6 leading-tight">
            Get your bank-verified P&L
          </h2>
          <p className="text-lg text-terminal-muted mb-8 max-w-2xl mx-auto">
            Connect your bank and see your real prop firm profit and loss in
            about 60 seconds. Every payout and every fee — automatically.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank — Free
            <span>→</span>
          </Link>
          <p className="text-xs text-terminal-muted font-mono mt-4">
            No card required · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
