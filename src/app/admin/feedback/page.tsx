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
}

const TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  bug:        { bg: '#fff1f2', text: '#e11d48' },
  sugerencia: { bg: '#fffbeb', text: '#d97706' },
  idea:       { bg: '#e6f7f7', text: '#0DA1A4' },
  otro:       { bg: '#f3f4f6', text: '#6b7280' },
}

export default function AdminFeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/feedback')
      .then(r => r.json())
      .then(data => { setEntries([...data].reverse()); setLoading(false) })
      .catch(() => { setError('No se pudieron cargar las entradas.'); setLoading(false) })
  }, [])

  const total = entries.length
  const bugs = entries.filter(e => e.tipo === 'bug').length
  const sugerencias = entries.filter(e => e.tipo === 'sugerencia').length
  const ideas = entries.filter(e => e.tipo === 'idea').length

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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: total, bg: '#092c64', text: '#ffffff' },
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

        {loading && (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-7 w-7 text-teal" fill="none" viewBox="0 0 24 24">
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

        {!loading && !error && entries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="font-sans font-[700] text-base text-gray-400">Todavía no hay entradas de feedback.</p>
            <p className="font-sans text-sm text-gray-400 mt-1">Aparecerán aquí cuando los usuarios envíen feedback.</p>
          </div>
        )}

        {entries.map(entry => {
          const colors = TIPO_COLORS[entry.tipo] ?? TIPO_COLORS.otro
          const date = new Date(entry.fecha).toLocaleString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
          return (
            <div key={entry.id} className="bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
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
                <div className="text-right flex-shrink-0">
                  <p className="font-sans text-xs text-gray-400">{date}</p>
                  {entry.pagina && (
                    <p className="font-sans text-xs text-gray-300 mt-0.5">{entry.pagina}</p>
                  )}
                </div>
              </div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: '#1a2744' }}>
                {entry.mensaje}
              </p>
            </div>
          )
        })}
      </main>
    </div>
  )
}
