import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchReportData, formatDollar } from './og-utils';
import { FallbackImage, BrandingBar, StatBox } from './og-components';

export const runtime = 'nodejs';

function generateFallbackImage(): ImageResponse {
  return new ImageResponse(<FallbackImage />, { width: 1200, height: 630 });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return generateFallbackImage();
    }

    const data = await fetchReportData(token);
    if (!data) {
      return generateFallbackImage();
    }

    const { netPNL, isPositive, firmCount, totalPayouts, roi } = data;

    // Colors
    const profitColor = '#22c55e';
    const lossColor = '#ef4444';
    const pnlColor = isPositive ? profitColor : lossColor;
    const pnlGlow = isPositive
      ? 'rgba(34, 197, 94, 0.15)'
      : 'rgba(239, 68, 68, 0.15)';

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0d0d14',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '48px 64px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background gradient accent based on P&L direction */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at 50% 30%, ${pnlGlow} 0%, transparent 60%)`,
              display: 'flex',
            }}
          />

          {/* Subtle grid lines for texture */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              display: 'flex',
            }}
          />

          {/* Top bar: branding */}
          <BrandingBar />

          {/* Main P&L display */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                marginBottom: '12px',
                display: 'flex',
              }}
            >
              Net P&L
            </div>

            <div
              style={{
                fontSize: '96px',
                fontWeight: 800,
                color: pnlColor,
                letterSpacing: '-3px',
                lineHeight: 1,
                marginBottom: '40px',
                display: 'flex',
                textShadow: `0 0 80px ${pnlGlow}`,
              }}
            >
              {formatDollar(netPNL)}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '48px',
              }}
            >
              <StatBox label="ROI" value={roi} />
              <StatBox label="Firms" value={String(firmCount)} />
              <StatBox
                label="Total Payouts"
                value={`$${totalPayouts.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: '#4b5563',
                fontWeight: 500,
              }}
            >
              proppnl.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return generateFallbackImage();
  }
}
