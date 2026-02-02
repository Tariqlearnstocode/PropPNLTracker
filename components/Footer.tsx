import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-terminal-bg border-t border-terminal-border mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-profit rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-terminal-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-terminal-muted">
              © {currentYear}, Prop PNL
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/pricing" className="text-terminal-muted hover:text-terminal-text transition-colors">
              Pricing
            </Link>
            <Link href="/security" className="text-terminal-muted hover:text-terminal-text transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimers" className="text-terminal-muted hover:text-terminal-text transition-colors">
              Terms of Use
            </Link>
            <Link href="/security" className="text-terminal-muted hover:text-terminal-text transition-colors">
              Security
            </Link>
            <Link href="/disclaimers" className="text-terminal-muted hover:text-terminal-text transition-colors">
              Disclaimers
            </Link>
            <Link href="mailto:support@example.com" className="text-terminal-muted hover:text-terminal-text transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Secondary Links */}
        <div className="mt-4 pt-4 border-t border-terminal-border text-center">
          <Link
            href="/security#gdpr"
            className="text-xs text-terminal-muted hover:text-terminal-text transition-colors"
          >
            Do Not Sell or Share My Personal Information
          </Link>
        </div>
      </div>
    </footer>
  );
}
