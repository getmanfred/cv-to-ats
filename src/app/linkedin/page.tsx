'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { LinkedInResult } from '@/types/linkedin'
import { getLang } from '@/components/LanguageSelector'
import Header from '@/components/Header'

type State = 'idle' | 'analyzing' | 'error'

const LOADING_MESSAGES = [
  'Contando cuántas veces aparece la palabra "apasionado"...',
  'Verificando si tu foto es de LinkedIn o de una boda...',
  'Buscando validaciones de habilidades de tu madre...',
  'Detectando frases tipo "pensador disruptivo"...',
  'Comprobando si tienes 500+ contactos o solo 499...',
  'Revisando si tu About empieza con "Soy una persona apasionada"...',
  'Buscando el post de "Estoy emocionado de anunciar"...',
  'Analizando tu nivel de thought leadership...',
  'Contando cuántos reclutadores te han ignorado (dato no incluido en el informe)...',
  'Comprobando si pusiste "gurú" en algún sitio...',
  'Casi listo, preparando tu informe...',
]

export default function LinkedInPage() {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const [hasCachedResult, setHasCachedResult] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setHasCachedResult(!!sessionStorage.getItem('linkedinResult'))
  }, [])

  useEffect(() => {
    if (state !== 'analyzing') return
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[i])
    }, 2200)
    return () => clearInterval(interval)
  }, [state])

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Solo se admiten archivos PDF. Descarga el PDF desde LinkedIn e inténtalo de nuevo.')
      return
    }
    setPdfFile(file)
    setErrorMsg('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleAnalyze = async () => {
    if (!pdfFile) return
    setState('analyzing')
    setErrorMsg('')
    setLoadingMsg(LOADING_MESSAGES[0])
    try {
      const formData = new FormData()
      formData.append('pdf', pdfFile)
      formData.append('lang', getLang())
      const response = await fetch('/api/linkedin', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al analizar el perfil.')
      sessionStorage.setItem('linkedinResult', JSON.stringify(data as LinkedInResult))
      router.push('/linkedin/results')
    } catch (error) {
      setState('error')
      setErrorMsg(error instanceof Error ? error.message : 'Error inesperado. Por favor, inténtalo de nuevo.')
    }
  }

  const isAnalyzing = state === 'analyzing'
  const canSubmit = !!pdfFile

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0ede8' }}>

      <Header />

      {/* Hero */}
      <section className="bg-navy text-white py-8 sm:py-14 px-6">
        <div className="max-w-container mx-auto text-center">
          <p className="font-sans font-[900] uppercase tracking-widest text-neon text-xs mb-5">
            Herramienta Gratuita de Manfred
          </p>
          <h1 className="font-heading font-[900] text-4xl md:text-5xl leading-tight mb-4">
            Optimiza tu perfil
            <br />
            <span className="italic" style={{ color: '#01FFC6' }}>de LinkedIn</span>
          </h1>
          <p className="font-sans text-base text-white/70 max-w-xl mx-auto">
            Descarga el PDF de tu perfil y descubre cómo mejorar tu visibilidad, tu titular y tus posibilidades de que te encuentren los recruiters.
          </p>
        </div>
      </section>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-6 sm:py-10 space-y-5">

        {/* Cached result banner */}
        {hasCachedResult && (
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#e6f7f7' }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0DA1A4' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-sans text-sm font-[600]" style={{ color: '#0DA1A4' }}>
                Tienes un análisis anterior guardado
              </p>
            </div>
            <button
              onClick={() => router.push('/linkedin/results')}
              className="font-sans font-[700] text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#0DA1A4', color: '#ffffff' }}
            >
              Ver análisis →
            </button>
          </div>
        )}

        {/* How to download PDF instructions */}
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between">
            <p className="font-sans font-[700] text-xs uppercase tracking-widest text-gray-400">
              Cómo descargar tu perfil en PDF
            </p>
            <a
              href="https://www.linkedin.com/in/me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans font-[700] text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#0A66C2', color: '#ffffff' }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Abrir mi perfil
            </a>
          </div>

          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-sans font-[700] text-xs mt-0.5" style={{ backgroundColor: '#e6f7f7', color: '#0DA1A4' }}>1</span>
              <p className="font-sans text-sm" style={{ color: '#1a2744' }}>
                Abre tu perfil y haz clic en el botón <strong>"Más"</strong> (junto a "Conectar" o "Seguir")
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-sans font-[700] text-xs mt-0.5" style={{ backgroundColor: '#e6f7f7', color: '#0DA1A4' }}>2</span>
              <p className="font-sans text-sm" style={{ color: '#1a2744' }}>
                Selecciona <strong>"Guardar en PDF"</strong> <span className="text-gray-400">(en inglés: "Save to PDF")</span>. El PDF se descargará automáticamente
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-sans font-[700] text-xs mt-0.5" style={{ backgroundColor: '#e6f7f7', color: '#0DA1A4' }}>3</span>
              <p className="font-sans text-sm" style={{ color: '#1a2744' }}>
                Sube el PDF descargado aquí abajo
              </p>
            </li>
          </ol>

          {/* Sections checklist */}
          <div className="pt-3 border-t border-gray-100">
            <p className="font-sans font-[600] text-xs uppercase tracking-wider text-gray-400 mb-2">Secciones que analizamos</p>
            <div className="flex flex-wrap gap-2">
              {['Titular', 'About / Resumen', 'Experiencia', 'Educación', 'Habilidades', 'Certificaciones'].map(s => (
                <span key={s} className="flex items-center gap-1 font-sans text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-sans text-xs text-gray-400">
              Las recomendaciones y el conteo de validaciones de habilidades no se incluyen en el PDF de LinkedIn.
            </p>
          </div>
        </div>

        {/* File upload */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="font-sans font-[700] text-xs uppercase tracking-widest text-gray-400 mb-3">
            PDF del perfil
          </p>

          {pdfFile ? (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
              style={{ borderColor: '#0DA1A4', backgroundColor: '#f0fbfb' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e6f7f7' }}>
                  <svg className="w-5 h-5" fill="none" stroke="#0DA1A4" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-sans font-[600] text-sm text-navy truncate max-w-xs">{pdfFile.name}</p>
                  <p className="font-sans text-xs text-gray-400">{(pdfFile.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button
                onClick={() => { setPdfFile(null); setErrorMsg('') }}
                className="font-sans font-[600] text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-red-50"
                style={{ color: '#ef4444' }}
              >
                Quitar
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-200 py-10 px-6"
              style={{ borderColor: '#d1d5db' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-sans font-[600] text-sm text-navy">Sube el PDF de tu perfil de LinkedIn</p>
                <p className="font-sans text-xs text-gray-400 mt-1">Haz clic o arrastra el archivo aquí</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>

        {/* Error */}
        {(state === 'error' || errorMsg) && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-sans text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Loading */}
        {isAnalyzing && (
          <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white border border-gray-light">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2.5 h-2.5 rounded-full bg-teal"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p key={loadingMsg} className="font-sans font-[800] text-center text-base"
              style={{ color: '#1a2744', animation: 'fadeIn 0.4s ease-in' }}>
              {loadingMsg}
            </p>
            <p className="font-sans text-gray-400 text-xs">La IA está analizando tu perfil</p>
          </div>
        )}

        {/* Submit */}
        {!isAnalyzing && (
          <>
            <button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-xl font-sans font-[900] text-sm uppercase tracking-wider transition-all duration-300"
              style={{
                backgroundColor: canSubmit ? '#092c64' : '#e5e7eb',
                color: canSubmit ? '#ffffff' : '#9ca3af',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              Analizar perfil de LinkedIn
            </button>
            <p className="font-sans text-xs text-center" style={{ color: '#b0b8c4' }}>
              El texto se envía a un modelo de IA local y no se almacena.{' '}
              <a href="/privacidad" className="underline underline-offset-2 hover:opacity-70 transition-opacity">Política de privacidad</a>.
            </p>
          </>
        )}

        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 font-sans">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Tu perfil no se almacena
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Análisis en segundos
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
