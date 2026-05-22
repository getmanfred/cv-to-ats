'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import LanguageSelector, { getLang, type Lang } from './LanguageSelector'

const LABELS = {
  es: {
    analyzeCV: 'Analizar CV',
    cvEditor: 'Editor CV',
    matchCv: 'CV vs Oferta',
    analyzeJob: 'Analizar Oferta',
    analyzeLinkedIn: 'Analizar LinkedIn',
    cvsAnalyzed: (n: string) => `${n} CVs analizados`,
    language: 'Idioma',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  en: {
    analyzeCV: 'Analyse CV',
    cvEditor: 'CV Editor',
    matchCv: 'CV vs Job',
    analyzeJob: 'Analyse Job',
    analyzeLinkedIn: 'Analyse LinkedIn',
    cvsAnalyzed: (n: string) => `${n} CVs analysed`,
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
}

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/' || pathname.startsWith('/results')
  return pathname === href || pathname.startsWith(href + '/')
}

interface HeaderProps {
  noPrint?: boolean
}

export default function Header({ noPrint = false }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cvsAnalyzed, setCvsAnalyzed] = useState<number | null>(null)
  const [lang, setLang] = useState<Lang>('es')

  useEffect(() => {
    setLang(getLang())
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setCvsAnalyzed(d.cvs_analyzed))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: Event) => setLang((e as CustomEvent<Lang>).detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const L = LABELS[lang]

  const navGroups = [
    [
      { href: '/',       label: L.analyzeCV,       isNew: false },
      { href: '/editor', label: L.cvEditor,         isNew: false },
    ],
    [
      { href: '/linkedin', label: L.analyzeLinkedIn, isNew: true  },
      { href: '/match',    label: L.matchCv,          isNew: false },
      { href: '/oferta',   label: L.analyzeJob,       isNew: true  },
    ],
  ]

  return (
    <header className={`bg-white border-b sticky top-0 z-10${noPrint ? ' no-print' : ''}`}
      style={{ borderColor: '#e5e0d8' }}>

      {/* Top bar: logo | counter (centered) | language */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-3 flex items-center sm:grid sm:grid-cols-3">

        {/* Left: logo */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <a href="https://getmanfred.com" target="_blank" rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity duration-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-manfred.svg" alt="Manfred" className="h-6 sm:h-7 w-auto block" />
          </a>
          <span className="w-px h-5 bg-gray-light mx-1 sm:mx-2 self-center" />
          <a href="/" className="flex items-center gap-1 hover:opacity-70 transition-opacity duration-200">
            <span className="font-sans font-[900] text-navy text-sm sm:text-base uppercase tracking-widest self-center leading-none">
              ATS Killer
            </span>
            <span className="font-sans font-[700] text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full self-center ml-1"
              style={{ backgroundColor: '#01FFC6', color: '#092c64' }}>
              Beta
            </span>
          </a>
        </div>

        {/* Center: CVs analyzed */}
        <div className="hidden sm:flex justify-center">
          {cvsAnalyzed !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: '#f0ede8' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#01FFC6' }} />
              <span className="font-sans font-[600] text-xs" style={{ color: '#092c64' }}>
                {L.cvsAnalyzed(cvsAnalyzed.toLocaleString('es-ES'))}
              </span>
            </div>
          )}
        </div>

        {/* Right: language + hamburger */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden sm:block">
            <LanguageSelector showHint />
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="sm:hidden p-2 rounded-lg transition-colors duration-200"
            style={{ color: menuOpen ? '#0DA1A4' : '#9ca3af' }}
            aria-label={menuOpen ? L.closeMenu : L.openMenu}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Bottom nav bar — desktop only */}
      <nav className="hidden sm:block border-t" style={{ borderColor: '#f0ede8', backgroundColor: '#faf9f7' }}>
        <div className="max-w-container mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-end gap-1">
          {navGroups.map((group, gi) => (
            <div key={gi} className="flex items-center">
              {gi > 0 && (
                <span className="w-px h-4 mx-2 flex-shrink-0" style={{ backgroundColor: '#e5e0d8' }} />
              )}
              {group.map(link => {
                const active = isActive(link.href, pathname)
                return (
                  <a key={link.href} href={link.href}
                    className="flex items-center gap-1.5 font-sans font-[700] text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors duration-200"
                    style={active
                      ? { color: '#0DA1A4', backgroundColor: '#e6f7f7' }
                      : { color: '#9ca3af' }}
                  >
                    {link.label}
                    {link.isNew && (
                      <span
                        className="font-sans font-[700] text-[8px] uppercase tracking-wider px-1 py-0.5 rounded-full"
                        style={{ backgroundColor: '#01FFC6', color: '#092c64' }}
                      >
                        NEW!
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t px-4 py-2" style={{ borderColor: '#f3f4f6' }}>
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="h-px my-1.5" style={{ backgroundColor: '#f0ede8' }} />}
              <div className="space-y-0.5">
                {group.map(link => {
                  const active = isActive(link.href, pathname)
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 font-sans font-[700] text-sm uppercase tracking-wider px-3 py-3 rounded-xl transition-colors duration-200"
                      style={active
                        ? { color: '#0DA1A4', backgroundColor: '#e6f7f7' }
                        : { color: '#374151' }}
                    >
                      {link.label}
                      {link.isNew && (
                        <span
                          className="font-sans font-[700] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: '#01FFC6', color: '#092c64' }}
                        >
                          NEW!
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
          <div className="px-3 py-3 mt-1.5 border-t flex items-center gap-3" style={{ borderColor: '#f0ede8' }}>
            <span className="font-sans font-[700] text-xs uppercase tracking-wider text-gray-400">{L.language}</span>
            <LanguageSelector showHint />
          </div>
        </div>
      )}
    </header>
  )
}
