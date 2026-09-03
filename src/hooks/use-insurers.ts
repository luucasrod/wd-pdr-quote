import { useCallback, useEffect, useState } from "react"
import { useLocalCollection, newRecordId } from "@/hooks/use-local-collection"
import { insurerFromRow, insurerToRow } from "@/lib/mappers"
import { supabase } from "@/lib/supabase"
import type { Insurer } from "@/types/crm"

const EVENT = "wd-pdr-remote-insurers-change"

export function useInsurers() {
  const local = useLocalCollection<Insurer>("wd-pdr-insurers")
  const [remote, setRemote] = useState<Insurer[]>([])
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<Error | null>(null)
  const refresh = useCallback(async () => {
    if (!supabase) return
    const result = await supabase.from("insurers").select("*").order("created_at", { ascending: false })
    if (result.error) setError(result.error); else { setRemote(result.data.map(insurerFromRow)); setError(null) }
    setLoading(false)
  }, [])
  useEffect(() => { if (!supabase) return; void refresh(); window.addEventListener(EVENT, refresh); return () => window.removeEventListener(EVENT, refresh) }, [refresh])
  const changed = () => window.dispatchEvent(new Event(EVENT))
  function createInsurer(data: Omit<Insurer, "id" | "createdAt">) {
    const insurer: Insurer = { ...data, id: supabase ? crypto.randomUUID() : newRecordId("insurer"), createdAt: Date.now() }
    if (!supabase) local.add(insurer); else { setRemote((items) => [insurer, ...items]); void supabase.from("insurers").insert(insurerToRow(insurer)).then(({ error: e }) => { if (e) setError(e); changed() }) }
    return insurer
  }
  function updateInsurer(id: string, patch: Partial<Insurer>) {
    if (!supabase) return local.update(id, patch)
    const current = remote.find((item) => item.id === id); if (!current) return
    setRemote((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item))
    void supabase.from("insurers").update(insurerToRow({ ...current, ...patch })).eq("id", id).then(({ error: e }) => { if (e) setError(e); changed() })
  }
  function removeInsurer(id: string) {
    if (!supabase) return local.remove(id)
    setRemote((items) => items.filter((item) => item.id !== id))
    void supabase.from("insurers").delete().eq("id", id).then(({ error: e }) => { if (e) setError(e); changed() })
  }
  const insurers = supabase ? remote : local.items
  return { insurers, createInsurer, updateInsurer, removeInsurer, getInsurerById: (id: string | null) => id ? insurers.find((item) => item.id === id) : undefined, loading, error }
}
