import { useEffect, useState } from "react"
import { escreverJson, lerJson } from "@/lib/storage"

const COLLECTION_CHANGE_EVENT = "wd-pdr-collection-change"

let idCounter = 0
export function newRecordId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

/** Generic CRUD-over-localStorage collection, used for clients, insurers, saved quotes. */
export function useLocalCollection<T extends { id: string }>(storageKey: string) {
  const [items, setItems] = useState<T[]>(() => lerJson<T[]>(storageKey, []))

  useEffect(() => {
    const refresh = () => setItems(lerJson<T[]>(storageKey, []))
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) refresh()
    }
    const handleCollectionChange = (event: Event) => {
      if ((event as CustomEvent<string>).detail === storageKey) refresh()
    }

    refresh()
    window.addEventListener("storage", handleStorage)
    window.addEventListener(COLLECTION_CHANGE_EVENT, handleCollectionChange)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(COLLECTION_CHANGE_EVENT, handleCollectionChange)
    }
  }, [storageKey])

  function mutate(change: (current: T[]) => T[]) {
    const next = mutateLocalCollection(storageKey, change)
    setItems(next)
  }

  function add(item: T) {
    mutate((current) => [item, ...current.filter((existing) => existing.id !== item.id)])
  }
  function update(id: string, patch: Partial<T>) {
    mutate((current) => current.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }
  function remove(id: string) {
    mutate((current) => current.filter((i) => i.id !== id))
  }
  function getById(id: string | null) {
    if (!id) return undefined
    return items.find((i) => i.id === id)
  }

  return { items, add, update, remove, getById }
}

export function mutateLocalCollection<T>(storageKey: string, change: (current: T[]) => T[]) {
  const next = change(lerJson<T[]>(storageKey, []))
  escreverJson(storageKey, next)
  window.dispatchEvent(new CustomEvent(COLLECTION_CHANGE_EVENT, { detail: storageKey }))
  return next
}
