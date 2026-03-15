'use client';

import { useState, useEffect } from 'react';
import { AuthModal } from '@/components/AuthModal';

// Wrapper component that listens for openAuthModal events globally
// This ensures the modal works from anywhere in the app, including the navbar
export function AuthModalWrapper() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent<{ mode: 'signin' | 'signup' }>) => {
      setAuthMode(event.detail.mode);
      setShowAuthModal(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    };
  }, []);

  const handleAuthSuccess = async () => {
    // Check if there's a pending checkout from pricing
    const pendingPlan = sessionStorage.getItem('pendingCheckout');
    if (pendingPlan && ['one_time', 'monthly', 'lifetime'].includes(pendingPlan)) {
      sessionStorage.removeItem('pendingCheckout');
      try {
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: pendingPlan }),
        });
        const data = await response.json();
        if (response.ok && data.url) {
          window.location.href = data.url;
          return;
        }
      } catch {
        // Fall through to reload if checkout fails
      }
    }
    window.location.reload();
  };

  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      initialMode={authMode}
      onAuthSuccess={handleAuthSuccess}
    />
  );
}
