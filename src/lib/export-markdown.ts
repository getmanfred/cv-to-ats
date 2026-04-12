import type { CVData } from '@/types/cv'

export function exportToMarkdown(data: CVData): void {
  const lines: string[] = []
  const { personalInfo: p, resumen, experiencia, educacion, habilidades, idiomas } = data

  // Header
  lines.push(`# ${p.nombre}`)
  if (p.cargo) lines.push(`**${p.cargo}**`)
  lines.push('')

  const contactParts = [p.email, p.telefono, p.linkedin, p.ubicacion, p.website].filter(Boolean)
  if (contactParts.length) lines.push(contactParts.join(' · '))
  lines.push('')

  // Summary
  if (resumen) {
    lines.push('---', '', '## Resumen', '', resumen, '')
  }

  // Experience
  if (experiencia.length > 0) {
    lines.push('---', '', '## Experiencia', '')
    experiencia.forEach(exp => {
      const period = exp.actual ? `${exp.fechaInicio} – Presente` : `${exp.fechaInicio} – ${exp.fechaFin}`
      lines.push(`### ${exp.cargo} — ${exp.empresa}`)
      lines.push(`*${period}${exp.ubicacion ? ` · ${exp.ubicacion}` : ''}*`, '')
      exp.bullets.filter(Boolean).forEach(b => lines.push(`- ${b}`))
      lines.push('')
    })
  }

  // Education
  if (educacion.length > 0) {
    lines.push('---', '', '## Educación', '')
    educacion.forEach(edu => {
      const period = `${edu.fechaInicio} – ${edu.fechaFin}`
      const degree = [edu.titulo, edu.campo].filter(Boolean).join(', ')
      lines.push(`### ${degree}`)
      lines.push(`*${edu.institucion} · ${period}*`, '')
      edu.logros.filter(Boolean).forEach(l => lines.push(`- ${l}`))
      if (edu.logros.filter(Boolean).length) lines.push('')
    })
  }

  // Skills
  if (habilidades.length > 0) {
    lines.push('---', '', '## Habilidades', '')
    lines.push(habilidades.join(' · '), '')
  }

  // Languages
  if (idiomas.length > 0) {
    lines.push('---', '', '## Idiomas', '')
    idiomas.forEach(l => lines.push(`- **${l.idioma}**: ${l.nivel}`))
    lines.push('')
  }

  const content = lines.join('\n')
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `CV-${p.nombre || 'documento'}.md`
  a.click()
  URL.revokeObjectURL(url)
}
