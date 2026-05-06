import type { CVData } from '@/types/cv'

interface Props {
  data: CVData
  lang?: 'es' | 'en'
}

const SECTION_LABELS = {
  es: { summary: 'Resumen', skills: 'Habilidades', experience: 'Experiencia', education: 'Educación',  languages: 'Idiomas' },
  en: { summary: 'Summary', skills: 'Skills',      experience: 'Experience',  education: 'Education',  languages: 'Languages' },
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginTop: '16pt', marginBottom: '6pt' }}>
      <span style={{
        fontWeight: 700,
        fontSize: '10.5pt',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: '#111',
        whiteSpace: 'nowrap' as const,
        flexShrink: 0,
      }}>
        {title}
      </span>
      <div style={{ flex: 1, height: '0.5pt', backgroundColor: '#aaa' }} />
    </div>
  )
}

export default function HarvardTemplate({ data, lang = 'es' }: Props) {
  const { personalInfo: p, resumen, experiencia, educacion, habilidades, idiomas } = data
  const L = SECTION_LABELS[lang]

  const nameParts = (p.nombre || '').trim().split(/\s+/)
  const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : (nameParts[0] || '')

  const contactParts = [p.email, p.telefono, p.ubicacion, p.linkedin, p.website].filter(Boolean)

  return (
    <div
      id="harvard-template"
      className="bg-white text-black"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 20mm 20mm 20mm',
        fontSize: '10pt',
        lineHeight: '1.45',
        fontFamily: '"Helvetica Neue", Arial, Helvetica, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '8mm', alignItems: 'flex-start' }}>
        {p.foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.foto}
            alt="Foto de perfil"
            style={{
              width: '28mm', height: '28mm',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '0.5pt solid #ccc',
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ marginBottom: '3pt' }}>
            {p.nombre
              ? <>
                  <span style={{ fontSize: '22pt', fontWeight: 300, letterSpacing: '-0.01em' }}>{firstName} </span>
                  <span style={{ fontSize: '22pt', fontWeight: 700, letterSpacing: '-0.01em' }}>{lastName}</span>
                </>
              : <span style={{ fontSize: '22pt', fontWeight: 700, color: '#ccc' }}>Tu Nombre</span>
            }
          </div>
          {p.cargo && (
            <div style={{ fontSize: '10pt', color: '#555', marginBottom: '4pt', letterSpacing: '0.02em' }}>
              {p.cargo}
            </div>
          )}
          {contactParts.length > 0 && (
            <div style={{ fontSize: '8.5pt', color: '#666' }}>
              {contactParts.join('  |  ')}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumen && (
        <>
          <SectionHeader title={L.summary} />
          <p style={{ fontSize: '10pt', lineHeight: '1.5', margin: 0 }}>{resumen}</p>
        </>
      )}

      {/* Skills */}
      {habilidades.length > 0 && (
        <>
          <SectionHeader title={L.skills} />
          <p style={{ fontSize: '9.5pt', lineHeight: '1.6', margin: 0 }}>{habilidades.join(', ')}</p>
        </>
      )}

      {/* Experience */}
      {experiencia.length > 0 && (
        <>
          <SectionHeader title={L.experience} />
          {experiencia.map(exp => {
            const period = exp.actual
              ? `${exp.fechaInicio} – ${lang === 'en' ? 'Present' : 'Presente'}`
              : `${exp.fechaInicio} – ${exp.fechaFin}`
            const meta = [exp.empresa, exp.ubicacion].filter(Boolean).join(' · ')
            return (
              <div key={exp.id} style={{ marginBottom: '10pt', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '10pt' }}>{exp.cargo}</span>
                  <span style={{ fontSize: '9pt', color: '#555', flexShrink: 0, marginLeft: '8pt' }}>{period}</span>
                </div>
                {meta && (
                  <div style={{ fontSize: '9pt', color: '#666', marginTop: '1pt', marginBottom: '3pt' }}>{meta}</div>
                )}
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ display: 'flex', gap: '6pt', fontSize: '10pt', lineHeight: '1.45', marginTop: '2pt' }}>
                        <span style={{ flexShrink: 0 }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </>
      )}

      {/* Education */}
      {educacion.length > 0 && (
        <>
          <SectionHeader title={L.education} />
          {educacion.map(edu => {
            const period = `${edu.fechaInicio} – ${edu.fechaFin}`
            const degree = [edu.titulo, edu.campo].filter(Boolean).join(', ')
            return (
              <div key={edu.id} style={{ marginBottom: '8pt', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '10pt' }}>
                    {degree || <span style={{ color: '#ccc' }}>Título</span>}
                  </span>
                  <span style={{ fontSize: '9pt', color: '#555', flexShrink: 0, marginLeft: '8pt' }}>{period}</span>
                </div>
                {edu.institucion && (
                  <div style={{ fontSize: '9pt', color: '#666', marginTop: '1pt', marginBottom: '2pt' }}>{edu.institucion}</div>
                )}
                {edu.logros.filter(Boolean).length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                    {edu.logros.filter(Boolean).map((l, i) => (
                      <li key={i} style={{ display: 'flex', gap: '6pt', fontSize: '10pt', lineHeight: '1.45', marginTop: '2pt' }}>
                        <span style={{ flexShrink: 0 }}>•</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </>
      )}

      {/* Languages */}
      {idiomas.length > 0 && (
        <>
          <SectionHeader title={L.languages} />
          <p style={{ fontSize: '9.5pt', lineHeight: '1.6', margin: 0 }}>
            {idiomas.map(l => `${l.idioma}: ${l.nivel}`).join('  ·  ')}
          </p>
        </>
      )}
    </div>
  )
}
