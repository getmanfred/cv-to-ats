import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await getSupabase()
    .from('stats')
    .select('value')
    .eq('id', 'cvs_analyzed')
    .maybeSingle()

  return NextResponse.json({
    cvs_analyzed: result.data?.value ?? 0,
  })
}
