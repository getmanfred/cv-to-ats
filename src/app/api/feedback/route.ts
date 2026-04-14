import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_DIR = path.join(process.cwd(), 'data')
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json')

interface FeedbackEntry {
  id: string
  tipo: string
  mensaje: string
  nombre: string | null
  email: string | null
  pagina: string | null
  fecha: string
  resuelto?: boolean
  fechaResolucion?: string
}

function loadFeedback(): FeedbackEntry[] {
  if (!existsSync(FEEDBACK_FILE)) return []
  try { return JSON.parse(readFileSync(FEEDBACK_FILE, 'utf-8')) } catch { return [] }
}

function saveFeedback(entries: FeedbackEntry[]) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(FEEDBACK_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, mensaje, nombre, email, pagina } = body

    if (!mensaje?.trim()) {
      return NextResponse.json({ error: 'El mensaje es obligatorio.' }, { status: 400 })
    }

    const entries = loadFeedback()
    entries.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tipo: String(tipo || 'otro').slice(0, 50),
      mensaje: String(mensaje).trim().slice(0, 2000),
      nombre: nombre ? String(nombre).trim().slice(0, 100) : null,
      email: email ? String(email).trim().slice(0, 200) : null,
      pagina: pagina ? String(pagina).slice(0, 200) : null,
      fecha: new Date().toISOString(),
    })
    saveFeedback(entries)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const entries = loadFeedback()
    return NextResponse.json(entries)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, resuelto } = await req.json()
    if (!id) return NextResponse.json({ error: 'id requerido.' }, { status: 400 })

    const entries = loadFeedback()
    const idx = entries.findIndex(e => e.id === id)
    if (idx === -1) return NextResponse.json({ error: 'No encontrado.' }, { status: 404 })

    entries[idx].resuelto = !!resuelto
    entries[idx].fechaResolucion = resuelto ? new Date().toISOString() : undefined
    saveFeedback(entries)

    return NextResponse.json({ ok: true, entry: entries[idx] })
  } catch {
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 })
  }
}
