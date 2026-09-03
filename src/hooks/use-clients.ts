import { useCallback, useEffect, useState } from "react"
import { useLocalCollection, newRecordId } from "@/hooks/use-local-collection"
import { clientFromRow, clientToRow } from "@/lib/mappers"
import { supabase } from "@/lib/supabase"
import type { Client } from "@/types/crm"

const EVENT = "wd-pdr-remote-clients-change"

export function useClients() {
  const local = useLocalCollection<Client>("wd-pdr-clients")
  const [remote, setRemote] = useState<Client[]>([])
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<Error | null>(null)
  const refresh = useCallback(async () => {
    if (!supabase) return
    const result = await supabase.from("clients").select("*").order("created_at", { ascending: false })
    if (result.error) setError(result.error); else { setRemote(result.data.map(clientFromRow)); setError(null) }
    setLoading(false)
  }, [])
  useEffect(() => { if (!supabase) return; void refresh(); window.addEventListener(EVENT, refresh); return () => window.removeEventListener(EVENT, refresh) }, [refresh])
  const changed = () => window.dispatchEvent(new Event(EVENT))
  function createClient(data: Omit<Client, "id" | "createdAt">) {
    const client: Client = { ...data, id: supabase ? crypto.randomUUID() : newRecordId("client"), createdAt: Date.now() }
    if (!supabase) local.add(client); else { setRemote((items) => [client, ...items]); void supabase.from("clients").insert(clientToRow(client)).then(({ error: e }) => { if (e) setError(e); changed() }) }
    return client
  }
  function updateClient(id: string, patch: Partial<Client>) {
    if (!supabase) return local.update(id, patch)
    const current = remote.find((item) => item.id === id); if (!current) return
    setRemote((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item))
    void supabase.from("clients").update(clientToRow({ ...current, ...patch })).eq("id", id).then(({ error: e }) => { if (e) setError(e); changed() })
  }
  function removeClient(id: string) {
    if (!supabase) return local.remove(id)
    setRemote((items) => items.filter((item) => item.id !== id))
    void supabase.from("clients").delete().eq("id", id).then(({ error: e }) => { if (e) setError(e); changed() })
  }
  const clients = supabase ? remote : local.items
  return { clients, createClient, updateClient, removeClient, getClientById: (id: string | null) => id ? clients.find((item) => item.id === id) : undefined, loading, error }
}
