'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, supabase } = useAuth();
  const { isOpen, setIsOpen, isMobile } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);
  const [reportToken, setReportToken] = useState<string | null>(null);

  // Fetch user's report token
  useEffect(() => {
    if (user) {
      fetch('/api/user/report-token')
        .then(res => res.json())
        .then(data => {
          if (data.reportToken) {
            setReportToken(data.reportToken);
          }
        })
        .catch(() => {
        });
    } else {
      setReportToken(null);
    }
  }, [user]);

  // Don't show sidebar on verify pages
  if (pathname?.startsWith('/verify/')) {
    return null;
  }

  // Don't show sidebar if user is not signed in
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    
    try {
      await supabase.auth.signOut();
    } catch {
    } finally {
      setSigningOut(false);
    }
  };

  const sidebarWidth = isOpen ? 'w-64' : 'w-16';
  const sidebarClasses = `fixed left-0 top-0 h-full bg-terminal-card border-r border-terminal-border transition-all duration-300 z-50 ${sidebarWidth} flex flex-col`;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-terminal-border">
          {isOpen ? (
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-profit rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">✅</span>
              </div>
              <span className="font-semibold text-terminal-text">Prop PNL</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-profit rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white text-lg">✅</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <span className="text-lg">✕</span> : <span className="text-lg">☰</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {reportToken && (
            <Link
              href={`/report/${reportToken}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname?.startsWith('/report/')
                  ? 'bg-profit/10 text-profit'
                  : 'text-terminal-text hover:bg-black/5'
              }`}
            >
              <span className="flex-shrink-0 text-lg">📊</span>
              {isOpen && <span className="text-sm font-medium">View Report</span>}
            </Link>
          )}

          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/settings'
                ? 'bg-profit/10 text-profit'
                : 'text-terminal-text hover:bg-black/5'
            }`}
          >
            <span className="flex-shrink-0 text-lg">⚙️</span>
            {isOpen && <span className="text-sm font-medium">Settings</span>}
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t border-terminal-border p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-terminal-muted text-base">👤</span>
            </div>
            {isOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-terminal-text truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-terminal-text hover:bg-black/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex-shrink-0 text-lg">🚪</span>
            {isOpen && (
              <span className="text-sm font-medium">
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </span>
            )}
          </button>
        </div>
      </aside>

    </>
  );
}
