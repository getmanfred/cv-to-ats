// Server-side only — never import from client components

export async function extractFromPDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)
  return data.text
}

export async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export async function extractCVText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return extractFromPDF(buffer)
  if (ext === 'docx' || ext === 'doc') return extractFromDOCX(buffer)
  throw new Error(`Unsupported file type: .${ext}. Please upload a PDF or DOCX file.`)
}
