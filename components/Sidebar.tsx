'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileCheck, User, LogOut, Settings, BarChart3, Menu, X } from 'lucide-react';
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
        .catch(err => {
          console.error('Error fetching report token:', err);
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
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setSigningOut(false);
    }
  };

  const sidebarWidth = isOpen ? 'w-64' : 'w-16';
  const sidebarClasses = `fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${sidebarWidth} flex flex-col`;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen ? (
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Income Verifier</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {reportToken && (
            <Link
              href={`/report/${reportToken}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname?.startsWith('/report/')
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">View Report</span>}
            </Link>
          )}

          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/settings'
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Settings</span>}
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            {isOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
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
