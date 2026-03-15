import { stripe as _stripe } from './client';

const stripe = _stripe!;

/**
 * Create or get the verifications meter
 * This should be run once to set up the meter in Stripe
 */
export async function createVerificationsMeter() {
  try {
    // Check if meter already exists
    const meters = await stripe.billing.meters.list({
      limit: 100,
    });

    const existingMeter = meters.data.find(
      (m) => m.event_name === 'verification.created'
    );

    if (existingMeter) {
      return existingMeter;
    }

    // Create new meter
    const meter = await stripe.billing.meters.create({
      event_name: 'verification.created',
      display_name: 'Income Verifications',
      default_aggregation: {
        formula: 'sum',
      },
      value_settings: {
        event_payload_key: 'value',
      },
    });

    return meter;
  } catch (error) {
    throw error;
  }
}

/**
 * Get meter ID from environment or create it
 */
export async function getMeterId(): Promise<string> {
  if (process.env.STRIPE_METER_ID) {
    return process.env.STRIPE_METER_ID;
  }

  // If not set, try to find existing meter
  const meters = await stripe.billing.meters.list({
    limit: 100,
  });

  const meter = meters.data.find(
    (m) => m.event_name === 'verification.created'
  );

  if (meter) {
    return meter.id;
  }

  throw new Error(
    'STRIPE_METER_ID not set and no existing meter found. Run createVerificationsMeter() first.'
  );
}
