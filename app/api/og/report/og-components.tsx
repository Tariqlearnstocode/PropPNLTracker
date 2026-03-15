import React from 'react';

const profitColor = '#22c55e';

export function FallbackImage() {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0d0d14',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
          display: 'flex',
        }}
      />

      {/* Branding */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 800,
            color: '#0d0d14',
          }}
        >
          P
        </div>
        <span
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
          }}
        >
          PROP PNL
        </span>
      </div>

      <div
        style={{
          fontSize: '28px',
          color: '#9ca3af',
          display: 'flex',
        }}
      >
        Prop Trading Performance Report
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          display: 'flex',
          fontSize: '18px',
          color: '#4b5563',
        }}
      >
        proppnl.com
      </div>
    </div>
  );
}

export function BrandingBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '48px',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 800,
            color: '#0d0d14',
          }}
        >
          P
        </div>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.5px',
          }}
        >
          PROP PNL
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '999px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: profitColor,
            display: 'flex',
          }}
        />
        <span
          style={{
            fontSize: '16px',
            color: '#9ca3af',
            fontWeight: 500,
          }}
        >
          Trading Report
        </span>
      </div>
    </div>
  );
}

export function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '16px 32px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          display: 'flex',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#ffffff',
          display: 'flex',
        }}
      >
        {value}
      </span>
    </div>
  );
}
