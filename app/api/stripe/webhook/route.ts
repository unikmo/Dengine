import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getServerSupabase } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return new NextResponse('Webhook not configured', { status: 500 })

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = getStripe().webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    console.error('Stripe webhook signature failed', error)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const supabase = getServerSupabase()
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded') {
      await supabase.from('dengine_orders').update({
        status: 'paid',
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        customer_email: session.customer_details?.email || session.customer_email || null,
        verified_at: new Date().toISOString(),
      }).eq('stripe_checkout_session_id', session.id)
      if (session.metadata?.draft_token) {
        await supabase.from('dengine_conversion_events').insert({ event_name: 'purchase_completed', draft_token: session.metadata.draft_token, metadata: { tier: session.metadata.tier, session: session.id } })
      }
    }
  }
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    await supabase.from('dengine_orders').update({ status: 'expired' }).eq('stripe_checkout_session_id', session.id)
  }
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    if (typeof charge.payment_intent === 'string') {
      await supabase.from('dengine_orders').update({ status: 'refunded' }).eq('stripe_payment_intent_id', charge.payment_intent)
    }
  }
  return NextResponse.json({ received: true })
}
