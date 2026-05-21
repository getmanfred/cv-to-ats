export interface JobSignal {
  titulo: string
  descripcion: string
}

export interface SalarioMercado {
  min: number
  max: number
  moneda: string
  nota: string
}

export interface JobAnalysisResult {
  score: number
  puesto: string
  empresa: string
  resumen: string
  veredicto: string
  senalesPositivas: JobSignal[]
  senalesAlerta: JobSignal[]
  loQueNoDice: string[]
  salarioMercado: SalarioMercado | null
  isManfredOffer?: boolean
  analyzedAt?: string
}
