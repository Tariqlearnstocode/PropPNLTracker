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

  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      initialMode={authMode}
      onAuthSuccess={async () => {
        window.location.reload();
      }}
    />
  );
}
