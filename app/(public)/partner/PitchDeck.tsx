'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Slide,
  HookSlide,
  ProblemSlide,
  WhatWeBuiltSlide,
  WhoThisIsForSlide,
  WhyThisMattersSlide,
  AdvantageSlide,
  PartnershipSlide,
  CTASlide,
} from './slides/SlideComponents';

const TOTAL_SLIDES = 8;

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating) return;
      const clamped = Math.max(0, Math.min(idx, TOTAL_SLIDES - 1));
      if (clamped === current) return;
      setIsAnimating(true);
      setCurrent(clamped);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [current, isAnimating],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  /* ─── shared color tokens (green gradient theme) ─── */
  const green = '#34d399';
  const muted = 'rgba(255,255,255,0.5)';
  const text = '#f0fdf4';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(135deg, #0b1a12 0%, #0a2618 30%, #0d3320 60%, #0b1a12 100%)`,
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: text,
      }}
    >
      {/* Green aurora gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 90% 60% at 20% 10%, rgba(52,211,153,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 85% 85%, rgba(16,185,129,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(52,211,153,0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Slide container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Slide visible={current === 0}><HookSlide /></Slide>
        <Slide visible={current === 1}><ProblemSlide /></Slide>
        <Slide visible={current === 2}><WhatWeBuiltSlide /></Slide>
        <Slide visible={current === 3}><WhoThisIsForSlide /></Slide>
        <Slide visible={current === 4}><WhyThisMattersSlide /></Slide>
        <Slide visible={current === 5}><AdvantageSlide /></Slide>
        <Slide visible={current === 6}><PartnershipSlide /></Slide>
        <Slide visible={current === 7}><CTASlide /></Slide>
      </div>

      {/* Green divider line at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 56,
          left: '10%',
          right: '10%',
          height: 1,
          background: `linear-gradient(to right, transparent, ${green}30, transparent)`,
        }}
      />

      {/* Navigation controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <button onClick={prev} style={navBtn} aria-label="Previous slide">
          ‹
        </button>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: muted, minWidth: 48, textAlign: 'center' }}>
          {current + 1} / {TOTAL_SLIDES}
        </span>
        <button onClick={next} style={navBtn} aria-label="Next slide">
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: 44,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? green : 'rgba(255,255,255,0.15)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Keyframe for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.5)',
  fontSize: 18,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  lineHeight: 1,
};
