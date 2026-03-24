import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-profit">{children}</span>;
}

function CTA({
  title,
  description,
  href = '/connect',
  label = 'Connect Your Bank - Free',
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
      <p className="text-terminal-text mb-4 text-lg font-semibold">{title}</p>
      <p className="text-terminal-muted mb-6 text-sm">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
      >
        {label}
      </Link>
    </div>
  );
}

function CalcBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-terminal-card rounded-lg border border-terminal-border p-6 mb-6 font-mono text-sm">
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CalcRow({
  label,
  value,
  type = 'neutral',
}: {
  label: string;
  value: string;
  type?: 'income' | 'expense' | 'total' | 'neutral' | 'label';
}) {
  if (type === 'total') {
    return (
      <div className="border-t border-terminal-border mt-3 pt-3 flex justify-between font-bold text-terminal-text">
        <span>{label}</span>
        <span className="text-profit">{value}</span>
      </div>
    );
  }
  if (type === 'label') {
    return (
      <div className="border-t border-terminal-border mt-3 pt-3 text-terminal-muted text-xs mb-2">
        {label}
      </div>
    );
  }
  return (
    <div className="flex justify-between text-terminal-text">
      <span>{label}</span>
      <span className={type === 'income' ? 'text-profit' : type === 'expense' ? 'text-red-400' : ''}>
        {value}
      </span>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="text-2xl font-bold text-terminal-text mt-12 mb-4"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl font-semibold text-terminal-text mt-8 mb-3"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-terminal-text mb-6 leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside space-y-2 text-terminal-text mb-6 ml-4"
      {...props}
    />
  ),
  li: (props) => <li {...props} />,
  strong: (props) => <strong className="text-profit" {...props} />,
  em: (props) => <em {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6"
      {...props}
    />
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-profit underline hover:text-profit/80"
      {...props}
    >
      {children}
    </a>
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead {...props} />,
  th: (props) => (
    <th
      className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="text-terminal-text py-2 px-3 border-b border-terminal-border"
      {...props}
    />
  ),
  Highlight,
  CTA,
  CalcBox,
  CalcRow,
};
