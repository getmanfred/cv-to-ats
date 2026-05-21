'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/ui/Button'
import { getLang, type Lang } from '@/components/LanguageSelector'

const LABELS = {
  es: {
    title: '¿Vale la pena esta oferta?',
    subtitle: 'Pega el texto de la oferta y te decimos lo que dice, lo que no dice y si merece tu tiempo.',
    placeholder: 'Pega aquí el texto completo de la oferta de empleo o una URL (https://...)',
    analyze: 'Analizar oferta',
    analyzing: 'Analizando...',
    orUpload: 'o sube un archivo',
    uploadFile: 'PDF o DOCX',
    urlDetected: 'URL detectada',
    remove: 'Quitar',
    loadingHint: 'La IA está analizando la calidad de la oferta',
    errEmpty: 'Pega el texto de la oferta para continuar.',
    errShort: 'El texto es demasiado corto. Pega la oferta completa.',
    errService: 'El servicio no está disponible en este momento. Inténtalo de nuevo en unos segundos.',
    errUnknown: 'Error inesperado. Por favor, inténtalo de nuevo.',
  },
  en: {
    title: 'Is this job worth it?',
    subtitle: 'Paste the job offer text and we\'ll tell you what it says, what it doesn\'t say, and whether it\'s worth your time.',
    placeholder: 'Paste the full job offer text here or a URL (https://...)',
    analyze: 'Analyse offer',
    analyzing: 'Analysing...',
    orUpload: 'or upload a file',
    uploadFile: 'PDF or DOCX',
    urlDetected: 'URL detected',
    remove: 'Remove',
    loadingHint: 'AI is analysing the quality of the offer',
    errEmpty: 'Paste the job offer text to continue.',
    errShort: 'The text is too short. Paste the full job offer.',
    errService: 'The service is not available right now. Try again in a few seconds.',
    errUnknown: 'Unexpected error. Please try again.',
  },
}

const LOADING_MESSAGES = [
  'Contando tecnologías del stack... Van 47...',
  'Buscando el salario... Sigue sin aparecer...',
  'Evaluando si el futbolín cuenta como beneficio...',
  'Comprobando si los años de experiencia son físicamente posibles...',
  'Leyendo entre líneas (y entre líneas de las líneas)...',
  'Calculando el ratio requisitos/compensación...',
  'Analizando si "incorporación inmediata" es una señal...',
]

export default function OfertaPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('es')
  const [jdText, setJdText] = useState('')
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const jdInputRef = useRef<HTMLInputElement>(null)

  const jdIsUrl = /^https?:\/\/\S+$/.test(jdText.trim())
  const isManfred = jdIsUrl && jdText.toLowerCase().includes('getmanfred.com')

  useEffect(() => {
    setLang(getLang())
    const handler = (e: Event) => setLang((e as CustomEvent<Lang>).detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  useEffect(() => {
    if (!analyzing) return
    setLoadingMsg(LOADING_MESSAGES[0])
    let i = 1
    const interval = setInterval(() => {
      setLoadingMsg(LOADING_MESSAGES[i % LOADING_MESSAGES.length])
      i++
    }, 3000)
    return () => clearInterval(interval)
  }, [analyzing])

  const L = LABELS[lang]
  const hasInput = jdText.trim().length > 0 || !!jdFile

  async function handleAnalyze() {
    setError('')

    if (!jdText.trim() && !jdFile) { setError(L.errEmpty); return }
    if (!jdIsUrl && jdText.trim().length > 0 && jdText.trim().length < 100) {
      setError(L.errShort); return
    }

    setAnalyzing(true)
    try {
      const formData = new FormData()
      if (jdIsUrl) {
        formData.append('jdUrl', jdText.trim())
      } else if (jdText.trim()) {
        formData.append('jdText', jdText.trim())
      } else if (jdFile) {
        formData.append('jdFile', jdFile)
      }
      formData.append('lang', lang)
      formData.append('isManfred', String(isManfred))

      const res = await fetch('/api/job-analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? L.errUnknown)
        return
      }
      sessionStorage.setItem('jobResult', JSON.stringify(data))
      router.push('/oferta/results')
    } catch {
      setError(L.errService)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <div className="mb-8">
          <h1 className="font-sans font-[900] text-2xl sm:text-3xl text-navy mb-3 leading-tight">
            {L.title}
          </h1>
          <p className="font-sans text-sm sm:text-base text-gray-500 leading-relaxed">
            {L.subtitle}
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl p-6 mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="relative">
            <textarea
              value={jdText}
              onChange={e => { setJdText(e.target.value); setJdFile(null) }}
              placeholder={L.placeholder}
              rows={jdIsUrl ? 2 : 8}
              disabled={analyzing}
              className="w-full font-sans text-sm rounded-xl border px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all"
              style={{
                borderColor: jdIsUrl ? '#0DA1A4' : '#e5e7eb',
                color: '#1a2744',
                transition: 'border-color 0.2s, height 0.2s',
              }}
            />
            {jdIsUrl && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ backgroundColor: isManfred ? '#f0fdf4' : '#e6f7f7' }}>
                {isManfred ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#16a34a' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="font-sans font-[700] text-xs" style={{ color: '#16a34a' }}>Manfredo Certified</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0DA1A4' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="font-sans font-[700] text-xs" style={{ color: '#0DA1A4' }}>{L.urlDetected}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="font-sans text-xs text-gray-400">{L.orUpload}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <label className="flex items-center gap-2 mt-3 cursor-pointer"
            style={{ opacity: jdText.trim() ? 0.4 : 1, pointerEvents: jdText.trim() ? 'none' : 'auto' }}>
            <input
              ref={jdInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              disabled={analyzing}
              onChange={e => { setJdFile(e.target.files?.[0] ?? null); setJdText('') }}
            />
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border font-sans font-[700] text-xs uppercase tracking-wider transition-colors duration-200"
              style={{
                borderColor: jdFile ? '#0DA1A4' : '#e5e7eb',
                color: jdFile ? '#0DA1A4' : '#9ca3af',
                backgroundColor: jdFile ? '#e6f7f7' : 'transparent',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {jdFile ? jdFile.name : L.uploadFile}
            </div>
            {jdFile && (
              <button
                onClick={e => { e.preventDefault(); setJdFile(null) }}
                className="font-sans text-xs text-gray-400 hover:text-red-500 underline underline-offset-2"
              >
                {L.remove}
              </button>
            )}
          </label>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-sans text-sm">{error}</p>
          </div>
        )}

        {analyzing ? (
          <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white border border-gray-100">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-teal"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <p
              key={loadingMsg}
              className="font-sans font-[800] text-center text-base"
              style={{ color: '#1a2744', animation: 'fadeIn 0.4s ease-in' }}
            >
              {loadingMsg || L.analyzing}
            </p>
            <p className="font-sans text-gray-400 text-xs">{L.loadingHint}</p>
          </div>
        ) : (
          <Button variant="primary" size="lg" disabled={!hasInput} onClick={handleAnalyze} className="w-full">
            {L.analyze}
          </Button>
        )}

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
