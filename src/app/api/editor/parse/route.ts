import { NextRequest, NextResponse } from 'next/server'
import { parseCVToEditor, improveCVWithSuggestions, translateCVContent } from '@/lib/editor-ai'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { getSupabase } from '@/lib/supabase'
import type { CVData } from '@/types/cv'
import type { Suggestion } from '@/types/analysis'
import type { CvLang } from '@/lib/cv-labels'

export const runtime = 'nodejs'
export const maxDuration = 180

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(`editor:${ip}`, 5)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Por favor, espera un momento antes de volver a intentarlo.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const body = await req.json()
    const { mode, cvText, cvData, suggestions, targetLang } = body as {
      mode: 'parse' | 'improve' | 'translate'
      cvText?: string
      cvData?: CVData
      suggestions?: Suggestion[]
      targetLang?: CvLang
    }

    if (mode === 'parse') {
      if (!cvText || cvText.trim().length < 50) {
        return NextResponse.json({ error: 'No hay texto de CV suficiente para parsear.' }, { status: 400 })
      }
      const result = await parseCVToEditor(cvText.slice(0, 60_000))
      void (async () => { try { await getSupabase().rpc('increment_stat', { stat_id: 'action:editor_parse' }) } catch {} })()
      return NextResponse.json(result)
    }

    if (mode === 'improve') {
      if (!cvData || !suggestions?.length) {
        return NextResponse.json({ error: 'Faltan datos del CV o las recomendaciones.' }, { status: 400 })
      }
      const result = await improveCVWithSuggestions(cvData, suggestions)
      void (async () => { try { await getSupabase().rpc('increment_stat', { stat_id: 'action:editor_improve' }) } catch {} })()
      return NextResponse.json(result)
    }

    if (mode === 'translate') {
      if (!cvData || !targetLang) {
        return NextResponse.json({ error: 'Faltan datos para la traducción.' }, { status: 400 })
      }
      const result = await translateCVContent(cvData, targetLang)
      void (async () => { try { await getSupabase().rpc('increment_stat', { stat_id: 'action:editor_translate' }) } catch {} })()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Modo desconocido.' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('context') || msg.includes('token') || msg.includes('too long') || msg.includes('maximum') || msg.includes('length')) {
      return NextResponse.json({ error: 'El CV es demasiado extenso para procesarlo. Prueba con una versión más concisa.' }, { status: 422 })
    }
    if (msg.includes('API key') || msg.includes('quota') || msg.includes('PERMISSION_DENIED') ||
        msg.includes('Resource exhausted') || msg.includes('429') || msg.includes('rate limit')) {
      return NextResponse.json({ error: 'El servicio de análisis no está disponible en este momento. Por favor, inténtalo más tarde.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Error inesperado al procesar el CV. Por favor, inténtalo de nuevo.' }, { status: 500 })
  }
}
