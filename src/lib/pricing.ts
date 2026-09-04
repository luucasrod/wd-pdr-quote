import type { DamageMarker, DamageSeverity } from "@/types/vehicle"
import type { PartId } from "@/data/pricing/parts"
import type { PartTypeDef, PriceTable } from "@/data/pricing/pricing-config"
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
  partTypeId: string
  partTypeLabel: string
  partTypePercent: number
  baseHours: number
  hours: number // baseHours with the selected part-type surcharge applied
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
  subtotalPrice: number
  surchargePrice: number
  discount: number
  vatEnabled: boolean
  vatRate: number
  vatAmount: number
  totalPrice: number
}

function predominantSeverity(minor: number, medium: number, severe: number): DamageSeverity {
  if (severe >= medium && severe >= minor && severe > 0) return "severe"
  if (medium >= minor && medium > 0) return "medium"
  return "minor"
}

export function computePartBreakdown(
  markers: DamageMarker[],
  partTypeByPart: Partial<Record<PartId, string>>,
  hourlyTable: PriceTable,
  partTypes: PartTypeDef[]
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
    const requestedTypeId = partTypeByPart[partId] ?? "standard"
    const partType = partTypes.find((type) => type.id === requestedTypeId)
    const partTypeId = partType?.id ?? "standard"
    const partTypeLabel = partType?.label ?? ""
    const partTypePercent = partType?.percent ?? 0
    const baseHours = lookupPriceTable(hourlyTable[severity], totalCount)
    const hours = baseHours * (1 + partTypePercent / 100)

    result.push({
      partId,
      countMinor,
      countMedium,
      countSevere,
      totalCount,
      predominantSeverity: severity,
      partTypeId,
      partTypeLabel,
      partTypePercent,
      baseHours,
      hours,
    })
  }

  return result.sort((a, b) => a.partId.localeCompare(b.partId))
}

export function computeQuoteTotals(options: {
  markers: DamageMarker[]
  partTypeByPart: Partial<Record<PartId, string>>
  hourlyTable: PriceTable
  partTypes: PartTypeDef[]
  finishHours: number
  surcharge1: boolean
  surcharge2: boolean
  hourlyRate: number
  discount?: number
  vatEnabled?: boolean
  vatRate?: number
}): QuoteTotals {
  const { markers, partTypeByPart, hourlyTable, partTypes, finishHours, surcharge1, surcharge2, hourlyRate } = options
  const discount = Math.max(0, options.discount ?? 0)
  const vatEnabled = options.vatEnabled ?? false
  const vatRate = Math.max(0, options.vatRate ?? 0)
  const parts = computePartBreakdown(markers, partTypeByPart, hourlyTable, partTypes)

  const subtotalHours = parts.reduce((sum, p) => sum + p.hours, 0)
  const damagedPartCount = parts.filter((p) => p.totalCount > 0).length
  const prepHours = Math.min(PREP_HOURS_PER_PART * damagedPartCount, PREP_HOURS_MAX_PER_VEHICLE)
  const surchargeHours = (surcharge1 ? subtotalHours * 0.25 : 0) + (surcharge2 ? subtotalHours * 0.25 : 0)
  const totalHours = subtotalHours + prepHours + finishHours + surchargeHours
  const subtotalPrice = (subtotalHours + prepHours + finishHours) * hourlyRate
  const surchargePrice = surchargeHours * hourlyRate
  const priceBeforeTax = Math.max(0, subtotalPrice + surchargePrice - discount)
  const vatAmount = vatEnabled ? priceBeforeTax * vatRate / 100 : 0
  const totalPrice = priceBeforeTax + vatAmount

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
    subtotalPrice,
    surchargePrice,
    discount,
    vatEnabled,
    vatRate,
    vatAmount,
    totalPrice,
  }
}
