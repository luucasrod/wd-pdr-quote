import type { VehicleType, ViewMarkers } from "@/types/vehicle"
import type { PartId } from "@/data/pricing/parts"
import type { PartBreakdown } from "@/lib/pricing"

export type QuoteStatus = "draft" | "sent" | "approved" | "rejected"

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  nif: string
  address: string
  createdAt: number
}

export interface Insurer {
  id: string
  name: string
  phone: string
  email: string
  notes: string
  createdAt: number
}

export interface SavedQuoteTotalsSnapshot {
  subtotalHours: number
  prepHours: number
  finishHours: number
  surchargeHours: number
  totalHours: number
  hourlyRate: number
  totalPrice: number
}

export interface SavedQuote {
  id: string
  createdAt: number
  updatedAt: number
  status: QuoteStatus
  clientId: string | null
  insurerId: string | null
  vehicleType: VehicleType
  plate: string
  notes: string
  /** Damage state, so reopening a quote restores the marked photo/polygon instead of just the totals. */
  markersByView?: ViewMarkers
  partTypeByPart?: Partial<Record<PartId, string>>
  /** @deprecated Modelo binario anterior ao suporte a varios tipos de peca. So leitura, para orcamentos antigos. */
  aluParts?: PartId[]
  finishHours?: number
  surcharge1?: boolean
  surcharge2?: boolean
  /** Per-part hour breakdown snapshot, for the PDF and quote detail view. Absent on quotes saved before this field existed. */
  parts?: PartBreakdown[]
  totals: SavedQuoteTotalsSnapshot
  partCount: number
  markerCount: number
  source?: "owner" | "customer"
  seenAt?: number | null
}
