import { useState } from "react"

const STORAGE_KEY = "wd-pdr-oficina-auth"
const PASSCODE = import.meta.env.VITE_OFICINA_PASSCODE ?? "wdpdr2026"

/** Simple client-side passcode gate for /oficina — no backend, just a localStorage flag. */
export function useOficinaAuth() {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(STORAGE_KEY) === "true")

  function tryUnlock(code: string): boolean {
    if (code !== PASSCODE) return false
    localStorage.setItem(STORAGE_KEY, "true")
    setUnlocked(true)
    return true
  }

  return { unlocked, tryUnlock }
}
