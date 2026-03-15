/**
 * Skeleton shell for report page (shown while data loads).
 * Used by loading.tsx for both /report/[token] and /share/[token].
 */
export function ReportPageShell() {
  return (
    <div className="min-h-screen text-terminal-text bg-terminal-bg">
      {/* Sticky header shell */}
      <div
        className="sticky top-0 z-50 border-b border-terminal-border shadow-[0_1px_0_0_rgba(0,230,118,0.08)] bg-terminal-header"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
          {/* Title row */}
          <div className="mb-3">
            <div className="h-7 w-48 bg-terminal-muted/20 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-12 bg-terminal-muted/20 rounded animate-pulse" />
              <div className="h-4 w-24 bg-terminal-muted/20 rounded animate-pulse" />
              <div className="h-4 w-16 bg-terminal-muted/20 rounded animate-pulse hidden sm:block" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-terminal-muted/20 rounded-lg animate-pulse" />
              <div className="h-8 w-16 bg-terminal-muted/20 rounded-lg animate-pulse" />
              <div className="h-8 w-14 bg-terminal-muted/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-32 bg-terminal-muted/20 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-terminal-muted/20 rounded-lg animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-36 bg-terminal-muted/20 rounded-lg animate-pulse" />
              <div className="h-9 w-20 bg-terminal-muted/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tabs row */}
        <div className="max-w-7xl mx-auto border-t border-terminal-border">
          <div className="flex items-center gap-0 px-4 md:px-6 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-terminal-muted/15 animate-pulse rounded mr-4 flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Content area shell */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-terminal-muted/15 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-terminal-muted/15 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-48 bg-terminal-muted/15 rounded-xl animate-pulse" />
            <div className="h-48 bg-terminal-muted/15 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
