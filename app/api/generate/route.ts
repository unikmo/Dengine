import { NextRequest, NextResponse } from 'next/server'
import { generateBlueprint } from '@/lib/anthropic'
import type { Event, IntakeAnswers, SmartContext } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { event, intake, smart }: { event: Event; intake: IntakeAnswers; smart?: SmartContext } =
      await req.json()

    if (!event || !intake) {
      return NextResponse.json({ error: 'Missing event or intake data' }, { status: 400 })
    }

    const tasks = await generateBlueprint(event, intake, smart)
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Blueprint generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
