'use client'

import { useState, useEffect } from 'react'

export type Lang = 'es' | 'en'
export const LANG_KEY = 'atsLang'
export const DEFAULT_LANG: Lang = 'es'

export function getLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG
  return (localStorage.getItem(LANG_KEY) as Lang) || DEFAULT_LANG
}

export default function LanguageSelector() {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  useEffect(() => {
    setLangState(getLang())
  }, [])

  const select = (l: Lang) => {
    localStorage.setItem(LANG_KEY, l)
    setLangState(l)
  }

  return (
    <div className="flex rounded-lg p-0.5 ml-2" style={{ backgroundColor: '#f3f4f6' }}>
      {(['es', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => select(l)}
          className="font-sans font-[700] text-xs px-2.5 py-1.5 rounded-md uppercase tracking-wider transition-all duration-200"
          style={lang === l
            ? { backgroundColor: '#092c64', color: '#ffffff' }
            : { color: '#9ca3af' }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
