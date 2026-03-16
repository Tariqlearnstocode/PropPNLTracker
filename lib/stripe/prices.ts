/**
 * Get price IDs from environment variables
 */
export function getPriceIds() {
  return {
    snapshot: process.env.STRIPE_PRICE_SNAPSHOT,
    lifetime: process.env.STRIPE_PRICE_LIFETIME,
  };
}

/**
 * Validate that all required price IDs are set
 */
export function validatePriceIds() {
  const prices = getPriceIds();
  const missing: string[] = [];

  if (!prices.snapshot) missing.push('STRIPE_PRICE_SNAPSHOT');
  if (!prices.lifetime) missing.push('STRIPE_PRICE_LIFETIME');

  if (missing.length > 0) {
    throw new Error(
      `Missing required Stripe price IDs: ${missing.join(', ')}`
    );
  }

  return prices;
}
