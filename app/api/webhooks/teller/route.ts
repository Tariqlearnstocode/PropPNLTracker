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

interface TellerWebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  payload: any;
}

/**
 * Verify Teller webhook signature
 * Teller signs webhooks using HMAC SHA-256
 * See: https://teller.io/docs/api/webhooks
 */
function verifyTellerSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Teller sends signature in Teller-Signature header
    // Based on Teller docs: format is typically "signature=...,timestamp=..."
    // Parse the signature header
    const parts = signature.split(',');
    let signatureValue = '';
    let timestamp = '';

    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.startsWith('signature=')) {
        signatureValue = trimmed.substring('signature='.length);
      } else if (trimmed.startsWith('timestamp=')) {
        timestamp = trimmed.substring('timestamp='.length);
      } else if (trimmed.startsWith('t=')) {
        // Alternative format
        timestamp = trimmed.substring('t='.length);
      }
    });

    // If format is different, try to extract from event body
    if (!timestamp) {
      try {
        const event = JSON.parse(body);
        timestamp = event.timestamp || event.ts;
      } catch {
        // If we can't parse, log and continue (timestamp check will fail)
        console.warn('Could not extract timestamp from signature or body');
      }
    }

    if (!signatureValue) {
      console.error('Invalid signature format: could not extract signature value');
      return false;
    }

    // Check timestamp (reject if older than 3 minutes to prevent replay attacks)
    const timestampMs = parseInt(timestamp, 10);
    const now = Date.now();
    const threeMinutes = 3 * 60 * 1000;

    if (now - timestampMs > threeMinutes) {
      console.error('Webhook timestamp too old, possible replay attack');
      return false;
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    // Compare signatures (constant-time comparison)
    return crypto.timingSafeEqual(
      Buffer.from(signatureValue),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Handle transactions.processed webhook
 * Triggers auto-refresh for subscription users
 */
async function handleTransactionsProcessed(payload: any) {
  // Payload structure may vary, but typically contains account_id and transactions array
  // The transactions array contains the actual transaction data
  const account_id = payload.account_id || payload.account?.id;
  const transactions = payload.transactions || [];

  if (!account_id) {
    console.error('transactions.processed webhook missing account_id');
    return;
  }

  console.log(`transactions.processed: ${transactions?.length || 0} new transactions for account ${account_id}`);

  // Find the user and report for this account
  const { data: report } = await supabaseAdmin
    .from('pnl_reports')
    .select('user_id, account_id, id')
    .eq('account_id', account_id)
    .single();

  if (!report) {
    console.log(`No report found for account ${account_id}, skipping auto-refresh`);
    return;
  }

  // Check if user has active subscription
  const subscription = await getActiveSubscription(report.user_id);
  if (!subscription) {
    console.log(`User ${report.user_id} does not have active subscription, skipping auto-refresh`);
    return;
  }

  console.log(`User ${report.user_id} has subscription, queuing auto-refresh for account ${account_id}`);

  // Check if account has stored encrypted token for refresh
  const { data: connectedAccount } = await supabaseAdmin
    .from('connected_accounts')
    .select('encrypted_access_token, can_refresh_daily, account_id')
    .eq('user_id', report.user_id)
    .eq('account_id', account_id)
    .single();

  // If account has encrypted token and can refresh daily, mark as needing refresh
  // User can manually trigger refresh via refresh button
  if (connectedAccount?.encrypted_access_token && connectedAccount.can_refresh_daily) {
    console.log(`Account ${account_id} has stored token, marking for refresh`);
  } else {
    console.log(`Account ${account_id} does not have stored token or cannot refresh daily`);
  }
  
  // Update connected_accounts to mark that new data is available
  const { error: updateError } = await supabaseAdmin
    .from('connected_accounts')
    .update({
      needs_refresh: true,
      last_webhook_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', report.user_id)
    .eq('account_id', account_id);

  if (updateError) {
    console.error('Error updating connected_accounts:', updateError);
  } else {
    console.log(`Marked account ${account_id} as needing refresh`);
  }

  // Store webhook event for audit/debugging
  try {
    await supabaseAdmin
      .from('teller_webhook_events')
      .insert({
        event_type: 'transactions.processed',
        event_id: payload.event_id || null,
        account_id,
        user_id: report.user_id,
        payload: payload,
        processed: false, // Will be true once we implement full auto-refresh
        created_at: new Date().toISOString(),
      } as any);
  } catch (err: any) {
    // Table might not exist yet, log but don't fail
    console.log('Could not store webhook event (table may not exist):', err?.message);
  }
}

/**
 * Handle enrollment.disconnected webhook
 * Marks enrollment as disconnected and notifies user if needed
 */
async function handleEnrollmentDisconnected(payload: any) {
  const { enrollment_id, reason } = payload;

  console.log(`enrollment.disconnected: enrollment ${enrollment_id}, reason: ${reason}`);

  // Find connected accounts with this enrollment_id
  // Note: We may need to store enrollment_id in connected_accounts table
  const { data: accounts, error } = await supabaseAdmin
    .from('connected_accounts')
    .select('user_id, account_id')
    .eq('enrollment_id', enrollment_id);

  if (error || !accounts || accounts.length === 0) {
    console.log(`No connected accounts found for enrollment ${enrollment_id}`);
    return;
  }

  // Mark all accounts for this enrollment as disconnected
  for (const account of accounts) {
    const { error: updateError } = await supabaseAdmin
      .from('connected_accounts')
      .update({
        enrollment_status: 'disconnected',
        enrollment_disconnected_at: new Date().toISOString(),
        enrollment_disconnect_reason: reason,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('user_id', account.user_id)
      .eq('account_id', account.account_id);

    if (updateError) {
      console.error(`Error updating account ${account.account_id}:`, updateError);
    } else {
      console.log(`Marked account ${account.account_id} as disconnected`);
    }
  }

  // Store webhook event
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
      } as any);
  } catch (err: any) {
    console.log('Could not store webhook event:', err?.message);
  }
}

/**
 * Handle account.number_verification.processed webhook
 */
async function handleAccountVerificationProcessed(payload: any) {
  const { account_id, status } = payload;

  console.log(`account.number_verification.processed: account ${account_id}, status: ${status}`);

  // Update account verification status if needed
  // Store webhook event for now
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
      } as any);
  } catch (err: any) {
    console.log('Could not store webhook event:', err?.message);
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
      console.error('TELLER_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify signature
    if (!verifyTellerSignature(body, signature, webhookSecret)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    let event: TellerWebhookEvent;
    try {
      event = JSON.parse(body);
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    console.log(`Received Teller webhook: ${event.type} (id: ${event.id})`);

    // Handle different event types
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
        console.log('Received test webhook from Teller');
        // Store test webhook for verification
        try {
          await supabaseAdmin
            .from('teller_webhook_events')
            .insert({
              event_type: 'webhook.test',
              event_id: event.id,
              payload: event.payload,
              processed: true,
              created_at: new Date().toISOString(),
            } as any);
        } catch (err: any) {
          console.log('Could not store test webhook event:', err?.message);
        }
        break;

      default:
        console.log(`Unhandled webhook type: ${event.type}`);
        // Store unhandled events for review
        try {
          await supabaseAdmin
            .from('teller_webhook_events')
            .insert({
              event_type: event.type,
              event_id: event.id,
              payload: event.payload,
              processed: false,
              created_at: new Date().toISOString(),
            } as any);
        } catch (err: any) {
          console.log('Could not store unhandled webhook event:', err?.message);
        }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Teller webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error?.message },
      { status: 500 }
    );
  }
}
