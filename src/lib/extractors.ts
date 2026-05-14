// Server-side only — never import from client components

export async function extractFromPDF(buffer: Buffer, maxPages?: number): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)

  if (maxPages && data.numpages > maxPages) {
    throw new Error(`El CV no puede tener más de ${maxPages} páginas. El tuyo tiene ${data.numpages}.`)
  }

  if (data.text.trim().length >= 30) return data.text

  // PDF has no extractable text — likely image-based (scanned or design export)
  throw new Error('No se pudo extraer texto de este PDF. Puede ser un escaneado o un diseño exportado como imagen (ej: Canva). Prueba a exportarlo de nuevo como PDF con texto, o sube una copia en DOCX o TXT.')
}

export async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  try {
    const result = await mammoth.extractRawText({ buffer })
    if (!result.value.trim()) {
      throw new Error('El archivo .doc no pudo leerse. Conviértelo a .docx o PDF e inténtalo de nuevo.')
    }
    return result.value
  } catch (err) {
    if (err instanceof Error && err.message.includes('doc')) throw err
    throw new Error('El archivo .doc no pudo leerse. Conviértelo a .docx o PDF e inténtalo de nuevo.')
  }
}

export async function extractCVText(buffer: Buffer, filename: string, maxPages?: number): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return extractFromPDF(buffer, maxPages)
  if (ext === 'docx' || ext === 'doc') return extractFromDOCX(buffer)
  if (ext === 'txt' || ext === 'md') return buffer.toString('utf-8')
  throw new Error(`Formato no admitido: .${ext}. Por favor, sube un archivo PDF, DOCX, TXT o MD.`)
}
