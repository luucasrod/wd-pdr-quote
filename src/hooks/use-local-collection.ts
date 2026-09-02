import { useEffect, useState } from "react"
import { escreverJson, lerJson } from "@/lib/storage"

let idCounter = 0
export function newRecordId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

/** Generic CRUD-over-localStorage collection, used for clients, insurers, saved quotes. */
export function useLocalCollection<T extends { id: string }>(storageKey: string) {
  const [items, setItems] = useState<T[]>(() => lerJson<T[]>(storageKey, []))

  useEffect(() => {
    escreverJson(storageKey, items)
  }, [storageKey, items])

  function add(item: T) {
    setItems((prev) => [item, ...prev])
  }
  function update(id: string, patch: Partial<T>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }
  function getById(id: string | null) {
    if (!id) return undefined
    return items.find((i) => i.id === id)
  }

  return { items, add, update, remove, getById }
}
