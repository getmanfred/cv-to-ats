import { ReactNode } from 'react'

// Renders text with specific substrings bolded (from terminos[])
export function renderWithTerminos(text: string, terminos?: string[]): ReactNode {
  if (!text) return null
  if (!terminos || terminos.length === 0) return text

  // Build a regex that matches any of the terminos (escaped)
  const escaped = terminos
    .filter(t => t && t.length > 0)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (escaped.length === 0) return text

  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <strong key={i} style={{ fontWeight: 700, color: 'inherit' }}>{part}</strong>
          : part
      )}
    </>
  )
}

// Legacy: renders **bold** markdown syntax
export function renderBold(text: string): ReactNode[] {
  if (!text) return []
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-[700] text-navy">{part}</strong> : part
  )
}
