import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
        <h1 className="text-xl font-semibold text-terminal-text mb-2">Page not found</h1>
        <p className="text-terminal-muted mb-4">
          This page doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
