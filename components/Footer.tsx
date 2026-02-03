import Link from 'next/link';
import Image from 'next/image';

const linkClass = 'text-xs font-mono text-terminal-muted hover:text-profit transition-colors block py-0.5';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-terminal-bg border-t border-terminal-border mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Row 1: Logo | Product (stacked) · Resources (stacked) · Legal (stacked) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.svg" alt="" width={24} height={24} className="object-contain" />
            <span className="text-sm font-mono font-semibold text-profit tracking-tight">Prop PNL</span>
            <span className="text-xs text-terminal-muted font-mono">© {currentYear}</span>
          </Link>

          <nav className="flex flex-wrap gap-x-8 gap-y-4 sm:gap-x-10">
            <div>
              <div className="text-xs font-mono font-medium text-terminal-text uppercase tracking-wider mb-2">Product</div>
              <div className="flex flex-col">
                <Link href="/pricing" className={linkClass}>Pricing</Link>
                <Link href="/connect" className={linkClass}>Connect Bank</Link>
                <Link href="/leaderboard" className={linkClass}>Leaderboard</Link>
                <Link href="/faq" className={linkClass}>FAQ</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-medium text-terminal-text uppercase tracking-wider mb-2">Resources</div>
              <div className="flex flex-col">
                <Link href="/firms" className={linkClass}>Firms</Link>
                <Link href="/blog" className={linkClass}>Blog</Link>
                <Link href="/guide" className={linkClass}>Guide</Link>
                <Link href="/compare" className={linkClass}>Compare</Link>
                <a href="mailto:support@example.com" className={linkClass}>Contact</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-medium text-terminal-text uppercase tracking-wider mb-2">Legal</div>
              <div className="flex flex-col">
                <Link href="/security" className={linkClass}>Security</Link>
                <Link href="/disclaimers" className={linkClass}>Disclaimers</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Row 2: Do not sell or share */}
        <div className="mt-4 pt-4 border-t border-terminal-border text-center">
          <Link href="/security#gdpr" className={`${linkClass} text-xs`}>
            Do Not Sell or Share My Personal Information
          </Link>
        </div>
      </div>
    </footer>
  );
}
