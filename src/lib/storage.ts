export const STORAGE_ERROR_EVENT = "wd-pdr-storage-error"
let storageError = false

export function houveErroStorage() {
  return storageError
}

export function lerJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as T
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
