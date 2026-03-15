import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Prop PNL — Prop Firm PNL Tracker';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(rgba(0,230,118,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00e676, #69f0ae, #00e676)',
            display: 'flex',
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#00e676',
            marginBottom: '32px',
            display: 'flex',
            boxShadow: '0 0 60px rgba(0,230,118,0.3)',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: '#e4e4ed',
            letterSpacing: '-2px',
            display: 'flex',
          }}
        >
          Prop PNL
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#6b6b80',
            marginTop: '16px',
            display: 'flex',
          }}
        >
          Bank-verified prop firm P&L tracking
        </div>

        {/* Pill badges */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['Topstep', 'FTMO', 'The5ers', 'Rise'].map((name) => (
            <div
              key={name}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: '1px solid rgba(0,230,118,0.25)',
                color: '#00e676',
                fontSize: '18px',
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
