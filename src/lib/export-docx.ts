import type { CVData } from '@/types/cv'
import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
  convertInchesToTwip, LevelFormat,
} from 'docx'

function hr(): Paragraph {
  return new Paragraph({
    border: { bottom: { color: '000000', size: 6, style: BorderStyle.SINGLE, space: 1 } },
    spacing: { after: 80 },
  })
}

function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: 'Times New Roman' })],
    spacing: { before: 200, after: 80 },
    border: { bottom: { color: '000000', size: 4, style: BorderStyle.SINGLE, space: 1 } },
  })
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: 'Times New Roman' })],
    bullet: { level: 0 },
    spacing: { after: 40 },
  })
}

export async function exportToDocx(data: CVData): Promise<void> {
  const { personalInfo: p, resumen, experiencia, educacion, habilidades, idiomas } = data

  const children: Paragraph[] = []

  // ── Name ──
  children.push(
    new Paragraph({
      children: [new TextRun({ text: p.nombre || 'Tu Nombre', bold: true, size: 36, font: 'Times New Roman' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  )

  // ── Contact line ──
  const contactParts = [p.email, p.telefono, p.linkedin, p.ubicacion, p.website].filter(Boolean)
  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join(' · '), size: 18, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      })
    )
  }

  // ── Cargo ──
  if (p.cargo) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: p.cargo, italics: true, size: 20, font: 'Times New Roman' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    )
  }

  children.push(hr())

  // ── Summary ──
  if (resumen) {
    children.push(sectionHeader('Resumen'))
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resumen, size: 20, font: 'Times New Roman' })],
        spacing: { after: 80 },
      })
    )
  }

  // ── Experience ──
  if (experiencia.length > 0) {
    children.push(sectionHeader('Experiencia'))
    experiencia.forEach(exp => {
      const period = exp.actual ? `${exp.fechaInicio} – Presente` : `${exp.fechaInicio} – ${exp.fechaFin}`
      // Role + Company
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.cargo, bold: true, size: 22, font: 'Times New Roman' }),
            new TextRun({ text: ` — ${exp.empresa}`, size: 22, font: 'Times New Roman' }),
          ],
          spacing: { before: 120, after: 30 },
        })
      )
      // Date + location
      const meta = [period, exp.ubicacion].filter(Boolean).join(' · ')
      children.push(
        new Paragraph({
          children: [new TextRun({ text: meta, italics: true, size: 19, font: 'Times New Roman', color: '555555' })],
          spacing: { after: 60 },
        })
      )
      exp.bullets.filter(Boolean).forEach(b => children.push(bullet(b)))
    })
  }

  // ── Education ──
  if (educacion.length > 0) {
    children.push(sectionHeader('Educación'))
    educacion.forEach(edu => {
      const period = `${edu.fechaInicio} – ${edu.fechaFin}`
      const degree = [edu.titulo, edu.campo].filter(Boolean).join(', ')
      children.push(
        new Paragraph({
          children: [new TextRun({ text: degree, bold: true, size: 22, font: 'Times New Roman' })],
          spacing: { before: 120, after: 30 },
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${edu.institucion} · ${period}`, italics: true, size: 19, font: 'Times New Roman', color: '555555' })],
          spacing: { after: 60 },
        })
      )
      edu.logros.filter(Boolean).forEach(l => children.push(bullet(l)))
    })
  }

  // ── Skills ──
  if (habilidades.length > 0) {
    children.push(sectionHeader('Habilidades'))
    children.push(
      new Paragraph({
        children: [new TextRun({ text: habilidades.join(' · '), size: 20, font: 'Times New Roman' })],
        spacing: { after: 80 },
      })
    )
  }

  // ── Languages ──
  if (idiomas.length > 0) {
    children.push(sectionHeader('Idiomas'))
    idiomas.forEach(l => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: l.idioma, bold: true, size: 20, font: 'Times New Roman' }),
            new TextRun({ text: `: ${l.nivel}`, size: 20, font: 'Times New Roman' }),
          ],
          spacing: { after: 40 },
        })
      )
    })
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children,
    }],
    numbering: {
      config: [{
        reference: 'default-bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: {
              indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
            },
          },
        }],
      }],
    },
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `CV-${p.nombre || 'documento'}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
