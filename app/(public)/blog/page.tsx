import Link from 'next/link';
import { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog | Prop Firm P&L Tracker',
  description:
    'Guides, insights, and real talk about prop firm profitability. Learn about fees, taxes, and how to calculate your true P&L.',
  openGraph: {
    title: 'Blog | Prop Firm P&L Tracker',
    description:
      'Guides, insights, and real talk about prop firm profitability.',
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <section
        className="pt-20 pb-16 sm:pt-28 sm:pb-20"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Blog
            </h1>
            <p className="text-lg text-terminal-muted">
              Guides, insights, and real talk about prop firm profitability.
            </p>
          </div>
        </div>
      </section>

      {/* Post List */}
      <section className="py-16 bg-terminal-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-terminal-card rounded-lg border border-terminal-border p-6 hover:border-profit/30 transition-colors group"
              >
                <div className="flex items-center gap-3 text-xs text-terminal-muted font-mono mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date + 'T00:00:00').toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </time>
                  <span className="text-terminal-border">|</span>
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-terminal-text mb-2 group-hover:text-profit transition-colors">
                  {post.title}
                </h2>

                <p className="text-terminal-muted text-sm mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
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
                  <span className="text-sm font-mono text-profit group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4">
            Ready to see your real P&L?
          </h2>
          <p className="text-terminal-muted mb-8 max-w-xl mx-auto">
            Stop guessing at profitability. Connect your bank and get
            bank-verified prop firm P&L in about 60 seconds.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
