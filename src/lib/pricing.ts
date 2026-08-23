import type { DamageMarker, DamageSeverity } from "@/types/vehicle"
import type { PartId } from "@/data/pricing/parts"
import type { PriceTable } from "@/data/pricing/pricing-config"
import { lookupPriceTable } from "@/data/pricing/pricing-config"

/** Prep time: 0.2 AW per damaged part, capped at 1 AW per vehicle. */
export const PREP_HOURS_PER_PART = 0.2
export const PREP_HOURS_MAX_PER_VEHICLE = 1.0

export interface PartBreakdown {
  partId: PartId
  countMinor: number
  countMedium: number
  countSevere: number
  totalCount: number
  predominantSeverity: DamageSeverity
  isAlu: boolean
  baseHours: number
  hours: number // baseHours with alu surcharge applied
}

export interface QuoteTotals {
  parts: PartBreakdown[]
  subtotalHours: number
  prepHours: number
  finishHours: number
  surcharge1: boolean
  surcharge2: boolean
  surchargeHours: number
  totalHours: number
  hourlyRate: number
  totalPrice: number
}

function predominantSeverity(minor: number, medium: number, severe: number): DamageSeverity {
  if (severe >= medium && severe >= minor && severe > 0) return "severe"
  if (medium >= minor && medium > 0) return "medium"
  return "minor"
}

export function computePartBreakdown(
  markers: DamageMarker[],
  aluParts: Set<PartId>,
  hourlyTable: PriceTable,
  aluSurchargePercent: number
): PartBreakdown[] {
  const byPart = new Map<PartId, DamageMarker[]>()
  for (const m of markers) {
    const list = byPart.get(m.partId) ?? []
    list.push(m)
    byPart.set(m.partId, list)
  }

  const result: PartBreakdown[] = []
  for (const [partId, list] of byPart) {
    const countMinor = list.filter((m) => m.severity === "minor").length
    const countMedium = list.filter((m) => m.severity === "medium").length
    const countSevere = list.filter((m) => m.severity === "severe").length
    const totalCount = list.length
    const severity = predominantSeverity(countMinor, countMedium, countSevere)
    const isAlu = aluParts.has(partId)
    const baseHours = lookupPriceTable(hourlyTable[severity], totalCount)
    const hours = isAlu ? baseHours * (1 + aluSurchargePercent / 100) : baseHours

    result.push({
      partId,
      countMinor,
      countMedium,
      countSevere,
      totalCount,
      predominantSeverity: severity,
      isAlu,
      baseHours,
      hours,
    })
  }

  return result.sort((a, b) => a.partId.localeCompare(b.partId))
}

export function computeQuoteTotals(options: {
  markers: DamageMarker[]
  aluParts: Set<PartId>
  hourlyTable: PriceTable
  aluSurchargePercent: number
  finishHours: number
  surcharge1: boolean
  surcharge2: boolean
  hourlyRate: number
}): QuoteTotals {
  const { markers, aluParts, hourlyTable, aluSurchargePercent, finishHours, surcharge1, surcharge2, hourlyRate } = options
  const parts = computePartBreakdown(markers, aluParts, hourlyTable, aluSurchargePercent)

  const subtotalHours = parts.reduce((sum, p) => sum + p.hours, 0)
  const damagedPartCount = parts.filter((p) => p.totalCount > 0).length
  const prepHours = Math.min(PREP_HOURS_PER_PART * damagedPartCount, PREP_HOURS_MAX_PER_VEHICLE)
  const surchargeHours = (surcharge1 ? subtotalHours * 0.25 : 0) + (surcharge2 ? subtotalHours * 0.25 : 0)
  const totalHours = subtotalHours + prepHours + finishHours + surchargeHours
  const totalPrice = totalHours * hourlyRate

  return {
    parts,
    subtotalHours,
    prepHours,
    finishHours,
    surcharge1,
    surcharge2,
    surchargeHours,
    totalHours,
    hourlyRate,
    totalPrice,
  }
}
