import type { CategoryAnalysis } from './analysis'

export interface LinkedInResult {
  overallScore:      number
  nombre:            string
  saludo:            string
  saludoTerminos?:   string[]
  headline:          string         // short technical summary
  completitud:       number         // 0–100 profile completeness estimate
  skillsDetectadas?: string[]
  categories:        CategoryAnalysis[]
  topPriorities:     string[]
  analyzedAt:        string
}
