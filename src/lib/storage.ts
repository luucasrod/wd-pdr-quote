export const STORAGE_ERROR_EVENT = "wd-pdr-storage-error"
let storageError = false

export function houveErroStorage() {
  return storageError
}

const collectionKeys = new Set(["wd-pdr-quotes", "wd-pdr-clients", "wd-pdr-insurers"])

function hasValidShape(key: string, value: unknown, fallback: unknown): boolean {
  if (collectionKeys.has(key)) {
    return Array.isArray(value) && value.every((item) =>
      typeof item === "object" && item !== null && typeof (item as { id?: unknown }).id === "string")
  }
  if (key === "wd-pdr-part-types") {
    return Array.isArray(value) && value.every((item) => {
      if (typeof item !== "object" || item === null) return false
      const part = item as { id?: unknown; label?: unknown; percent?: unknown }
      return typeof part.id === "string" && typeof part.label === "string" && typeof part.percent === "number"
    })
  }
  if (key === "wd-pdr-price-table-hourly") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false
    const table = value as Record<string, unknown>
    return ["minor", "moderate", "severe"].every((severity) =>
      Array.isArray(table[severity]) && table[severity].every((row) => {
        if (typeof row !== "object" || row === null) return false
        const candidate = row as { id?: unknown; min?: unknown; max?: unknown; value?: unknown }
        return typeof candidate.id === "string" && typeof candidate.min === "number" &&
          typeof candidate.max === "number" && typeof candidate.value === "number"
      }))
  }
  if (key === "wd-pdr-language") return typeof value === "string" && ["pt", "en", "de", "fr", "es"].includes(value)
  if (fallback === null) return true
  if (Array.isArray(fallback)) return Array.isArray(value)
  return typeof value === typeof fallback
}

export function lerJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    try {
      const parsed: unknown = JSON.parse(raw)
      return hasValidShape(key, parsed, fallback) ? parsed as T : fallback
    } catch {
      return hasValidShape(key, raw, fallback) ? raw as T : fallback
    }
  } catch {
    return fallback
  }
}

export function escreverJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    storageError = true
    window.dispatchEvent(new Event(STORAGE_ERROR_EVENT))
    return false
  }
}
