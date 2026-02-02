'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReportNav } from '@/contexts/ReportNavContext';

export default function GlobalNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, supabase } = useAuth();
  const { reportNav } = useReportNav();
  const [reportToken, setReportToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setReportToken(null);
      return;
    }
    fetch('/api/user/report-token')
      .then((res) => res.ok ? res.json() : { reportToken: null })
      .then((data) => setReportToken(data.reportToken ?? null))
      .catch(() => setReportToken(null));
  }, [user]);

  // On /share/ (public report view): show SharedReportBanner-style navbar
  if (pathname?.startsWith('/share/')) {
    const displayName = reportNav?.displayName ?? null;
    const onGetStarted = reportNav?.onGetStarted ?? (() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'signup' } })));
    return (
      <header className="sticky top-0 z-40 border-b border-profit/20" style={{ background: 'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="relative flex h-6 w-6">
                <Image src="/logo.svg" alt="" width={24} height={24} className="object-contain" />
              </span>
              <span className="text-sm font-mono font-semibold text-profit tracking-tight">Prop PNL</span>
            </div>
            <span className="text-terminal-border hidden sm:inline">·</span>
            <span className="text-sm font-mono text-terminal-muted truncate hidden sm:inline">
              {displayName ? `${displayName} shared their trading report with you` : "You're viewing a shared trading report"}
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-xs font-mono font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
          >
            Create yours free
          </button>
        </div>
      </header>
    );
  }

  // Don't show navbar on verify only (report page gets authenticated navbar with settings/profile)
  if (pathname?.startsWith('/verify/')) {
    return null;
  }

  // Authenticated: same gradient + layout as SharedReportBanner, but with Settings/Sign Out on the right
  if (user) {
    const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push('/');
    };

    const barButtonClass = 'px-4 py-2 text-xs font-mono font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap';

    return (
      <header className="sticky top-0 z-40 border-b border-profit/20" style={{ background: 'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="relative flex h-6 w-6">
                <Image src="/logo.svg" alt="" width={24} height={24} className="object-contain" />
              </span>
              <span className="text-sm font-mono font-semibold text-profit tracking-tight">Prop PNL</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-terminal-muted text-xs font-mono hidden sm:inline truncate max-w-[180px]">
              {user.email}
            </span>
            {reportToken && (
              <Link href={`/report/${reportToken}`} className={barButtonClass}>
                Report
              </Link>
            )}
            <Link href="/settings" className={barButtonClass}>
              Settings
            </Link>
            <button onClick={handleSignOut} className={barButtonClass}>
              Sign Out
            </button>
          </div>
        </div>
      </header>
    );
  }

  const navBg = 'bg-terminal-bg';

  // Unauthenticated: landing page nav
  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode } }));
  };

  const isViewingSharedReport = pathname?.startsWith('/share/');
  const primaryCtaLabel = isViewingSharedReport ? 'Get my report free' : 'Get Started';

  return (
    <header className={`${navBg} border-b border-terminal-border sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 py-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-6 w-6 flex-shrink-0">
              <Image src="/logo.svg" alt="" width={24} height={24} className="object-contain" />
            </span>
            <span className="font-display font-semibold text-terminal-text text-sm tracking-wide">Prop PNL</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleOpenAuthModal('signin')}
              className="px-3 sm:px-4 py-1.5 text-sm text-terminal-muted hover:text-terminal-text rounded-lg border border-terminal-border hover:bg-terminal-card-hover transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleOpenAuthModal('signup')}
              className="px-3 sm:px-4 py-1.5 bg-profit hover:bg-profit/90 text-terminal-bg text-sm font-medium rounded-lg transition-colors"
            >
              {primaryCtaLabel}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
