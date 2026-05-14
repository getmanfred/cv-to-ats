import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const id   = searchParams.get('id')
  const slug = searchParams.get('slug')

  if (!id || !slug) {
    return NextResponse.json({ error: 'id and slug required' }, { status: 400 })
  }

  try {
    const url = `https://www.getmanfred.com/ofertas-empleo/${id}/${slug}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return NextResponse.json({ text: '' })

    const html = await res.text()

    const text = html
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#\d+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Skip navigation — content starts after the last occurrence of "Regístrate"
    const anchor = text.lastIndexOf('Regístrate')
    const content = anchor !== -1 ? text.slice(anchor + 10) : text

    return NextResponse.json({ text: content.slice(0, 15000) })
  } catch {
    return NextResponse.json({ text: '' })
  }
}
