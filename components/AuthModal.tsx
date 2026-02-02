'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'signin' | 'signup' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onAuthSuccess?: () => void | Promise<void>;
}

export function AuthModal({ isOpen, onClose, initialMode = 'signup', onAuthSuccess }: AuthModalProps) {
  const { supabase } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Reset mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setResetEmailSent(false);
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim() || null
          }
        }
      });

      if (signUpError) throw signUpError;

      // Create Stripe customer for the new user (async, don't wait)
      // The name will be retrieved from user metadata by the API endpoint
      if (signUpData.user) {
        // Don't await - let it run in background
        fetch('/api/stripe/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: signUpData.user.id,
            email: signUpData.user.email || email,
          }),
        }).catch((stripeError) => {
          console.error('Error creating Stripe customer:', stripeError);
          // Don't fail sign up if Stripe customer creation fails
          // Customer will be created lazily on first payment
        });
      }

      // Success - modal will close via onAuthStateChange in AuthContext
      onClose();
      // Call onAuthSuccess callback if provided
      if (onAuthSuccess) {
        await onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Success - modal will close via onAuthStateChange in AuthContext
      onClose();
      // Call onAuthSuccess callback if provided
      if (onAuthSuccess) {
        await onAuthSuccess();
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;

      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setResetEmailSent(false);
    setMode(initialMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-terminal-card rounded-2xl max-w-md w-full mx-4 overflow-hidden border border-terminal-border">
        <div className="p-6 border-b border-terminal-border flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-terminal-text">
              {mode === 'signup' ? 'Create your account' : mode === 'signin' ? 'Welcome back' : 'Reset password'}
            </h2>
            <p className="text-sm text-terminal-muted mt-1">
              {mode === 'signup'
                ? 'Get started tracking your prop firm PNL'
                : mode === 'signin'
                ? 'Sign in to continue'
                : 'Enter your email to receive a password reset link'}
            </p>
          </div>
          <button onClick={handleClose} className="text-terminal-muted hover:text-terminal-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={
            mode === 'signup' ? handleSignUp :
            mode === 'signin' ? handleSignIn :
            handlePasswordReset
          }
          className="p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-loss-dim border border-loss/30 rounded-lg text-sm text-loss">
              {error}
            </div>
          )}

          {resetEmailSent && (
            <div className="p-3 bg-profit-dim border border-profit/30 rounded-lg text-sm text-profit">
              Password reset email sent! Check your inbox and click the link to reset your password.
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-terminal-text mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text focus:outline-none focus:ring-2 focus:ring-profit/30 focus:border-transparent"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-terminal-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text focus:outline-none focus:ring-2 focus:ring-profit/30 focus:border-transparent"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-terminal-text mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text focus:outline-none focus:ring-2 focus:ring-profit/30 focus:border-transparent"
                placeholder={mode === 'signup' ? 'Create a password' : 'Your password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || resetEmailSent}
            className="w-full py-3 px-4 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-terminal-bg font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'signup' ? 'Create Account' : mode === 'signin' ? 'Sign In' : 'Send Reset Link'}
          </button>
        </form>

        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-terminal-muted">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(''); }}
                  className="text-profit hover:text-profit/80 font-medium"
                >
                  Sign in
                </button>
              </>
            ) : mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-profit hover:text-profit/80 font-medium"
                >
                  Create one
                </button>
                {' · '}
                <button
                  onClick={() => { setMode('reset'); setError(''); }}
                  className="text-profit hover:text-profit/80 font-medium"
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <>
                Remember your password?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(''); setResetEmailSent(false); }}
                  className="text-profit hover:text-profit/80 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
