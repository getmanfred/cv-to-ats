import { NextResponse } from 'next/server'

const MANFRED_API = 'https://www.getmanfred.com/api/v2/public/offers?lang=ES&onlyActive=true&currency=%E2%82%AC'

export const runtime = 'nodejs'

export interface ManfredOffer {
  id: number
  position: string
  slug: string
  salaryFrom: number
  salaryTo: number
  currency: string
  remotePercentage: number
  isFreelance: boolean
  feeRateFrom: number
  feeRateTo: number
  highlights: string[]
  locations: string[]
  company: {
    name: string
    logoUrl: string
  }
}

export async function GET() {
  try {
    const res = await fetch(MANFRED_API, { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json([])
    const raw = await res.json()
    if (!Array.isArray(raw)) return NextResponse.json([])

    const offers: ManfredOffer[] = raw.map((o: Record<string, unknown>) => {
      const co    = (o.company ?? {}) as Record<string, unknown>
      const logo  = co.logo  as Record<string, unknown> | null | undefined
      const photo = co.photo as Record<string, unknown> | null | undefined
      const logoUrl = (logo?.url ?? photo?.url ?? '') as string
      return {
        id:               Number(o.id),
        position:         String(o.position ?? ''),
        slug:             String(o.slug ?? ''),
        salaryFrom:       Number(o.salaryFrom)   || 0,
        salaryTo:         Number(o.salaryTo)     || 0,
        currency:         String(o.currency ?? '€'),
        remotePercentage: Number(o.remotePercentage ?? 0),
        isFreelance:      Boolean(o.isFreelance),
        feeRateFrom:      Number(o.feeRateFrom)  || 0,
        feeRateTo:        Number(o.feeRateTo)    || 0,
        highlights:       Array.isArray(o.highlights) ? (o.highlights as string[]) : [],
        locations:        Array.isArray(o.locations)  ? (o.locations as string[])  : [],
        company: {
          name: String(co.name ?? ''),
          logoUrl,
        },
      }
    })

    return NextResponse.json(offers)
  } catch {
    return NextResponse.json([])
  }
}
