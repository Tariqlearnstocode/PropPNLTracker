'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function GlobalNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, supabase } = useAuth();

  // Don't show navbar on verify pages
  if (pathname?.startsWith('/verify/')) {
    return null;
  }

  // Authenticated: slim top bar
  if (user) {
    const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push('/');
    };

    return (
      <header className="bg-terminal-bg border-b border-terminal-border sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Left: App name with green dot */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-profit" />
              </span>
              <span className="font-display font-semibold text-terminal-text text-sm tracking-wide">
                Prop PNL
              </span>
            </Link>

            {/* Right: email, settings, sign out */}
            <div className="flex items-center gap-4">
              <span className="text-terminal-muted text-xs font-mono hidden sm:inline truncate max-w-[180px]">
                {user.email}
              </span>
              <Link
                href="/settings"
                className="text-terminal-muted hover:text-terminal-text text-xs font-mono transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="text-terminal-muted hover:text-terminal-text text-xs font-mono transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Unauthenticated: landing page nav
  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode } }));
  };

  return (
    <header className="bg-terminal-bg border-b border-terminal-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-profit" />
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
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
