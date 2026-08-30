import { useEffect, useState } from "react"
import type { DamageSeverity } from "@/types/vehicle"
import type { PriceTable, PriceRow, PartTypeDef } from "@/data/pricing/pricing-config"
import { DEFAULT_HOURLY_TABLE, DEFAULT_PART_TYPES } from "@/data/pricing/pricing-config"

const KEYS = {
  hourly: "wd-pdr-price-table-hourly",
  partTypes: "wd-pdr-part-types",
}

function loadOrDefault<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function loadPartTypes(): PartTypeDef[] {
  const saved = loadOrDefault(KEYS.partTypes, DEFAULT_PART_TYPES)
  const standard = saved.find((partType) => partType.id === "standard")
  if (!standard) return [{ id: "standard", label: "Padrão", percent: 0 }, ...saved]
  return saved.map((partType) => partType.id === "standard" ? { ...partType, percent: 0 } : partType)
}

let idCounter = 0
function newId() {
  idCounter += 1
  return `row-${Date.now()}-${idCounter}`
}

export function usePricingConfig() {
  const [hourlyTable, setHourlyTable] = useState<PriceTable>(() => loadOrDefault(KEYS.hourly, DEFAULT_HOURLY_TABLE))
  const [partTypes, setPartTypes] = useState<PartTypeDef[]>(loadPartTypes)

  useEffect(() => {
    localStorage.setItem(KEYS.hourly, JSON.stringify(hourlyTable))
  }, [hourlyTable])
  useEffect(() => {
    localStorage.setItem(KEYS.partTypes, JSON.stringify(partTypes))
  }, [partTypes])

  function makeTableOps(setTable: React.Dispatch<React.SetStateAction<PriceTable>>) {
    return {
      addRow(severity: DamageSeverity) {
        setTable((prev) => {
          const list = prev[severity]
          const lastMax = list.length > 0 ? list[list.length - 1].max : 0
          const newRow: PriceRow = { id: newId(), min: lastMax + 1, max: lastMax + 10, value: 0 }
          return { ...prev, [severity]: [...list, newRow] }
        })
      },
      updateRow(severity: DamageSeverity, id: string, patch: Partial<Omit<PriceRow, "id">>) {
        setTable((prev) => ({
          ...prev,
          [severity]: prev[severity].map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }))
      },
      removeRow(severity: DamageSeverity, id: string) {
        setTable((prev) => ({ ...prev, [severity]: prev[severity].filter((r) => r.id !== id) }))
      },
    }
  }

  function addPartType() {
    setPartTypes((prev) => [...prev, { id: newId(), label: "", percent: 0 }])
  }
  function updatePartType(id: string, patch: Partial<Omit<PartTypeDef, "id">>) {
    const safePatch = id === "standard" ? { ...patch, percent: 0 } : patch
    setPartTypes((prev) => prev.map((p) => (p.id === id ? { ...p, ...safePatch } : p)))
  }
  function removePartType(id: string) {
    if (id === "standard") return
    setPartTypes((prev) => prev.filter((p) => p.id !== id))
  }

  function resetHourly() {
    setHourlyTable(DEFAULT_HOURLY_TABLE)
  }
  function resetPartTypes() {
    setPartTypes(DEFAULT_PART_TYPES)
  }

  return {
    hourlyTable,
    partTypes,
    hourlyOps: makeTableOps(setHourlyTable),
    addPartType,
    updatePartType,
    removePartType,
    resetHourly,
    resetPartTypes,
  }
}
