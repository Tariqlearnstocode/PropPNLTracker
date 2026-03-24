import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getAllGuides, getAllGuideSlugs, getGuideBySlug } from '@/lib/content';
import { mdxComponents } from '@/lib/mdx-components';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.meta.title} | Prop Firm Trading Guide | Prop PNL`,
    description: guide.meta.description,
    openGraph: {
      title: `${guide.meta.title} | Prop PNL`,
      description: guide.meta.description,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const allGuides = getAllGuides();
  const currentIndex = allGuides.findIndex((g) => g.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide =
    currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-terminal-bg">
      <section
        className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, var(--color-terminal-bg) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link
                href="/guide"
                className="text-sm font-mono text-profit hover:text-profit/80 transition-colors flex items-center gap-1.5"
              >
                <span>←</span>
                All guides
              </Link>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-profit text-terminal-bg rounded-full flex items-center justify-center text-lg font-bold font-mono flex-shrink-0">
                {guide.meta.order}
              </div>
              <span className="text-sm text-terminal-muted font-mono">
                Guide {guide.meta.order} of {allGuides.length}
              </span>
              <span className="text-terminal-border">·</span>
              <span className="text-sm text-terminal-muted font-mono">
                {guide.meta.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-terminal-text leading-tight">
              {guide.meta.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-terminal-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl mx-auto">
            <MDXRemote
              source={guide.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </article>
        </div>
      </section>

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

      <section
        className="py-24 border-t border-profit/20"
        style={{
          background:
            'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), var(--color-terminal-header))',
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
