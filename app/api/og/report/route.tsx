import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import type { PNLReport } from '@/lib/pnl-calculations';

export const runtime = 'nodejs';

/**
 * Format a dollar amount for display on the OG image.
 * Shows sign prefix, dollar sign, and comma-separated value.
 */
function formatDollar(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}$${formatted}`;
}

/**
 * Format ROI percentage for display.
 */
function formatROI(totalFees: number, netPNL: number): string {
  if (totalFees === 0) return 'N/A';
  const roi = (netPNL / totalFees) * 100;
  const sign = roi >= 0 ? '+' : '';
  return `${sign}${roi.toFixed(0)}%`;
}

/**
 * Generate a fallback OG image when report data is unavailable.
 */
function generateFallbackImage(): ImageResponse {
  return new ImageResponse(
    (
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
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return generateFallbackImage();
    }

    // Look up the report by token using admin client (bypasses RLS since OG crawlers are unauthenticated)
    const { data: report, error } = await supabaseAdmin
      .from('pnl_reports')
      .select('raw_teller_data, pnl_data, manual_assignments, status')
      .eq('report_token', token)
      .single();

    if (error || !report) {
      return generateFallbackImage();
    }

    if (report.status !== 'completed') {
      return generateFallbackImage();
    }

    // Calculate PNL data from raw data (same approach as page.tsx)
    let pnlData: PNLReport | null = null;
    const manualAssignments = report.manual_assignments || {};

    if (report.raw_teller_data) {
      pnlData = calculatePNLReport(report.raw_teller_data, manualAssignments);
    } else if (report.pnl_data) {
      pnlData = report.pnl_data as PNLReport;
    }

    if (!pnlData) {
      return generateFallbackImage();
    }

    const { summary, perFirmBreakdown } = pnlData;
    const netPNL = summary.netPNL;
    const isPositive = netPNL >= 0;
    const firmCount = perFirmBreakdown.length;
    const totalPayouts = summary.totalDeposits;
    const roi = formatROI(summary.totalFees, summary.netPNL);

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
              {/* ROI */}
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
                  ROI
                </span>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                  }}
                >
                  {roi}
                </span>
              </div>

              {/* Firms */}
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
                  Firms
                </span>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                  }}
                >
                  {firmCount}
                </span>
              </div>

              {/* Total Payouts */}
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
                  Total Payouts
                </span>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                  }}
                >
                  ${totalPayouts.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
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
  } catch (error) {
    console.error('OG image generation error:', error);
    return generateFallbackImage();
  }
}
