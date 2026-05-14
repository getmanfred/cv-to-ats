// Server-side only — never import from client components

export async function extractFromPDF(buffer: Buffer, maxPages?: number): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)

  if (maxPages && data.numpages > maxPages) {
    throw new Error(`El CV no puede tener más de ${maxPages} páginas. El tuyo tiene ${data.numpages}.`)
  }

  if (data.text.trim().length >= 100) return data.text

  // PDF is image-based (scanned or Canva export) — no OCR available
  throw new Error('Este PDF parece ser una imagen escaneada o un diseño sin texto seleccionable (ej: Canva). Por favor, expórtalo como PDF con texto o sube una versión en DOCX.')
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
