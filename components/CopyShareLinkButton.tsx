'use client';

import { useToast } from '@/components/ui/Toasts/use-toast';

export function CopyShareLinkButton() {
  const { toast } = useToast();

  async function handleCopy() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/` : '';
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied' });
    } catch {
      toast({ title: 'Could not copy', variant: 'destructive' });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full px-4 py-2 bg-profit text-terminal-bg rounded-md text-sm font-medium hover:bg-profit/90 transition-colors flex items-center justify-center gap-2"
    >
      <span>🔗</span>
      Copy Share Link
    </button>
  );
}
