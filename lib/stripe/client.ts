import Stripe from 'stripe';

// Make Stripe optional - only initialize if key is provided
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

export function isStripeConfigured(): boolean {
  return stripe !== null && !!process.env.STRIPE_SECRET_KEY;
}
