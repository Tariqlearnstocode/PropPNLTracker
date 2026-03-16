'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toasts/use-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Something went wrong.',
          variant: 'destructive',
        });
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-terminal-card rounded-xl border border-terminal-border p-8 md:p-12">
          <h1 className="text-3xl font-bold text-terminal-text mb-2">Contact Us</h1>
          <p className="text-terminal-muted mb-8">
            Have a question, feedback, or issue? Send us a message and we&apos;ll get back to you.
          </p>

          <hr className="border-terminal-border mb-8" />

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-profit-dim rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-profit text-2xl">&#10003;</span>
              </div>
              <h2 className="text-xl font-semibold text-terminal-text mb-2">Message Sent</h2>
              <p className="text-terminal-muted mb-6">
                Thanks for reaching out. We&apos;ll get back to you as soon as we can.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-profit hover:underline text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-terminal-text mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={255}
                  className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-profit transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-terminal-text mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-profit transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-terminal-text mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-profit transition-colors resize-vertical"
                  placeholder="How can we help?"
                />
                <p className="text-terminal-muted text-xs mt-1 text-right">
                  {message.length}/2000
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-profit text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
