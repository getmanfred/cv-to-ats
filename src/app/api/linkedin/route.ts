import { NextRequest, NextResponse } from 'next/server'
import { analyzeLinkedIn } from '@/lib/linkedin-ai'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { extractCVText } from '@/lib/extractors'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 180

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const MIN_TEXT_LENGTH = 200
const MAX_TEXT_LENGTH = 50_000

function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message
    if (msg.includes('API key') || msg.includes('quota') || msg.includes('PERMISSION_DENIED') ||
        msg.includes('Resource exhausted') || msg.includes('429') || msg.includes('rate limit')) {
      return 'El servicio de análisis no está disponible en este momento. Por favor, inténtalo más tarde.'
    }
    if (msg.includes('JSON') || msg.includes('parse')) {
      return 'Error al procesar la respuesta. Por favor, inténtalo de nuevo.'
    }
  }
  return 'El análisis ha fallado. Por favor, inténtalo de nuevo.'
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed, retryAfter } = checkRateLimit(`linkedin:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Por favor, espera un momento antes de volver a intentarlo.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('pdf') as File | null
    const lang = (formData.get('lang') as string | null) === 'en' ? 'en' : 'es'

    if (!file) {
      return NextResponse.json({ error: 'No se ha adjuntado ningún archivo.' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Solo se admiten archivos PDF.' }, { status: 415 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'El archivo supera el límite de 5 MB.' }, { status: 413 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let profileText: string
    try {
      profileText = await extractCVText(buffer, file.name)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo extraer texto del PDF.'
      return NextResponse.json({ error: msg }, { status: 422 })
    }

    if (profileText.trim().length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        { error: 'No se pudo extraer suficiente texto del PDF. Asegúrate de subir el PDF oficial de LinkedIn (no una captura de pantalla).' },
        { status: 422 }
      )
    }

    if (profileText.length > MAX_TEXT_LENGTH) {
      profileText = profileText.slice(0, MAX_TEXT_LENGTH)
    }

    const result = await analyzeLinkedIn(profileText.trim(), lang)
    result.analyzedAt = new Date().toISOString()

    void (async () => { try { await getSupabase().rpc('increment_stat', { stat_id: 'action:linkedin' }) } catch {} })()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
