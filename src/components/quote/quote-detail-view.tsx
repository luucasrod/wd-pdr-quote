import { ArrowLeft, Printer, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"
import { useQuotes } from "@/hooks/use-quotes"
import { useClients } from "@/hooks/use-clients"
import { useInsurers } from "@/hooks/use-insurers"
import { StatusBadge } from "@/components/quote/status-badge"
import { QuotePrintDocument } from "@/components/quote/quote-print-document"
import type { QuoteStatus } from "@/types/crm"

interface QuoteDetailViewProps {
  quoteId: string
  onBack: () => void
}

const STATUSES: QuoteStatus[] = ["draft", "sent", "approved", "rejected"]

export function QuoteDetailView({ quoteId, onBack }: QuoteDetailViewProps) {
  const { t, language } = useLanguage()
  const { getQuoteById, updateQuote, removeQuote } = useQuotes()
  const { getClientById } = useClients()
  const { getInsurerById } = useInsurers()

  const quote = getQuoteById(quoteId)
  if (!quote) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13.5px] text-[var(--color-ink-400)]">{t.quotesList.empty}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.quoteMeta.backToList}
        </Button>
      </div>
    )
  }

  const client = getClientById(quote.clientId)
  const insurer = getInsurerById(quote.insurerId)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.quoteMeta.backToList}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            {t.quoteMeta.print}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm(t.quotesList.deleteConfirm)) {
                removeQuote(quote.id)
                onBack()
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t.quotesList.delete}
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>{t.typeSelect.types[quote.vehicleType].label}</CardTitle>
            <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-500)]">
              {new Date(quote.createdAt).toLocaleDateString(language)} · #{quote.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <StatusBadge status={quote.status} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-0">
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-400)]">
                {t.quoteMeta.clientLabel}
              </p>
              <p className="mt-1 text-[var(--color-ink-800)]">{client?.name ?? t.quotesList.noClient}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-400)]">
                {t.quoteMeta.insurerLabel}
              </p>
              <p className="mt-1 text-[var(--color-ink-800)]">{insurer?.name ?? t.quoteMeta.none}</p>
            </div>
            {quote.plate && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-400)]">
                  {t.quoteMeta.plateLabel}
                </p>
                <p className="mt-1 text-[var(--color-ink-800)]">{quote.plate}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-400)]">
                {t.quoteMeta.statusLabel}
              </p>
              <Select
                value={quote.status}
                onChange={(e) => updateQuote(quote.id, { status: e.target.value as QuoteStatus })}
                className="mt-1 h-8 text-[12.5px]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {
                      { draft: t.quotesList.statusDraft, sent: t.quotesList.statusSent, approved: t.quotesList.statusApproved, rejected: t.quotesList.statusRejected }[
                        s
                      ]
                    }
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {quote.notes && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-400)]">{t.quoteMeta.notesLabel}</p>
              <p className="mt-1 whitespace-pre-wrap text-[13px] text-[var(--color-ink-700)]">{quote.notes}</p>
            </div>
          )}

          <div className="space-y-1.5 border-t border-[var(--color-ink-100)] pt-4 text-[13px]">
            <Row label={t.pricing.subtotal} value={`${quote.totals.subtotalHours.toFixed(2)} AW`} />
            <Row label={t.pricing.prep} value={`${quote.totals.prepHours.toFixed(2)} AW`} />
            <Row label={t.pricing.finish} value={`${quote.totals.finishHours.toFixed(2)} AW`} />
            <Row label={t.pricing.totalAW} value={`${quote.totals.totalHours.toFixed(2)} AW`} />
          </div>

          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-ink-950)] px-4 py-3.5 text-white">
            <span className="text-[13px] font-medium text-white/70">{t.pricing.totalQuote}</span>
            <span className="text-[20px] font-bold tabular-nums">
              {quote.totals.totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
            </span>
          </div>
        </CardContent>
      </Card>

      <QuotePrintDocument quote={quote} client={client} insurer={insurer} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-ink-600)]">{label}</span>
      <span className="font-medium tabular-nums text-[var(--color-ink-900)]">{value}</span>
    </div>
  )
}
