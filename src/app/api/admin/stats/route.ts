import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const ACTIONS = [
  'cvs_analyzed',
  'action:match',
  'action:editor_parse',
  'action:editor_improve',
  'action:editor_translate',
  'action:anonymize',
]

export async function GET() {
  const results: Record<string, number> = {}

  await Promise.all(
    ACTIONS.map(async (id) => {
      try {
        const { data } = await getSupabase()
          .from('stats')
          .select('value')
          .eq('id', id)
          .single()
        results[id] = data?.value ?? 0
      } catch {
        results[id] = 0
      }
    })
  )

  return NextResponse.json({
    cvs_analyzed:     results['cvs_analyzed']           ?? 0,
    match:            results['action:match']            ?? 0,
    editor_parse:     results['action:editor_parse']     ?? 0,
    editor_improve:   results['action:editor_improve']   ?? 0,
    editor_translate: results['action:editor_translate'] ?? 0,
    anonymize:        results['action:anonymize']        ?? 0,
  })
}
