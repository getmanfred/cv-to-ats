'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import LanguageSelector from './LanguageSelector'

const NAV_LINKS = [
  { href: '/',          label: 'Analizar CV' },
  { href: '/match',     label: 'Match con oferta' },
  { href: '/linkedin',  label: 'Analizar LinkedIn' },
  { href: '/editor',    label: 'Editor CV' },
]

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

  return (
    <header className={`bg-navy sticky top-0 z-10${noPrint ? ' no-print' : ''}`}>
      <div className="max-w-container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-manfred.svg"
            alt="Manfred"
            className="h-6 sm:h-7 w-auto block"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <span className="w-px h-5 self-center mx-1 sm:mx-2" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <span className="font-display font-[900] text-white text-sm sm:text-base uppercase tracking-[0.12em] self-center leading-none">
            ATS Killer
          </span>
          <span className="font-sans font-[700] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full self-center ml-1 bg-neon text-navy">
            Beta
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}
              className={`font-sans font-[700] text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                isActive(link.href, pathname)
                  ? 'text-neon'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <LanguageSelector />
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login' }}
            className="font-sans font-[700] text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors duration-200 text-white/40 hover:text-white/70"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </nav>

        {/* Mobile: lang + hamburger */}
        <div className="flex sm:hidden items-center gap-1">
          <LanguageSelector />
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={`p-2 rounded-lg transition-colors duration-200 ${menuOpen ? 'text-neon' : 'text-white/60'}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-navy border-t border-white/10 px-4 py-2 space-y-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center font-sans font-[700] text-sm uppercase tracking-wider px-3 py-3 rounded-xl transition-colors duration-200 ${
                isActive(link.href, pathname)
                  ? 'text-neon'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login' }}
            className="flex w-full items-center font-sans font-[700] text-sm uppercase tracking-wider px-3 py-3 rounded-xl transition-colors duration-200 text-white/40 hover:text-white/60"
          >
            Salir
          </button>
        </div>
      )}
    </header>
  )
}
