import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const BARS = [
  { label: 'Palabras clave ATS',    pct: 85, color: '#10b981' },
  { label: 'Formato y legibilidad', pct: 88, color: '#10b981' },
  { label: 'Experiencia laboral',   pct: 68, color: '#f59e0b' },
  { label: 'Educación',             pct: 78, color: '#10b981' },
  { label: 'Info. de contacto',     pct: 90, color: '#10b981' },
]

const IMPROVEMENTS = [
  { type: 'warn', text: 'Añade métricas cuantificadas en tus logros — los ATS priorizan resultados medibles.' },
  { type: 'ok',   text: 'Formato limpio y sin elementos que confundan a los parsers ATS.' },
]

const SCORE = 78
const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const OFFSET = CIRCUMFERENCE * (1 - SCORE / 100)

export async function GET() {
  const fontData = await readFile(
    join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'noto-sans-v27-latin-regular.ttf')
  )

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#f0ede8',
          display: 'flex',
          fontFamily: 'sans-serif',
          alignItems: 'stretch',
        }}
      >
        {/* ── Left: branding ── */}
        <div
          style={{
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 48px',
            backgroundColor: '#092c64',
          }}
        >
          {/* Brand label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <div style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}>
              MANFRED
            </div>
            <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{
              color: '#01FFC6',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}>
              ATSKILLER
            </div>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <div style={{
              fontSize: '44px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-1px',
            }}>
              Analiza tu CV.
            </div>
            <div style={{
              fontSize: '44px',
              fontWeight: 900,
              color: '#01FFC6',
              lineHeight: 1.05,
              letterSpacing: '-1px',
            }}>
              Prepáralo
            </div>
            <div style={{
              fontSize: '44px',
              fontWeight: 900,
              color: '#01FFC6',
              lineHeight: 1.05,
              letterSpacing: '-1px',
            }}>
              para los ATS.
            </div>
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.6,
            marginTop: '24px',
          }}>
            Feedback concreto, puntuación por categorías y recomendaciones accionables.
          </div>

          {/* CTA pill */}
          <div style={{
            display: 'flex',
            marginTop: '32px',
          }}>
            <div style={{
              backgroundColor: '#01FFC6',
              color: '#092c64',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '8px 18px',
              borderRadius: '99px',
            }}>
              Gratis · Sin registro
            </div>
          </div>
        </div>

        {/* ── Right: report card ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 48px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 40px rgba(9,44,100,0.15)',
          }}>

            {/* Card header */}
            <div style={{
              backgroundColor: '#092c64',
              borderRadius: '16px 16px 0 0',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '16px',
                }}>
                  M
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>María González</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Senior Product Designer · 7 años</div>
                </div>
              </div>

              {/* Score + ring */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Puntuación ATS
                  </div>
                  <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '26px', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    78
                    <span style={{ fontSize: '14px', opacity: 0.6 }}>%</span>
                  </div>
                </div>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
                  <circle
                    cx="20" cy="20" r={RADIUS}
                    fill="none"
                    stroke="#0DA1A4"
                    strokeWidth="3.5"
                    strokeDasharray={`${CIRCUMFERENCE}`}
                    strokeDashoffset={`${OFFSET}`}
                    strokeLinecap="round"
                    transform="rotate(-90 20 20)"
                  />
                </svg>
              </div>
            </div>

            {/* Card body */}
            <div style={{ display: 'flex', padding: '20px 24px', gap: '24px' }}>

              {/* Left: bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0px' }}>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  Desglose por categoría
                </div>
                {BARS.map((bar) => (
                  <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#374151' }}>{bar.label}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: bar.color }}>{bar.pct}%</span>
                    </div>
                    <div style={{ height: '5px', backgroundColor: '#f3f4f6', borderRadius: '99px', display: 'flex' }}>
                      <div style={{ width: `${bar.pct}%`, backgroundColor: bar.color, height: '5px', borderRadius: '99px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ width: '1px', backgroundColor: '#f3f4f6' }} />

              {/* Right: improvements */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0px' }}>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  Puntos de mejora
                </div>
                {IMPROVEMENTS.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    backgroundColor: item.type === 'warn' ? '#fffbeb' : '#f0fdf4',
                  }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '99px',
                      backgroundColor: item.type === 'warn' ? '#f59e0b' : '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '99px', backgroundColor: '#fff' }} />
                    </div>
                    <div style={{
                      fontSize: '11px',
                      lineHeight: 1.5,
                      color: item.type === 'warn' ? '#92400e' : '#166534',
                    }}>
                      {item.text}
                    </div>
                  </div>
                ))}

                {/* Skills chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {['React', 'Figma', 'UX Research', 'SQL', 'Python'].map(skill => (
                    <div key={skill} style={{
                      fontSize: '10px',
                      padding: '3px 10px',
                      borderRadius: '99px',
                      border: '1px solid #e5e7eb',
                      color: '#374151',
                      display: 'flex',
                    }}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 24px',
              borderTop: '1px solid #f3f4f6',
            }}>
              <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                Ejemplo generado a partir de un CV real
              </div>
              <div style={{ fontSize: '10px', color: '#0DA1A4', fontWeight: 700 }}>
                atskiller.manfred.com
              </div>
            </div>

          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'sans-serif', data: fontData, weight: 400 }],
    }
  )
  image.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  return image
}
