import { describe, expect, it } from "vitest"

import { DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES, lookupPriceTable } from "@/data/pricing/pricing-config"
import { computePartBreakdown, computeQuoteTotals } from "@/lib/pricing"
import type { PartId } from "@/data/pricing/parts"
import type { DamageMarker, DamageSeverity } from "@/types/vehicle"

function markers(partId: PartId, severities: DamageSeverity[]): DamageMarker[] {
  return severities.map((severity, index) => ({
    id: `${partId}-${index}`,
    x: 0.5,
    y: 0.5,
    severity,
    size: 1,
    partId,
  }))
}

function totals(overrides: Partial<Parameters<typeof computeQuoteTotals>[0]> = {}) {
  return computeQuoteTotals({
    markers: markers("hood", ["minor"]),
    partTypeByPart: {},
    hourlyTable: DEFAULT_HOURLY_TABLE,
    partTypes: DEFAULT_PART_TYPES,
    finishHours: 0,
    surcharge1: false,
    surcharge2: false,
    hourlyRate: 45,
    ...overrides,
  })
}

describe("lookupPriceTable", () => {
  it("respeita as fronteiras 0/1, 2/3 e o limite 700+", () => {
    const table = DEFAULT_HOURLY_TABLE.minor
    expect(lookupPriceTable(table, 0)).toBe(0)
    expect(lookupPriceTable(table, 1)).toBe(0.16)
    expect(lookupPriceTable(table, 2)).toBe(0.32)
    expect(lookupPriceTable(table, 3)).toBe(0.32)
    expect(lookupPriceTable(table, 700)).toBe(6.15)
    expect(lookupPriceTable(table, 701)).toBe(6.15)
  })
})

describe("computePartBreakdown", () => {
  it("desempata a favor da severidade mais alta", () => {
    const severeTie = computePartBreakdown(
      markers("hood", ["minor", "medium", "severe"]), {}, DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES
    )[0]
    const mediumTie = computePartBreakdown(
      markers("hood", ["minor", "medium"]), {}, DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES
    )[0]
    expect(severeTie.predominantSeverity).toBe("severe")
    expect(mediumTie.predominantSeverity).toBe("medium")
  })

  it("aplica a percentagem do tipo de peça", () => {
    const [part] = computePartBreakdown(
      markers("hood", ["minor"]), { hood: "aluminum" }, DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES
    )
    expect(part.partTypePercent).toBe(20)
    expect(part.hours).toBeCloseTo(part.baseHours * 1.2)
  })

  it("usa 0% para um tipo de peça inexistente sem lançar erro", () => {
    const [part] = computePartBreakdown(
      markers("hood", ["minor"]), { hood: "missing" }, DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES
    )
    expect(part.partTypeId).toBe("standard")
    expect(part.partTypePercent).toBe(0)
    expect(part.hours).toBe(part.baseHours)
  })
})

describe("computeQuoteTotals", () => {
  it("limita a preparação a 1 AW para seis peças", () => {
    const partIds: PartId[] = ["hood", "roof", "doorFrontLeft", "doorFrontRight", "doorRearLeft", "doorRearRight"]
    const result = totals({ markers: partIds.flatMap((partId) => markers(partId, ["minor"])) })
    expect(result.prepHours).toBe(1)
  })

  it("aplica independentemente os dois agravamentos de 25%", () => {
    const none = totals()
    const first = totals({ surcharge1: true })
    const both = totals({ surcharge1: true, surcharge2: true })
    expect(first.surchargeHours).toBeCloseTo(none.subtotalHours * 0.25)
    expect(both.surchargeHours).toBeCloseTo(none.subtotalHours * 0.5)
    expect(both.totalHours - none.totalHours).toBeCloseTo(none.subtotalHours * 0.5)
  })

  it("aplica o desconto antes do IVA e mantem o IVA desligado neutro", () => {
    const base = totals({ hourlyRate: 50 })
    const withoutVat = totals({ hourlyRate: 50, discount: 10, vatEnabled: false, vatRate: 23 })
    const withVat = totals({ hourlyRate: 50, discount: 10, vatEnabled: true, vatRate: 23 })

    expect(base.totalPrice).toBeCloseTo(base.totalHours * 50)
    expect(withoutVat.totalPrice).toBeCloseTo(base.totalPrice - 10)
    expect(withVat.vatAmount).toBeCloseTo((base.totalPrice - 10) * 0.23)
    expect(withVat.totalPrice).toBeCloseTo((base.totalPrice - 10) * 1.23)
  })

  it("calcula 1522 com IVA a 23% como 1872,06", () => {
    const result = totals({ markers: [], finishHours: 30.44, hourlyRate: 50, vatEnabled: true, vatRate: 23 })
    expect(result.subtotalPrice).toBeCloseTo(1522)
    expect(result.vatAmount).toBeCloseTo(350.06)
    expect(result.totalPrice).toBeCloseTo(1872.06)
  })
})
