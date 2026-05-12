import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getDailyLimit, todayKey } from '@/lib/daily-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const dailyLimit = getDailyLimit()
  const dailyStatKey = todayKey()

  const [totalResult, dailyResult] = await Promise.allSettled([
    getSupabase().from('stats').select('value').eq('id', 'cvs_analyzed').maybeSingle(),
    getSupabase().from('stats').select('value').eq('id', dailyStatKey).maybeSingle(),
  ])

  const cvsAnalyzed = totalResult.status === 'fulfilled' ? (totalResult.value.data?.value ?? 0) : 0
  const dailyUsed   = dailyResult.status  === 'fulfilled' ? (dailyResult.value.data?.value  ?? 0) : 0

  return NextResponse.json({
    cvs_analyzed: cvsAnalyzed,
    daily_used:   dailyUsed,
    daily_limit:  dailyLimit,
  })
}
