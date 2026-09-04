import type { Client, Insurer, SavedQuote } from "@/types/crm"
import type { ClientRow, InsurerRow, QuoteRow, ShopSettingsRow } from "@/lib/database.types"

const toMillis = (value: string) => new Date(value).getTime()
const toIso = (value: number) => new Date(value).toISOString()

export const clientFromRow = (row: ClientRow): Client => ({
  id: row.id, name: row.name, phone: row.phone ?? "", email: row.email ?? "",
  nif: row.nif ?? "", address: row.address ?? "", createdAt: toMillis(row.created_at),
  ...(row.city ? { city: row.city } : {}),
  ...(row.postal_code ? { postalCode: row.postal_code } : {}),
  ...(row.country ? { country: row.country } : {}),
})

export const clientToRow = (client: Client): ClientRow => ({
  id: client.id, name: client.name, phone: client.phone, email: client.email,
  nif: client.nif, address: client.address, city: client.city ?? "", postal_code: client.postalCode ?? "",
  country: client.country ?? "", legacy_id: null, created_at: toIso(client.createdAt),
})

export const insurerFromRow = (row: InsurerRow): Insurer => ({
  id: row.id, name: row.name, phone: row.phone ?? "", email: row.email ?? "",
  notes: row.notes ?? "", createdAt: toMillis(row.created_at),
})

export const insurerToRow = (insurer: Insurer): InsurerRow => ({
  id: insurer.id, name: insurer.name, phone: insurer.phone, email: insurer.email,
  notes: insurer.notes, legacy_id: null, created_at: toIso(insurer.createdAt),
})

export const quoteFromRow = (row: QuoteRow): SavedQuote => ({
  id: row.id, createdAt: toMillis(row.created_at), updatedAt: toMillis(row.updated_at),
  status: row.status, clientId: row.client_id, insurerId: row.insurer_id,
  vehicleType: row.vehicle_type, plate: row.plate ?? "", notes: row.notes ?? "",
  ...(row.vehicle_brand ? { vehicleBrand: row.vehicle_brand } : {}),
  ...(row.vehicle_model ? { vehicleModel: row.vehicle_model } : {}),
  ...(row.vehicle_color ? { vehicleColor: row.vehicle_color } : {}),
  markersByView: row.markers_by_view, partTypeByPart: row.part_type_by_part,
  parts: row.part_breakdown, finishHours: row.finish_hours, surcharge1: row.surcharge1,
  surcharge2: row.surcharge2, totals: row.totals, partCount: row.part_count,
  markerCount: row.marker_count,
  source: row.source, seenAt: row.seen_at ? toMillis(row.seen_at) : null,
})

export const quoteToRow = (quote: SavedQuote): QuoteRow => ({
  id: quote.id, created_at: toIso(quote.createdAt), updated_at: toIso(quote.updatedAt),
  status: quote.status, source: quote.source ?? "owner", client_id: quote.clientId, insurer_id: quote.insurerId,
  vehicle_type: quote.vehicleType, plate: quote.plate, vehicle_brand: quote.vehicleBrand ?? "",
  vehicle_model: quote.vehicleModel ?? "", vehicle_color: quote.vehicleColor ?? "", notes: quote.notes,
  markers_by_view: quote.markersByView ?? {}, part_type_by_part: quote.partTypeByPart ?? {},
  part_breakdown: quote.parts ?? [], finish_hours: quote.finishHours ?? 0,
  surcharge1: quote.surcharge1 ?? false, surcharge2: quote.surcharge2 ?? false,
  totals: quote.totals, part_count: quote.partCount, marker_count: quote.markerCount,
  seen_at: quote.seenAt ? toIso(quote.seenAt) : null, legacy_id: null,
})

export const pricingFromRow = (row: ShopSettingsRow) => ({
  hourlyTable: row.hourly_table, partTypes: row.part_types, hourlyRate: Number(row.hourly_rate),
})
