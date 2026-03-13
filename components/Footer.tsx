import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-terminal-bg border-t border-terminal-border mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.svg" alt="" width={24} height={24} className="object-contain" />
            <span className="text-sm font-mono font-semibold text-profit tracking-tight">Prop PNL</span>
            <span className="text-xs text-terminal-muted font-mono">&copy; {currentYear}</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/connect" className="text-xs font-mono text-terminal-muted hover:text-profit transition-colors">Connect Bank</Link>
            <Link href="/security" className="text-xs font-mono text-terminal-muted hover:text-profit transition-colors">Security</Link>
            <Link href="/disclaimers" className="text-xs font-mono text-terminal-muted hover:text-profit transition-colors">Disclaimers</Link>
            <a href="mailto:support@proppnl.com" className="text-xs font-mono text-terminal-muted hover:text-profit transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
