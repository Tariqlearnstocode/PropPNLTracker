/**
 * Get price IDs from environment variables
 */
export function getPriceIds() {
  return {
    oneTime: process.env.STRIPE_PRICE_ONE_TIME,
    monthly: process.env.STRIPE_PRICE_MONTHLY,
    lifetime: process.env.STRIPE_PRICE_LIFETIME,
  };
}

/**
 * Validate that all required price IDs are set
 */
export function validatePriceIds() {
  const prices = getPriceIds();
  const missing: string[] = [];

  if (!prices.oneTime) missing.push('STRIPE_PRICE_ONE_TIME');
  if (!prices.monthly) missing.push('STRIPE_PRICE_MONTHLY');
  if (!prices.lifetime) missing.push('STRIPE_PRICE_LIFETIME');

  if (missing.length > 0) {
    throw new Error(
      `Missing required Stripe price IDs: ${missing.join(', ')}`
    );
  }

  return prices;
}
