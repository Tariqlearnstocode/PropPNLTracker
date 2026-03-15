'use client';

import React from 'react';

const green = '#34d399';
const greenGlow = 'rgba(52,211,153,0.08)';
const muted = 'rgba(255,255,255,0.5)';
const text = '#f0fdf4';

export function Slide({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );
}

export function TwoCol({
  label,
  left,
  right,
}: {
  label: string;
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%', maxWidth: 1100, padding: '0 48px' }}>
      <Label>{label}</Label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'start',
          marginTop: 8,
        }}
      >
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </div>
  );
}

export function Label({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontFamily: 'monospace',
        color: 'rgba(52,211,153,0.7)',
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

export function IconRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

export function NumberRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(52,211,153,0.1)',
          border: '1px solid rgba(52,211,153,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#34d399',
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        {num}
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

export function StatCard({ number, label, sublabel }: { number: string; label: string; sublabel?: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: '28px 24px',
        textAlign: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 800, color: '#34d399', marginBottom: 8 }}>{number}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: sublabel ? 10 : 0 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{sublabel}</div>}
    </div>
  );
}

export function HookSlide() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 900, padding: '0 40px' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 999,
          border: `1px solid rgba(52,211,153,0.3)`,
          background: greenGlow,
          marginBottom: 40,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: green,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(52,211,153,0.8)', letterSpacing: 2 }}>
          PRIVATE BETA
        </span>
      </div>
      <h1
        style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.05,
          margin: '0 0 24px',
          letterSpacing: '-0.02em',
        }}
      >
        Your leaderboard
        <br />
        <span style={{ color: green }}>means nothing.</span>
      </h1>
      <p style={{ fontSize: 20, color: muted, maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.6 }}>
        Every payout claim on your platform is self-reported. Screenshots get faked. Numbers get inflated.
        Your users know it. We built the fix.
      </p>
      <p style={{ fontSize: 14, fontFamily: 'monospace', color: muted }}>
        Bank-verified prop firm P&L &mdash; ready to integrate
      </p>
    </div>
  );
}

export function ProblemSlide() {
  return (
    <TwoCol
      label="Your Problem"
      left={
        <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
          You have
          <br />
          the users.
          <br />
          <span style={{ color: green }}>Not the data.</span>
        </h2>
      }
      right={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <IconRow icon="📝" title="Self-reported everything" desc="Traders claim payouts with zero proof. Your comparison data is only as good as their honesty." />
          <IconRow icon="📸" title="Screenshots are worthless" desc="Faked in 30 seconds. You can't build a credible leaderboard or review system on screenshots." />
          <IconRow icon="💸" title="Nobody tracks real costs" desc="Resets, challenges, monthly fees — traders hide losses. Your platform shows inflated success rates." />
          <IconRow icon="🏢" title="Every competitor has the same problem" desc="SmartPropFirm, PropFirmMatch, every comparison site — all running on trust. Nobody has verified data." />
        </div>
      }
    />
  );
}

export function WhatWeBuiltSlide() {
  return (
    <TwoCol
      label="What We Built"
      left={
        <>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px' }}>
            Bank-verified
            <br />
            <span style={{ color: green }}>P&L.</span>
            <br />
            Done.
          </h2>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.7, maxWidth: 420 }}>
            A trader connects their bank. We pull real transactions. Our engine matches payouts and fees across 50+ prop firms. Instant verified report.
          </p>
        </>
      }
      right={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <IconRow icon="🏦" title="Real bank data via Teller" desc="Read-only, encrypted, same security as tax apps. Not a screenshot — actual transaction records." />
          <IconRow icon="⚡" title="Auto-detection engine" desc="Rise, Wise, Stripe, direct deposits — we recognize 50+ firm names and payment processors automatically." />
          <IconRow icon="📊" title="Full P&L dashboard" desc="Net profit, per-firm breakdown, monthly trends, fee tracking. The numbers traders actually need." />
          <IconRow icon="🔗" title="Shareable proof link" desc="One URL = bank-verified P&L. Embeddable on your platform. Replace screenshots forever." />
        </div>
      }
    />
  );
}

