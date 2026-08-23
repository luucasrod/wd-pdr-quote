import { useLocalCollection, newRecordId } from "@/hooks/use-local-collection"
import type { SavedQuote } from "@/types/crm"

export function useQuotes() {
  const { items, add, update, remove, getById } = useLocalCollection<SavedQuote>("wd-pdr-quotes")

  function createQuote(data: Omit<SavedQuote, "id" | "createdAt" | "updatedAt">) {
    const now = Date.now()
    const quote: SavedQuote = { ...data, id: newRecordId("quote"), createdAt: now, updatedAt: now }
    add(quote)
    return quote
  }

  function touchQuote(id: string, patch: Partial<SavedQuote>) {
    update(id, { ...patch, updatedAt: Date.now() })
  }

  const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt)

  return { quotes: sorted, createQuote, updateQuote: touchQuote, removeQuote: remove, getQuoteById: getById }
}
