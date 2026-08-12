import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PAYMENT_LINKS = {
  essential:
    process.env.STRIPE_PAYMENT_LINK_ESSENTIAL ||
    'https://buy.stripe.com/test_8x2aEW371gWd6nT0jm0Fi00',
  professional:
    process.env.STRIPE_PAYMENT_LINK_PROFESSIONAL ||
    'https://buy.stripe.com/test_00wfZg37135neUp2ru0Fi01',
} as const

type PaidTier = keyof typeof PAYMENT_LINKS

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function POST(req: NextRequest) {
  try {
    const { draftToken, tier, acceptTerms, immediatePerformance } = await req.json()
    if (!isUuid(draftToken) || !['essential', 'professional'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 })
    }
    if (!acceptTerms || !immediatePerformance) {
      return NextResponse.json({ error: 'Required purchase acknowledgements are missing.' }, { status: 400 })
    }

    const paidTier = tier as PaidTier
    const supabase = createServerClient()
    const { error } = await supabase.rpc('dengine_prepare_checkout', {
      p_draft_token: draftToken,
      p_tier: paidTier,
      p_accept_terms: true,
      p_immediate_performance: true,
    })

    if (error) {
      const expired = /expired|unavailable/i.test(error.message || '')
      return NextResponse.json(
        { error: expired ? 'This preview has expired. Please generate it again.' : 'Checkout could not be prepared.' },
        { status: expired ? 410 : 400 },
      )
    }

    const base = PAYMENT_LINKS[paidTier]
    const separator = base.includes('?') ? '&' : '?'
    const url = `${base}${separator}client_reference_id=${encodeURIComponent(draftToken)}`

    const response = NextResponse.json({ url })
    response.cookies.set('dengine_draft', draftToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 48,
    })
    return response
  } catch (error) {
    console.error('Checkout preparation failed', error)
    return NextResponse.json({ error: 'Checkout could not be started.' }, { status: 500 })
  }
}
