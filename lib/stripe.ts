import Stripe from 'stripe'

let stripe: Stripe | null = null

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured.')
    stripe = new Stripe(key)
  }
  return stripe
}

// Sandbox defaults make the connected Planethike test account immediately testable.
// Live Vercel values override these IDs when DEngine is switched to live charging.
export const PRICE_BY_TIER = {
  essential: process.env.STRIPE_PRICE_ESSENTIAL || 'price_1U3QcvCIFQh1oigONw3dqVhz',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_1U3Qd2CIFQh1oigOaTWodNWL',
} as const

export type PaidTier = keyof typeof PRICE_BY_TIER