export function WhoThisIsForSlide() {
  return (
    <TwoCol
      label="Who This Is For"
      left={
        <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
          Platforms with
          <br />
          <span style={{ color: green }}>the audience.</span>
        </h2>
      }
      right={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <IconRow icon="📊" title="Comparison sites" desc="You rank and review prop firms. Verified P&L data makes your rankings mean something." />
          <IconRow icon="🏆" title="Leaderboard platforms" desc="Your traders claim payouts — but can they prove it? Bank verification changes the game." />
          <IconRow icon="💬" title="Communities & Discords" desc="10K+ members talking numbers. Give them a way to back it up with real bank data." />
          <IconRow icon="📈" title="Affiliate platforms" desc="You drive purchases through discount codes. Verified P&L is a premium feature that generates its own revenue." />
        </div>
      }
    />
  );
}

export function WhyThisMattersSlide() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 960, padding: '0 40px' }}>
      <Label>Why This Matters To You</Label>
      <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 56px' }}>
        One feature. <span style={{ color: green }}>Three wins.</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <StatCard number="$$$" label="New revenue" sublabel="$10–15/mo per user or $100 lifetime. Real subscription income beyond affiliate commissions." />
        <StatCard number="1st" label="Market position" sublabel="Be the only platform with bank-verified data. Every competitor runs on trust. You run on proof." />
        <StatCard number="10x" label="Retention" sublabel="A connected bank account is the stickiest feature in SaaS. Weekly return visits, not monthly." />
      </div>
    </div>
  );
}

export function AdvantageSlide() {
  return (
    <div style={{ maxWidth: 740, padding: '0 40px' }}>
      <Label>The Advantage</Label>
      <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 32px' }}>
        Why nobody else
        <br />
        <span style={{ color: green }}>has this.</span>
      </h2>
      <p style={{ fontSize: 18, color: muted, lineHeight: 1.8, marginBottom: 24 }}>
        Bank verification runs through Teller. Production access requires ~$1K/month with a 6-month commitment. That&rsquo;s the barrier.
      </p>
      <p style={{ fontSize: 18, color: muted, lineHeight: 1.8, marginBottom: 32 }}>
        For an indie dev or small startup, that cost is prohibitive. For an established platform with 10K+ users, it&rsquo;s covered by a few dozen Pro subscriptions.
      </p>
      <p style={{ fontSize: 18, color: text, lineHeight: 1.8, fontWeight: 600 }}>
        The infrastructure cost that kept everyone else out is what makes this your competitive moat.
      </p>
    </div>
  );
}

export function PartnershipSlide() {
  return (
    <TwoCol
      label="How We Work Together"
      left={
        <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
          Pick the model
          <br />
          <span style={{ color: green }}>that fits.</span>
        </h2>
      }
      right={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <NumberRow num="1" title="White-label integration" desc="Embed under your brand. Your users never leave your platform. We handle bank connections and matching on the backend." />
          <NumberRow num="2" title="License the codebase" desc="Monthly fee. Full source code on your infrastructure. Next.js, Supabase, Stripe, Teller — all production-ready." />
          <NumberRow num="3" title="Acquire outright" desc="Buy the product. Code, matching engine, 50+ firm database, Teller integration, billing system. Ship it as yours." />
        </div>
      }
    />
  );
}

export function CTASlide() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 700, padding: '0 40px' }}>
      <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px' }}>
        Your users deserve
        <br />
        <span style={{ color: green }}>real numbers.</span>
      </h2>
      <p style={{ fontSize: 18, color: muted, lineHeight: 1.7, margin: '0 auto 20px', maxWidth: 520 }}>
        I&rsquo;ll walk you through a live demo — connect a bank, see the dashboard, review the matching engine. 15 minutes.
      </p>
      <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, margin: '0 auto 48px', maxWidth: 520 }}>
        Working product. Proven tech. Ready to integrate or hand over.
      </p>
      <a
        href="mailto:tariq61698@gmail.com?subject=Prop%20PNL%20Partnership%20Inquiry"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 32px',
          background: green,
          color: '#0b1a12',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 14,
          borderRadius: 8,
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
      >
        Book a Demo →
      </a>
      <p style={{ fontSize: 13, fontFamily: 'monospace', color: muted, marginTop: 32 }}>
        tariq61698@gmail.com
      </p>
    </div>
  );
}
