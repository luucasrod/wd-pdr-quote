import type { VehicleType } from "@/types/vehicle"

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
  totals: SavedQuoteTotalsSnapshot
  partCount: number
  markerCount: number
}
