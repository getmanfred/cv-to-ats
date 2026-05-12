const LAUNCH_DATE = '2026-05-12'

export function getDailyLimit(): number {
  const launch = new Date(LAUNCH_DATE + 'T00:00:00Z')
  const now = new Date()
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const launchUTC = Date.UTC(launch.getUTCFullYear(), launch.getUTCMonth(), launch.getUTCDate())
  const day = Math.floor((todayUTC - launchUTC) / 86_400_000)

  if (day <= 0) return 700
  if (day === 1) return 500
  return 400
}

export function todayKey(): string {
  const d = new Date()
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `daily:cvs:${y}-${m}-${day}`
}
