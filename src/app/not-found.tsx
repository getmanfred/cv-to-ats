import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f0ede8' }}>
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <p
          className="font-sans font-[900] leading-none mb-4"
          style={{ fontSize: '7rem', color: '#092c64', opacity: 0.12 }}
        >
          404
        </p>

        {/* Icon */}
        <div className="flex items-center justify-center mb-6 -mt-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#092c64' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-sans font-[900] text-2xl mb-2" style={{ color: '#1a2744' }}>
          Este CV no existe
        </h1>
        <p className="font-sans text-sm mb-8" style={{ color: '#6b7280' }}>
          Pero el tuyo sí puede mejorar. Vuelve a la herramienta y dale caña.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans font-[800] text-sm px-6 py-3 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#092c64' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Analizar mi CV
        </Link>
      </div>
    </div>
  )
}
