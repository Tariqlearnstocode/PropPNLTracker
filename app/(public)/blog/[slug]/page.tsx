import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogSlugs } from '@/lib/blog-posts';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Prop Firm P&L Tracker Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Article Header */}
      <section
        className="pt-20 pb-12 sm:pt-28 sm:pb-16"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-terminal-muted hover:text-profit transition-colors mb-8"
          >
            <span>←</span>
            Back to Blog
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-terminal-text mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-terminal-muted font-mono mb-4">
            <time dateTime={post.date}>
              {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-terminal-border">|</span>
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              {post.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-mono text-profit/70 bg-profit/5 border border-profit/10 rounded px-2 py-0.5"
              >
                <span>🏷️</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.content()}
        </div>
      </article>

      {/* Bottom CTA */}
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4">
            Get your real P&L
          </h2>
          <p className="text-terminal-muted mb-8 max-w-xl mx-auto">
            Bank-verified prop firm P&L in about 60 seconds. No spreadsheets, no
            guessing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
            >
              Connect Your Bank - Free
              <span>→</span>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-terminal-muted hover:text-profit transition-colors"
            >
              <span>←</span>
              More articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
