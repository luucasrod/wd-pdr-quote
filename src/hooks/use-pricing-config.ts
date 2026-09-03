import { useEffect, useState } from "react"
import type { DamageSeverity } from "@/types/vehicle"
import type { PriceTable, PriceRow, PartTypeDef } from "@/data/pricing/pricing-config"
import { DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES } from "@/data/pricing/pricing-config"
import { escreverJson, lerJson } from "@/lib/storage"
import { pricingFromRow } from "@/lib/mappers"
import { supabase } from "@/lib/supabase"

const KEYS = { hourly: "wd-pdr-price-table-hourly", partTypes: "wd-pdr-part-types", rate: "wd-pdr-hourly-rate" }
function safePartTypes(saved: PartTypeDef[]) {
  const standard = saved.find((type) => type.id === "standard")
  if (!standard) return [{ id: "standard", label: "Padrão", percent: 0 }, ...saved]
  return saved.map((type) => type.id === "standard" ? { ...type, percent: 0 } : type)
}
let idCounter = 0
const newId = () => `row-${Date.now()}-${++idCounter}`

export function usePricingConfig() {
  const [hourlyTable, setHourlyTable] = useState<PriceTable>(() => lerJson(KEYS.hourly, DEFAULT_HOURLY_TABLE))
  const [partTypes, setPartTypes] = useState<PartTypeDef[]>(() => safePartTypes(lerJson(KEYS.partTypes, DEFAULT_PART_TYPES)))
  const [hourlyRate, setHourlyRateState] = useState(() => Number(lerJson(KEYS.rate, 45)))
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!supabase) return
    void supabase.from("shop_settings").select("*").eq("id", "default").single().then(({ data, error: queryError }) => {
      if (queryError) setError(queryError)
      else { const config = pricingFromRow(data); setHourlyTable(config.hourlyTable); setPartTypes(safePartTypes(config.partTypes)); setHourlyRateState(config.hourlyRate); setError(null) }
      setLoading(false)
    })
  }, [])

  function persist(table: PriceTable, types: PartTypeDef[], rate: number) {
    if (!supabase) { escreverJson(KEYS.hourly, table); escreverJson(KEYS.partTypes, types); escreverJson(KEYS.rate, rate); return }
    void supabase.from("shop_settings").update({ hourly_table: table, part_types: types, hourly_rate: rate }).eq("id", "default").then(({ error: updateError }) => setError(updateError))
  }
  function changeTable(change: (current: PriceTable) => PriceTable) {
    setHourlyTable((current) => { const next = change(current); persist(next, partTypes, hourlyRate); return next })
  }
  const hourlyOps = {
    addRow(severity: DamageSeverity) { changeTable((prev) => { const list = prev[severity]; const lastMax = list.length ? list[list.length - 1].max : 0; const row: PriceRow = { id: newId(), min: lastMax + 1, max: lastMax + 10, value: 0 }; return { ...prev, [severity]: [...list, row] } }) },
    updateRow(severity: DamageSeverity, id: string, patch: Partial<Omit<PriceRow, "id">>) { changeTable((prev) => ({ ...prev, [severity]: prev[severity].map((row) => row.id === id ? { ...row, ...patch } : row) })) },
    removeRow(severity: DamageSeverity, id: string) { changeTable((prev) => ({ ...prev, [severity]: prev[severity].filter((row) => row.id !== id) })) },
  }
  function changePartTypes(change: (current: PartTypeDef[]) => PartTypeDef[]) { setPartTypes((current) => { const next = change(current); persist(hourlyTable, next, hourlyRate); return next }) }
  function addPartType() { changePartTypes((prev) => [...prev, { id: newId(), label: "", percent: 0 }]) }
  function updatePartType(id: string, patch: Partial<Omit<PartTypeDef, "id">>) { changePartTypes((prev) => prev.map((type) => type.id === id ? { ...type, ...patch, ...(id === "standard" ? { percent: 0 } : {}) } : type)) }
  function removePartType(id: string) { if (id !== "standard") changePartTypes((prev) => prev.filter((type) => type.id !== id)) }
  function resetHourly() { setHourlyTable(DEFAULT_HOURLY_TABLE); persist(DEFAULT_HOURLY_TABLE, partTypes, hourlyRate) }
  function resetPartTypes() { setPartTypes(DEFAULT_PART_TYPES); persist(hourlyTable, DEFAULT_PART_TYPES, hourlyRate) }
  function setHourlyRate(rate: number) { setHourlyRateState(rate); persist(hourlyTable, partTypes, rate) }

  return { hourlyTable, partTypes, hourlyRate, setHourlyRate, hourlyOps, addPartType, updatePartType, removePartType, resetHourly, resetPartTypes, loading, error }
}
