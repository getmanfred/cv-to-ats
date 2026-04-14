'use client'

import { useEffect, useState } from 'react'

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

const TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  bug:        { bg: '#fff1f2', text: '#e11d48' },
  sugerencia: { bg: '#fffbeb', text: '#d97706' },
  idea:       { bg: '#e6f7f7', text: '#0DA1A4' },
  otro:       { bg: '#f3f4f6', text: '#6b7280' },
}

type Tab = 'activo' | 'archivado'

export default function AdminFeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('activo')
  const [resolving, setResolving] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/feedback')
      .then(r => r.json())
      .then(data => { setEntries([...data].reverse()); setLoading(false) })
      .catch(() => { setError('No se pudieron cargar las entradas.'); setLoading(false) })
  }, [])

  async function toggleResuelto(entry: FeedbackEntry) {
    setResolving(entry.id)
    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, resuelto: !entry.resuelto }),
      })
      if (!res.ok) throw new Error()
      const { entry: updated } = await res.json()
      setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))
    } catch {
      // silently ignore — entry stays as-is
    } finally {
      setResolving(null)
    }
  }

  const activos    = entries.filter(e => !e.resuelto)
  const archivados = entries.filter(e => e.resuelto)
  const visible    = tab === 'activo' ? activos : archivados

  const bugs       = activos.filter(e => e.tipo === 'bug').length
  const sugerencias = activos.filter(e => e.tipo === 'sugerencia').length
  const ideas      = activos.filter(e => e.tipo === 'idea').length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0ede8' }}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10" style={{ borderColor: '#e5e0d8' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-manfred.svg" alt="Manfred" className="h-7 w-auto" />
            <span className="w-px h-5 bg-gray-200 mx-1" />
            <span className="font-sans font-[900] text-navy text-base uppercase tracking-widest">ATS Killer</span>
            <span className="font-sans font-[700] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#01FFC6', color: '#092c64' }}>Beta</span>
          </div>
          <span className="font-sans font-[700] text-xs uppercase tracking-widest text-gray-400">Admin · Feedback</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Stats — solo activos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Activos', value: activos.length, bg: '#092c64', text: '#ffffff' },
            { label: 'Bugs', value: bugs, bg: '#fff1f2', text: '#e11d48' },
            { label: 'Sugerencias', value: sugerencias, bg: '#fffbeb', text: '#d97706' },
            { label: 'Ideas', value: ideas, bg: '#e6f7f7', text: '#0DA1A4' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-5" style={{ backgroundColor: stat.bg }}>
              <p className="font-sans font-[700] text-xs uppercase tracking-widest mb-1"
                style={{ color: stat.text, opacity: 0.7 }}>{stat.label}</p>
              <p className="font-sans font-[900] text-3xl leading-none" style={{ color: stat.text }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['activo', 'archivado'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-sans font-[700] text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
              style={tab === t
                ? { backgroundColor: '#092c64', color: '#ffffff' }
                : { backgroundColor: '#ffffff', color: '#6b7280' }}
            >
              {t === 'activo' ? `Activos (${activos.length})` : `Archivados (${archivados.length})`}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0DA1A4" strokeWidth="3" />
              <path className="opacity-75" fill="#0DA1A4" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="font-sans text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="font-sans font-[700] text-base text-gray-400">
              {tab === 'activo' ? 'No hay entradas pendientes.' : 'No hay entradas archivadas.'}
            </p>
          </div>
        )}

        {visible.map(entry => {
          const colors = TIPO_COLORS[entry.tipo] ?? TIPO_COLORS.otro
          const date = new Date(entry.fecha).toLocaleString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
          const isResolving = resolving === entry.id

          return (
            <div key={entry.id}
              className="bg-white rounded-2xl p-5 transition-opacity"
              style={{
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                opacity: entry.resuelto ? 0.6 : 1,
              }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-sans font-[700] text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {entry.tipo.toUpperCase()}
                  </span>
                  {entry.nombre && (
                    <span className="font-sans font-[600] text-sm" style={{ color: '#1a2744' }}>{entry.nombre}</span>
                  )}
                  {entry.email && (
                    <a href={`mailto:${entry.email}`}
                      className="font-sans text-xs text-gray-400 hover:text-teal transition-colors underline underline-offset-2">
                      {entry.email}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-sans text-xs text-gray-400">{date}</p>
                    {entry.pagina && (
                      <p className="font-sans text-xs text-gray-300 mt-0.5">{entry.pagina}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleResuelto(entry)}
                    disabled={isResolving}
                    title={entry.resuelto ? 'Marcar como pendiente' : 'Marcar como resuelto'}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={entry.resuelto
                      ? { backgroundColor: '#d1fae5', color: '#059669' }
                      : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                  >
                    {isResolving ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#1a2744' }}>
                {entry.mensaje}
              </p>
              {entry.resuelto && entry.fechaResolucion && (
                <p className="font-sans text-xs text-gray-300 mt-3">
                  Archivado el {new Date(entry.fechaResolucion).toLocaleString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
