import { stripe as _stripe } from './client';
import Stripe from 'stripe';

const stripe = _stripe!;

/**
 * Create products and prices in Stripe
 * This should be run once to set up pricing
 */
export async function setupProductsAndPrices() {
  try {
    // Create or get product
    const productSearch = await stripe.products.search({
      query: 'name:"Income Verification"',
    });

    let productId: string;
    if (productSearch.data.length === 0) {
      const newProduct = await stripe.products.create({
        name: 'Income Verification',
        description: 'Bank-verified income verification service',
      });
      productId = newProduct.id;
    } else {
      productId = productSearch.data[0].id;
    }

    // Create prices
    const prices: {
      oneTime: Stripe.Price | null;
      monthly: Stripe.Price | null;
      lifetime: Stripe.Price | null;
    } = {
      oneTime: null,
      monthly: null,
      lifetime: null,
    };

    // One-Time ($39.99, one-time payment)
    const oneTimePrice = await stripe.prices.create({
      product: productId,
      unit_amount: 3999, // $39.99
      currency: 'usd',
      metadata: {
        type: 'one_time',
      },
    });
    prices.oneTime = oneTimePrice;

    // Monthly ($14.95/mo, recurring)
    const monthlyPrice = await stripe.prices.create({
      product: productId,
      unit_amount: 1495, // $14.95
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        type: 'monthly',
      },
    });
    prices.monthly = monthlyPrice;

    // Lifetime ($199.00, one-time payment)
    const lifetimePrice = await stripe.prices.create({
      product: productId,
      unit_amount: 19900, // $199.00
      currency: 'usd',
      metadata: {
        type: 'lifetime',
      },
    });
    prices.lifetime = lifetimePrice;

    return {
      productId,
      prices,
    };
  } catch (error) {
    throw error;
  }
}

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
