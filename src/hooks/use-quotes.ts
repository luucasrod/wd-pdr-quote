import { useCallback, useEffect, useState } from "react"
import { useLocalCollection, newRecordId } from "@/hooks/use-local-collection"
import { quoteFromRow, quoteToRow } from "@/lib/mappers"
import { supabase } from "@/lib/supabase"
import type { SavedQuote } from "@/types/crm"

export const QUOTES_REMOTE_CHANGE_EVENT = "wd-pdr-remote-quotes-change"

export function useQuotes() {
  const local = useLocalCollection<SavedQuote>("wd-pdr-quotes")
  const [remote, setRemote] = useState<SavedQuote[]>([])
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<Error | null>(null)
  const refresh = useCallback(async () => {
    if (!supabase) return
    const result = await supabase.from("quotes").select("*").order("created_at", { ascending: false })
    if (result.error) setError(result.error); else { setRemote(result.data.map(quoteFromRow)); setError(null) }
    setLoading(false)
  }, [])
  useEffect(() => { if (!supabase) return; void refresh(); window.addEventListener(QUOTES_REMOTE_CHANGE_EVENT, refresh); return () => window.removeEventListener(QUOTES_REMOTE_CHANGE_EVENT, refresh) }, [refresh])
  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client.channel("new-customer-quotes").on("postgres_changes", { event: "INSERT", schema: "public", table: "quotes", filter: "source=eq.customer" }, () => { void refresh() }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [refresh])
  const changed = () => window.dispatchEvent(new Event(QUOTES_REMOTE_CHANGE_EVENT))
  function createQuote(data: Omit<SavedQuote, "id" | "createdAt" | "updatedAt">) {
    const now = Date.now()
    const quote: SavedQuote = { ...data, id: supabase ? crypto.randomUUID() : newRecordId("quote"), createdAt: now, updatedAt: now }
    if (!supabase) local.add(quote); else { setRemote((items) => [quote, ...items]); void supabase.from("quotes").insert(quoteToRow(quote)).then(({ error: e }) => { if (e) setError(e); changed() }) }
    return quote
  }
  function updateQuote(id: string, patch: Partial<SavedQuote>) {
    if (!supabase) return local.update(id, { ...patch, updatedAt: Date.now() })
    const current = remote.find((item) => item.id === id); if (!current) return
    const updated = { ...current, ...patch, updatedAt: Date.now() }
    setRemote((items) => items.map((item) => item.id === id ? updated : item))
    void supabase.from("quotes").update(quoteToRow(updated)).eq("id", id).then(({ error: e }) => { if (e) setError(e); changed() })
  }
  function removeQuote(id: string) {
    if (!supabase) return local.remove(id)
    setRemote((items) => items.filter((item) => item.id !== id))
    void supabase.from("quotes").delete().eq("id", id).then(({ error: e }) => { if (e) setError(e); changed() })
  }
  const quotes = [...(supabase ? remote : local.items)].sort((a, b) => b.createdAt - a.createdAt)
  return { quotes, createQuote, updateQuote, removeQuote, getQuoteById: (id: string | null) => id ? quotes.find((item) => item.id === id) : undefined, loading, error }
}
