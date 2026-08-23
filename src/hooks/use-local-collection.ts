import { useEffect, useState } from "react"

let idCounter = 0
export function newRecordId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

/** Generic CRUD-over-localStorage collection, used for clients, insurers, saved quotes. */
export function useLocalCollection<T extends { id: string }>(storageKey: string) {
  const [items, setItems] = useState<T[]>(() => load<T>(storageKey))

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
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
