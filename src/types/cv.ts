export interface PersonalInfo {
  nombre:    string
  cargo:     string   // current role / professional title
  email:     string
  telefono:  string
  linkedin:  string
  ubicacion: string
  website:   string
  foto?:     string   // base64 data URL for profile photo
}

export interface ExperienciaEntry {
  id:          string
  empresa:     string
  cargo:       string
  ubicacion:   string
  fechaInicio: string
  fechaFin:    string
  actual:      boolean
  bullets:     string[]
}

export interface EducacionEntry {
  id:          string
  institucion: string
  titulo:      string
  campo:       string
  fechaInicio: string
  fechaFin:    string
  logros:      string[]
}

export interface IdiomaEntry {
  id:     string
  idioma: string
  nivel:  string
}

export interface CVData {
  personalInfo: PersonalInfo
  resumen:      string
  experiencia:  ExperienciaEntry[]
  educacion:    EducacionEntry[]
  habilidades:  string[]
  idiomas:      IdiomaEntry[]
}

export const EMPTY_CV: CVData = {
  personalInfo: {
    nombre: '', cargo: '', email: '', telefono: '',
    linkedin: '', ubicacion: '', website: '',
  },
  resumen:     '',
  experiencia: [],
  educacion:   [],
  habilidades: [],
  idiomas:     [],
}
