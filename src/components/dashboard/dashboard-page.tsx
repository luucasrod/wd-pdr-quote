import { FileText, Clock3, CheckCircle2, Euro, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/i18n/language-context"
import { useQuotes } from "@/hooks/use-quotes"
import { useClients } from "@/hooks/use-clients"
import { StatusBadge } from "@/components/quote/status-badge"

interface DashboardPageProps {
  onNewQuote: () => void
  onOpenQuote: (id: string) => void
  onViewAllQuotes: () => void
}

export function DashboardPage({ onNewQuote, onOpenQuote, onViewAllQuotes }: DashboardPageProps) {
  const { t, language } = useLanguage()
  const { quotes } = useQuotes()
  const { getClientById } = useClients()

  const now = new Date()
  const thisMonth = quotes.filter((q) => {
    const d = new Date(q.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const pending = quotes.filter((q) => q.status === "draft" || q.status === "sent")
  const approved = quotes.filter((q) => q.status === "approved")
  const revenue = approved.reduce((sum, q) => sum + q.totals.totalPrice, 0)

  const stats = [
    { label: t.dashboard.statQuotesMonth, value: thisMonth.length, icon: FileText, tone: "var(--color-ink-950)" },
    { label: t.dashboard.statPending, value: pending.length, icon: Clock3, tone: "var(--color-amber-500)" },
    { label: t.dashboard.statApproved, value: approved.length, icon: CheckCircle2, tone: "var(--color-severity-minor)" },
    {
      label: t.dashboard.statRevenue,
      value: revenue.toLocaleString(language, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
      icon: Euro,
      tone: "var(--color-severity-minor)",
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
            {t.dashboard.title}
          </h1>
          <p className="text-[14.5px] text-[var(--color-ink-500)]">{t.dashboard.subtitle}</p>
        </div>
        <Button variant="accent" size="md" onClick={onNewQuote}>
          {t.common.newQuote}
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]"
              style={{ backgroundColor: `color-mix(in srgb, ${s.tone} 12%, white)` }}
            >
              <s.icon className="h-4.5 w-4.5" style={{ color: s.tone }} />
            </div>
            <p className="text-[19px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)]">{s.value}</p>
            <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-400)]">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[var(--color-ink-950)]">{t.dashboard.recentQuotes}</h2>
        <button
          type="button"
          onClick={onViewAllQuotes}
          className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--color-amber-700)] hover:text-[var(--color-amber-800)]"
        >
          {t.dashboard.viewAll}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {quotes.length === 0 ? (
        <Card className="px-4 py-10 text-center text-[13.5px] text-[var(--color-ink-400)]">{t.quotesList.empty}</Card>
      ) : (
        <div className="space-y-2">
          {quotes.slice(0, 5).map((q) => {
            const client = getClientById(q.clientId)
            return (
              <Card
                key={q.id}
                className="flex cursor-pointer items-center justify-between gap-3 p-3.5 transition-shadow hover:shadow-[var(--shadow-soft-sm)]"
                onClick={() => onOpenQuote(q.id)}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[var(--color-ink-900)]">
                    {client?.name ?? t.quotesList.noClient}
                  </p>
                  <p className="text-[11.5px] text-[var(--color-ink-400)]">
                    {t.typeSelect.types[q.vehicleType].label} · {new Date(q.createdAt).toLocaleDateString(language)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-[13.5px] font-semibold tabular-nums text-[var(--color-ink-950)]">
                    {q.totals.totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
                  </span>
                  <StatusBadge status={q.status} />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
