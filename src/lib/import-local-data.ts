import { lerJson } from "@/lib/storage"
import { quoteToRow } from "@/lib/mappers"
import { supabase } from "@/lib/supabase"
import type { Client, Insurer, SavedQuote } from "@/types/crm"

export interface ImportCounts { clients: number; insurers: number; quotes: number }

export async function importLocalData(): Promise<ImportCounts> {
  if (!supabase) throw new Error("Supabase is not configured")
  const clients = lerJson<Client[]>("wd-pdr-clients", [])
  const insurers = lerJson<Insurer[]>("wd-pdr-insurers", [])
  const quotes = lerJson<SavedQuote[]>("wd-pdr-quotes", [])
  const counts = { clients: 0, insurers: 0, quotes: 0 }

  const existingClients = await supabase.from("clients").select("id,legacy_id").not("legacy_id", "is", null)
  if (existingClients.error) throw existingClients.error
  const clientIds = new Map(existingClients.data.map((row) => [row.legacy_id, row.id]))
  for (const client of clients) {
    if (clientIds.has(client.id)) continue
    const result = await supabase.from("clients").insert({ name: client.name, phone: client.phone, email: client.email, nif: client.nif, address: client.address, legacy_id: client.id, created_at: new Date(client.createdAt).toISOString() }).select("id").single()
    if (result.error) throw result.error
    clientIds.set(client.id, result.data.id); counts.clients++
  }

  const existingInsurers = await supabase.from("insurers").select("id,legacy_id").not("legacy_id", "is", null)
  if (existingInsurers.error) throw existingInsurers.error
  const insurerIds = new Map(existingInsurers.data.map((row) => [row.legacy_id, row.id]))
  for (const insurer of insurers) {
    if (insurerIds.has(insurer.id)) continue
    const result = await supabase.from("insurers").insert({ name: insurer.name, phone: insurer.phone, email: insurer.email, notes: insurer.notes, legacy_id: insurer.id, created_at: new Date(insurer.createdAt).toISOString() }).select("id").single()
    if (result.error) throw result.error
    insurerIds.set(insurer.id, result.data.id); counts.insurers++
  }

  const existingQuotes = await supabase.from("quotes").select("legacy_id").not("legacy_id", "is", null)
  if (existingQuotes.error) throw existingQuotes.error
  const quoteIds = new Set(existingQuotes.data.map((row) => row.legacy_id))
  for (const quote of quotes) {
    if (quoteIds.has(quote.id)) continue
    const row = quoteToRow(quote)
    const { id: _id, client_id: _clientId, insurer_id: _insurerId, legacy_id: _legacyId, ...values } = row
    const result = await supabase.from("quotes").insert({ ...values, client_id: quote.clientId ? clientIds.get(quote.clientId) ?? null : null, insurer_id: quote.insurerId ? insurerIds.get(quote.insurerId) ?? null : null, legacy_id: quote.id })
    if (result.error) throw result.error
    counts.quotes++
  }

  const hourlyTable = lerJson("wd-pdr-price-table-hourly", null)
  const partTypes = lerJson("wd-pdr-part-types", null)
  const hourlyRate = Number(lerJson("wd-pdr-hourly-rate", 45))
  if (hourlyTable && partTypes) {
    const result = await supabase.from("shop_settings").update({ hourly_table: hourlyTable, part_types: partTypes, hourly_rate: hourlyRate }).eq("id", "default")
    if (result.error) throw result.error
  }
  return counts
}
