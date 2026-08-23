import type { DamageSeverity } from "@/types/vehicle"

export interface PriceRow {
  id: string
  min: number
  max: number
  value: number
}

export type PriceTable = Record<DamageSeverity, PriceRow[]>

export interface PartTypeDef {
  id: string
  label: string
  /** surcharge percentage applied on top of the looked-up value, e.g. 20 = +20% */
  percent: number
}

function rows(pairs: Array<[number, number, number]>): PriceRow[] {
  return pairs.map(([min, max, value], i) => ({ id: `r${i}`, min, max, value }))
}

/**
 * Seeded from the official WKO hail-dent table (Lack- u. Karosseriebeirat), split
 * per severity, and extended past 400 dents following the same growth curve so the
 * table reaches ~700 like the shop's previous app. Fully editable afterwards.
 */
export const DEFAULT_HOURLY_TABLE: PriceTable = {
  minor: rows([
    [0, 1, 0.16], [2, 3, 0.32], [4, 6, 0.56], [7, 10, 0.64], [11, 15, 0.88],
    [16, 20, 1.04], [21, 25, 1.28], [26, 30, 1.44], [31, 40, 1.76], [41, 50, 2.0],
    [51, 60, 2.32], [61, 80, 2.56], [81, 100, 2.88], [101, 120, 3.2], [121, 140, 3.44],
    [141, 160, 3.92], [161, 180, 4.0], [181, 200, 4.32], [201, 225, 4.64], [226, 250, 4.85],
    [251, 275, 5.01], [276, 300, 5.17], [301, 325, 5.3], [326, 350, 5.4], [351, 400, 5.56],
    [401, 500, 5.75], [501, 600, 5.95], [601, 700, 6.15],
  ]),
  medium: rows([
    [0, 1, 0.24], [2, 3, 0.48], [4, 6, 0.8], [7, 10, 1.12], [11, 15, 1.44],
    [16, 20, 1.76], [21, 25, 2.08], [26, 30, 2.4], [31, 40, 2.88], [41, 50, 3.36],
    [51, 60, 3.84], [61, 80, 4.32], [81, 100, 4.8], [101, 120, 5.28], [121, 140, 5.76],
    [141, 160, 6.24], [161, 180, 6.72], [181, 200, 7.2], [201, 225, 7.69], [226, 250, 8.03],
    [251, 275, 8.32], [276, 300, 8.57], [301, 325, 8.78], [326, 350, 8.96], [351, 400, 9.22],
    [401, 500, 9.5], [501, 600, 9.8], [601, 700, 10.1],
  ]),
  severe: rows([
    [0, 1, 0.32], [2, 3, 0.64], [4, 6, 1.12], [7, 10, 1.6], [11, 15, 2.0],
    [16, 20, 2.48], [21, 25, 2.88], [26, 30, 3.36], [31, 40, 4.0], [41, 50, 4.72],
    [51, 60, 5.36], [61, 80, 6.08], [81, 100, 6.72], [101, 120, 7.36], [121, 140, 8.08],
    [141, 160, 8.72], [161, 180, 9.44], [181, 200, 10.08], [201, 225, 10.6], [226, 250, 11.1],
    [251, 275, 11.5], [276, 300, 11.9], [301, 325, 12.3], [326, 350, 12.6], [351, 400, 13.0],
    [401, 500, 13.5], [501, 600, 14.0], [601, 700, 14.5],
  ]),
}

/**
 * Seeded from the shop's previous app screenshots (flat € per dent-count bucket).
 * Only the first 8 buckets are confirmed from the screenshot; the rest follows the
 * same growth curve to reach ~700 — adjust freely, it's fully editable.
 */
export const DEFAULT_FIXED_TABLE: PriceTable = {
  minor: rows([
    [1, 2, 24], [3, 5, 50], [6, 10, 72], [11, 20, 108], [21, 30, 144],
    [31, 50, 180], [51, 70, 240], [71, 100, 300], [101, 120, 360], [121, 140, 420],
    [141, 160, 480], [161, 180, 540], [181, 200, 600], [201, 250, 660], [251, 300, 720],
    [301, 400, 800], [401, 500, 900], [501, 600, 1000], [601, 700, 1100],
  ]),
  medium: rows([
    [1, 2, 36], [3, 5, 75], [6, 10, 108], [11, 20, 162], [21, 30, 216],
    [31, 50, 270], [51, 70, 360], [71, 100, 450], [101, 120, 540], [121, 140, 630],
    [141, 160, 720], [161, 180, 810], [181, 200, 900], [201, 250, 990], [251, 300, 1080],
    [301, 400, 1200], [401, 500, 1350], [501, 600, 1500], [601, 700, 1650],
  ]),
  severe: rows([
    [1, 2, 48], [3, 5, 100], [6, 10, 144], [11, 20, 216], [21, 30, 288],
    [31, 50, 360], [51, 70, 480], [71, 100, 600], [101, 120, 720], [121, 140, 840],
    [141, 160, 960], [161, 180, 1080], [181, 200, 1200], [201, 250, 1320], [251, 300, 1440],
    [301, 400, 1600], [401, 500, 1800], [501, 600, 2000], [601, 700, 2200],
  ]),
}

export const DEFAULT_PART_TYPES: PartTypeDef[] = [
  { id: "standard", label: "Padrão", percent: 0 },
  { id: "aluminum", label: "Alumínio", percent: 20 },
  { id: "hardAccess", label: "Difícil Acesso / Zona de Garra", percent: 25 },
  { id: "predrück", label: "Pré-empurrar (Vordrücken)", percent: 25 },
]

export function lookupPriceTable(table: PriceRow[], count: number): number {
  if (count <= 0) return 0
  const row = table.find((r) => count >= r.min && count <= r.max)
  if (row) return row.value
  // beyond the configured range — fall back to the last row
  const last = table[table.length - 1]
  return last ? last.value : 0
}
