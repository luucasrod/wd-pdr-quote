import type { VehicleType, VehicleView, ViewMarkers } from "@/types/vehicle"

export const CUSTOMER_DRAFT_KEY = "wd-pdr-customer-draft"
export const CUSTOMER_DRAFT_TTL_MS = 24 * 60 * 60 * 1000

export interface CustomerDraftContact {
  name: string
  phone: string
  email: string
  plate: string
  notes: string
}

export interface CustomerDraft {
  expiresAt: number
  step: "vehicle" | "damage" | "contact" | "confirm"
  vehicleType: VehicleType | null
  view: VehicleView
  markersByView: ViewMarkers
  contact: CustomerDraftContact
  consent: boolean
}

export function loadCustomerDraft(now = Date.now()): CustomerDraft | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_DRAFT_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<CustomerDraft>
    if (typeof value.expiresAt !== "number" || value.expiresAt <= now ||
      !["vehicle", "damage", "contact", "confirm"].includes(value.step ?? "") ||
      ![null, "sedan", "suv", "wagon", "compact", "van"].includes(value.vehicleType ?? null) ||
      !["top", "front", "rear", "left", "right"].includes(value.view ?? "") ||
      typeof value.markersByView !== "object" || value.markersByView === null ||
      typeof value.contact !== "object" || value.contact === null) {
      localStorage.removeItem(CUSTOMER_DRAFT_KEY)
      return null
    }
    return value as CustomerDraft
  } catch {
    return null
  }
}

export function saveCustomerDraft(draft: Omit<CustomerDraft, "expiresAt">, now = Date.now()) {
  try {
    localStorage.setItem(CUSTOMER_DRAFT_KEY, JSON.stringify({ ...draft, expiresAt: now + CUSTOMER_DRAFT_TTL_MS }))
  } catch { /* The global storage warning handles unavailable localStorage elsewhere. */ }
}

export function clearCustomerDraft() {
  try { localStorage.removeItem(CUSTOMER_DRAFT_KEY) } catch { /* unavailable storage */ }
}
