import { useState } from "react"
import { Plus, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/i18n/language-context"
import { useQuotes } from "@/hooks/use-quotes"
import { useClients } from "@/hooks/use-clients"
import { StatusBadge } from "@/components/quote/status-badge"
import { DeleteDialog, UndoDelete } from "@/components/ui/delete-dialog"
import { useUndoableDelete } from "@/hooks/use-undoable-delete"
import type { SavedQuote } from "@/types/crm"

interface QuotesListPageProps {
  onNewQuote: () => void
  onOpenQuote: (id: string) => void
}

export function QuotesListPage({ onNewQuote, onOpenQuote }: QuotesListPageProps) {
  const { t, language } = useLanguage()
  const { quotes, removeQuote } = useQuotes()
  const { getClientById } = useClients()
  const [deleteTarget, setDeleteTarget] = useState<SavedQuote | null>(null)
  const deletion = useUndoableDelete(removeQuote)
  const visibleQuotes = quotes.filter((quote) => quote.id !== deletion.pending?.id)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
            {t.quotesList.title}
          </h1>
          <p className="text-[14.5px] text-[var(--color-ink-500)]">{t.quotesList.subtitle}</p>
        </div>
        <Button variant="accent" size="md" onClick={onNewQuote}>
          <Plus className="h-4 w-4" />
          {t.quotesList.newQuote}
        </Button>
      </div>

      {visibleQuotes.length === 0 ? (
        <Card className="px-4 py-14 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-[var(--color-ink-200)]" />
          <p className="text-[13.5px] text-[var(--color-ink-400)]">{t.quotesList.empty}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--color-ink-100)] text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--color-ink-400)]">
                  <th className="px-4 py-3">{t.quotesList.colClient}</th>
                  <th className="px-4 py-3">{t.quotesList.colVehicle}</th>
                  <th className="px-4 py-3">{t.quotesList.colDate}</th>
                  <th className="px-4 py-3">{t.quotesList.colStatus}</th>
                  <th className="px-4 py-3 text-right">{t.quotesList.colTotal}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {visibleQuotes.map((q) => {
                  const client = getClientById(q.clientId)
                  return (
                    <tr
                      key={q.id}
                      className="cursor-pointer border-b border-[var(--color-ink-50)] transition-colors last:border-0 hover:bg-[var(--color-ink-50)]"
                      onClick={() => onOpenQuote(q.id)}
                    >
                      <td className="px-4 py-3 font-medium text-[var(--color-ink-800)]">
                        {client?.name ?? t.quotesList.noClient}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-600)]">
                        {t.typeSelect.types[q.vehicleType].label}
                        {q.plate && <span className="ml-1.5 text-[var(--color-ink-400)]">· {q.plate}</span>}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-500)]">
                        {new Date(q.createdAt).toLocaleDateString(language)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-[var(--color-ink-950)]">
                        {q.totals.totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteTarget(q)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-300)] hover:bg-[var(--color-severity-severe-soft)] hover:text-[var(--color-severity-severe)]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <DeleteDialog
        name={deleteTarget ? (getClientById(deleteTarget.clientId)?.name ?? `#${deleteTarget.id.slice(-8).toUpperCase()}`) : null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deletion.schedule(deleteTarget); setDeleteTarget(null) }}
      />
      <UndoDelete visible={Boolean(deletion.pending)} onUndo={deletion.undo} />
    </div>
  )
}
