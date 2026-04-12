interface AlertaBannerProps {
  alertas: string[]
}

export default function AlertaBanner({ alertas }: AlertaBannerProps) {
  if (!alertas || alertas.length === 0) return null

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#ffedd5' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ea580c' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans font-[700] text-sm mb-2" style={{ color: '#9a3412' }}>
            Alertas críticas de parseo ATS
          </p>
          <p className="font-sans text-xs mb-3" style={{ color: '#c2410c' }}>
            Estos problemas pueden hacer que los ATS descarten tu CV antes de que lo lea un humano.
          </p>
          <ul className="space-y-1.5">
            {alertas.map((alerta, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 rounded-full mt-1.5"
                  style={{ width: 5, height: 5, backgroundColor: '#ea580c' }}
                />
                <span className="font-sans text-sm" style={{ color: '#7c2d12' }}>{alerta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
