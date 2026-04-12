interface FilePreviewProps {
  file: File
  onClear: () => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FilePreview({ file, onClear }: FilePreviewProps) {
  const isPDF = file.name.endsWith('.pdf')

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-light bg-bg-light">
      {/* File type icon */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-teal/10">
        <span className="text-teal font-sans font-[900] text-xs uppercase">
          {isPDF ? 'PDF' : 'DOC'}
        </span>
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-purple-dark font-sans font-[800] text-sm truncate">
          {file.name}
        </p>
        <p className="text-gray-400 font-sans text-xs mt-0.5">
          {formatBytes(file.size)}
        </p>
      </div>

      {/* Clear button */}
      <button
        onClick={onClear}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
        aria-label="Eliminar archivo"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
