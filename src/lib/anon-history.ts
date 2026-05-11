import type { CVData } from '@/types/cv'

const STORAGE_KEY = 'anonHistory'
const MAX_ENTRIES = 10

export interface AnonHistoryEntry {
  id:             string
  fileName:       string
  fieldsRedacted: string[]
  anonymizedAt:   string
  cvData:         CVData
}

export function getAnonHistory(): AnonHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AnonHistoryEntry[]) : []
  } catch {
    return []
  }
}

export function saveToAnonHistory(entry: Omit<AnonHistoryEntry, 'id' | 'anonymizedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const history = getAnonHistory()
    const newEntry: AnonHistoryEntry = {
      ...entry,
      id:           Date.now().toString(),
      anonymizedAt: new Date().toISOString(),
    }
    const updated = [newEntry, ...history].slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function deleteFromAnonHistory(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const history = getAnonHistory().filter(e => e.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // fail silently
  }
}
