import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase-server'
import { getStripe, PRICE_BY_TIER, type PaidTier } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { draftToken, tier, acceptTerms, immediatePerformance } = await req.json()
    if (!draftToken || !['essential','professional'].includes(tier)) return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 })
    if (!acceptTerms || !immediatePerformance) return NextResponse.json({ error: 'Required purchase acknowledgements are missing.' }, { status: 400 })

    const paidTier = tier as PaidTier
    const price = PRICE_BY_TIER[paidTier]
    if (!price) return NextResponse.json({ error: 'Stripe price is not configured.' }, { status: 500 })

    const supabase = getServerSupabase()
    const { data: draft } = await supabase.from('dengine_plan_drafts').select('draft_token,event_summary,expires_at').eq('draft_token', draftToken).gt('expires_at', new Date().toISOString()).single()
    if (!draft) return NextResponse.json({ error: 'This preview has expired. Please generate it again.' }, { status: 410 })

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/custom?checkout=cancelled`,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      automatic_tax: { enabled: true },
      invoice_creation: { enabled: true },
      metadata: { draft_token: draftToken, tier: paidTier, app: 'dengine', immediate_performance: 'true', terms_accepted: 'true' },
    })

    await supabase.from('dengine_orders').insert({
      draft_token: draftToken,
      tier: paidTier,
      amount_cents: paidTier === 'essential' ? 1900 : 3900,
      stripe_checkout_session_id: session.id,
      status: 'checkout_created',
      accepted_terms_at: new Date().toISOString(),
      immediate_performance_consent_at: new Date().toISOString(),
    })
    await supabase.from('dengine_conversion_events').insert({ event_name: 'checkout_started', draft_token: draftToken, metadata: { tier: paidTier } })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout creation failed', error)
    return NextResponse.json({ error: 'Checkout could not be started.' }, { status: 500 })
  }
}
