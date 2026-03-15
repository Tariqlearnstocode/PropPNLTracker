import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { getActiveSubscription } from '@/lib/stripe/helpers';
import crypto from 'crypto';

/**
 * Teller Webhook Handler
 *
 * Handles webhooks from Teller API for:
 * - transactions.processed: New transactions available (triggers auto-refresh for subscriptions)
 * - enrollment.disconnected: User's bank connection broken
 * - account.number_verification.processed: Account verification status
 * - webhook.test: Test webhook
 *
 * Documentation: https://teller.io/docs/api/webhooks
 *
 * Setup:
 * 1. Configure webhook URL in Teller dashboard: https://dashboard.teller.io
 * 2. Set TELLER_WEBHOOK_SECRET environment variable (get from Teller dashboard)
 * 3. Webhook endpoint: https://yourdomain.com/api/webhooks/teller
 *
 * Security:
 * - Verifies HMAC SHA-256 signature using TELLER_WEBHOOK_SECRET
 * - Rejects webhooks older than 3 minutes to prevent replay attacks
 */

interface TellerWebhookPayload {
  account_id?: string;
  account?: { id: string };
  transactions?: unknown[];
  event_id?: string;
  enrollment_id?: string;
  reason?: string;
  status?: string;
  [key: string]: unknown;
}

interface TellerWebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  payload: TellerWebhookPayload;
}

/**
 * Verify Teller webhook signature
 * Teller signs webhooks using HMAC SHA-256
 * See: https://teller.io/docs/api/webhooks
 */
function verifyTellerSignature(
  body: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    // Format: "t=timestamp,v1=signature1,v1=signature2,..."
    const parts = signatureHeader.split(',');
    let timestamp = '';
    const signatures: string[] = [];

    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.startsWith('t=')) {
        timestamp = trimmed.substring('t='.length);
      } else if (trimmed.startsWith('v1=')) {
        signatures.push(trimmed.substring('v1='.length));
      }
    });

    if (!timestamp || signatures.length === 0) {
      return false;
    }

    // Timestamp is Unix seconds - reject if older than 3 minutes
    const timestampSec = parseInt(timestamp, 10);
    const nowSec = Math.floor(Date.now() / 1000);
    const threeMinutesSec = 3 * 60;

    if (nowSec - timestampSec > threeMinutesSec) {
      return false;
    }

    // Compute expected signature: HMAC-SHA256(secret, "timestamp.body")
    const signedPayload = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    // Check if any of the provided signatures match (supports secret rotation)
    return signatures.some((sig) => {
      try {
        return crypto.timingSafeEqual(
          Buffer.from(sig),
          Buffer.from(expectedSignature)
        );
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

/**
 * Handle transactions.processed webhook
 * Triggers auto-refresh for subscription users
 */
async function handleTransactionsProcessed(payload: TellerWebhookPayload) {
  const account_id = payload.account_id || payload.account?.id;

  if (!account_id) {
    return;
  }

  const { data: connectedAccount } = await supabaseAdmin
    .from('connected_accounts')
    .select('user_id, encrypted_access_token, can_refresh_daily')
    .eq('account_id', account_id)
    .single();

  if (!connectedAccount) {
    return;
  }

  const userId = connectedAccount.user_id;
  const subscription = await getActiveSubscription(userId);
  if (!subscription) {
    return;
  }

  await supabaseAdmin
    .from('connected_accounts')
    .update({
      needs_refresh: true,
      last_webhook_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('account_id', account_id);

  try {
    await supabaseAdmin
      .from('teller_webhook_events')
      .insert({
        event_type: 'transactions.processed',
        event_id: payload.event_id || null,
        account_id,
        user_id: userId,
        payload: payload,
        processed: false,
        created_at: new Date().toISOString(),
      } as unknown as Record<string, unknown>);
  } catch {
    // Table might not exist yet
  }
}

/**
 * Handle enrollment.disconnected webhook
 * Marks enrollment as disconnected and notifies user if needed
 */
async function handleEnrollmentDisconnected(payload: TellerWebhookPayload) {
  const { enrollment_id, reason } = payload;

  const { data: accounts, error } = await supabaseAdmin
    .from('connected_accounts')
    .select('user_id, account_id')
    .eq('enrollment_id', enrollment_id);

  if (error || !accounts || accounts.length === 0) {
    return;
  }

  for (const account of accounts) {
    await supabaseAdmin
      .from('connected_accounts')
      .update({
        enrollment_status: 'disconnected',
        enrollment_disconnected_at: new Date().toISOString(),
        enrollment_disconnect_reason: reason,
        updated_at: new Date().toISOString(),
      } as unknown as Record<string, unknown>)
      .eq('user_id', account.user_id)
      .eq('account_id', account.account_id);
  }

  try {
    await supabaseAdmin
      .from('teller_webhook_events')
      .insert({
        event_type: 'enrollment.disconnected',
        event_id: payload.event_id || null,
        enrollment_id,
        payload: payload,
        processed: true,
        created_at: new Date().toISOString(),
      } as unknown as Record<string, unknown>);
  } catch {
  }
}

/**
 * Handle account.number_verification.processed webhook
 */
async function handleAccountVerificationProcessed(payload: TellerWebhookPayload) {
  const { account_id } = payload;

  try {
    await supabaseAdmin
      .from('teller_webhook_events')
      .insert({
        event_type: 'account.number_verification.processed',
        event_id: payload.event_id || null,
        account_id,
        payload: payload,
        processed: true,
        created_at: new Date().toISOString(),
      } as unknown as Record<string, unknown>);
  } catch {
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('Teller-Signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No Teller-Signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.TELLER_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!verifyTellerSignature(body, signature, webhookSecret)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    let event: TellerWebhookEvent;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'transactions.processed':
        await handleTransactionsProcessed(event.payload);
        break;

      case 'enrollment.disconnected':
        await handleEnrollmentDisconnected(event.payload);
        break;

      case 'account.number_verification.processed':
        await handleAccountVerificationProcessed(event.payload);
        break;

      case 'webhook.test':
        try {
          await supabaseAdmin
            .from('teller_webhook_events')
            .insert({
              event_type: 'webhook.test',
              event_id: event.id,
              payload: event.payload,
              processed: true,
              created_at: new Date().toISOString(),
            } as unknown as Record<string, unknown>);
        } catch {
        }
        break;

      default:
        try {
          await supabaseAdmin
            .from('teller_webhook_events')
            .insert({
              event_type: event.type,
              event_id: event.id,
              payload: event.payload,
              processed: false,
              created_at: new Date().toISOString(),
            } as unknown as Record<string, unknown>);
        } catch {
        }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
