import { motion } from "framer-motion"
import { Wrench, Euro } from "lucide-react"
import type { PartBreakdown, QuoteTotals } from "@/lib/pricing"
import type { PartId } from "@/data/pricing/parts"
import type { PartTypeDef } from "@/data/pricing/pricing-config"
import { SEVERITY_META } from "@/types/vehicle"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/language-context"
import type { Language, TranslationShape } from "@/i18n/translations"

const CURRENCY_LOCALE: Record<Language, string> = {
  pt: "pt-PT",
  en: "en-GB",
  de: "de-AT",
  fr: "fr-FR",
  es: "es-ES",
}

interface QuotePricingPanelProps {
  totals: QuoteTotals
  partTypes: PartTypeDef[]
  onPartTypeChange: (partId: PartId, typeId: string) => void
  finishHours: number
  onFinishHoursChange: (value: number) => void
  surcharge1: boolean
  onSurcharge1Change: (value: boolean) => void
  surcharge2: boolean
  onSurcharge2Change: (value: boolean) => void
  hourlyRate: number
  onHourlyRateChange: (value: number) => void
}

export function QuotePricingPanel({
  totals,
  partTypes,
  onPartTypeChange,
  finishHours,
  onFinishHoursChange,
  surcharge1,
  onSurcharge1Change,
  surcharge2,
  onSurcharge2Change,
  hourlyRate,
  onHourlyRateChange,
}: QuotePricingPanelProps) {
  const { t, language } = useLanguage()
  const hasParts = totals.parts.length > 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>{t.pricing.title}</CardTitle>
          <CardDescription>{t.pricing.subtitle}</CardDescription>
        </div>
        <Wrench className="h-4.5 w-4.5 shrink-0 text-[var(--color-ink-300)]" />
      </CardHeader>

      <CardContent className="pt-0">
        {!hasParts ? (
          <p className="rounded-[var(--radius-md)] bg-[var(--color-ink-50)] px-4 py-6 text-center text-[13px] text-[var(--color-ink-400)]">
            {t.pricing.emptyState}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--color-ink-100)] text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--color-ink-400)]">
                  <th className="py-2 pr-2">{t.pricing.colPart}</th>
                  <th className="px-2 py-2 text-center">{t.pricing.colMinor}</th>
                  <th className="px-2 py-2 text-center">{t.pricing.colMedium}</th>
                  <th className="px-2 py-2 text-center">{t.pricing.colSevere}</th>
                  <th className="px-2 py-2 text-center">{t.pricing.colAluminum}</th>
                  <th className="py-2 pl-2 text-right">{t.pricing.colAW}</th>
                </tr>
              </thead>
              <tbody>
                {totals.parts.map((p) => (
                  <PartRow
                    key={p.partId}
                    part={p}
                    partTypes={partTypes}
                    t={t}
                    onPartTypeChange={(typeId) => onPartTypeChange(p.partId, typeId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 space-y-2 border-t border-[var(--color-ink-100)] pt-4">
          <TotalRow label={t.pricing.subtotal} value={`${totals.subtotalHours.toFixed(2)} AW`} />
          <TotalRow label={t.pricing.prep} value={`${totals.prepHours.toFixed(2)} AW`} />

          <div className="flex items-center justify-between gap-3 py-1">
            <label className="text-[13px] text-[var(--color-ink-600)]">{t.pricing.finish}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={finishHours}
              onChange={(e) => onFinishHoursChange(Math.max(0, Number(e.target.value) || 0))}
              className="w-24 rounded-[var(--radius-sm)] border border-[var(--color-ink-200)] px-2.5 py-1.5 text-right text-[13px] outline-none focus:border-[var(--color-amber-400)]"
            />
          </div>

          <label className="flex items-center justify-between gap-3 py-1">
            <span className="text-[13px] text-[var(--color-ink-600)]">{t.pricing.surcharge1}</span>
            <input
              type="checkbox"
              checked={surcharge1}
              onChange={(e) => onSurcharge1Change(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-amber-500)]"
            />
          </label>
          <label className="flex items-center justify-between gap-3 py-1">
            <span className="text-[13px] text-[var(--color-ink-600)]">{t.pricing.surcharge2}</span>
            <input
              type="checkbox"
              checked={surcharge2}
              onChange={(e) => onSurcharge2Change(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-amber-500)]"
            />
          </label>

          <div className="flex items-center justify-between border-t border-[var(--color-ink-100)] pt-3 text-[14px] font-semibold text-[var(--color-ink-950)]">
            <span>{t.pricing.totalAW}</span>
            <motion.span key={totals.totalHours.toFixed(2)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
              {totals.totalHours.toFixed(2)} AW
            </motion.span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-600)]">
              <Euro className="h-3.5 w-3.5 text-[var(--color-ink-400)]" />
              {t.pricing.hourlyRate}
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                step={1}
                value={hourlyRate}
                onChange={(e) => onHourlyRateChange(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 rounded-[var(--radius-sm)] border border-[var(--color-ink-200)] px-2.5 py-1.5 text-right text-[13px] outline-none focus:border-[var(--color-amber-400)]"
              />
              <span className="text-[12px] text-[var(--color-ink-400)]">€/AW</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-ink-950)] px-4 py-3.5 text-white">
            <span className="text-[13px] font-medium text-white/70">{t.pricing.totalQuote}</span>
            <motion.span
              key={totals.totalPrice.toFixed(2)}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              className="text-[20px] font-bold tabular-nums"
            >
              {totals.totalPrice.toLocaleString(CURRENCY_LOCALE[language], { style: "currency", currency: "EUR" })}
            </motion.span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PartRow({
  part,
  partTypes,
  t,
  onPartTypeChange,
}: {
  part: PartBreakdown
  partTypes: PartTypeDef[]
  t: TranslationShape
  onPartTypeChange: (typeId: string) => void
}) {
  const label = t.parts[part.partId]
  return (
    <tr className="border-b border-[var(--color-ink-50)] last:border-0">
      <td className="py-2 pr-2 font-medium text-[var(--color-ink-800)]">{label}</td>
      <SeverityCell count={part.countMinor} variant="minor" active={part.predominantSeverity === "minor"} />
      <SeverityCell count={part.countMedium} variant="medium" active={part.predominantSeverity === "medium"} />
      <SeverityCell count={part.countSevere} variant="severe" active={part.predominantSeverity === "severe"} />
      <td className="px-2 py-2 text-center">
        <select
          value={part.partTypeId}
          onChange={(event) => onPartTypeChange(event.target.value)}
          className="max-w-36 rounded-[var(--radius-sm)] border border-[var(--color-ink-200)] bg-white px-2 py-1 text-[12px] outline-none focus:border-[var(--color-amber-400)]"
          aria-label={`${label} — ${t.pricing.colAluminum}`}
        >
          {partTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label || type.id}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 pl-2 text-right font-semibold tabular-nums text-[var(--color-ink-950)]">
        <span>{part.hours.toFixed(2)}</span>
        {part.partTypePercent !== 0 && (
          <span className="ml-1 text-[10px] font-medium text-[var(--color-amber-700)]">
            {part.partTypePercent > 0 ? "+" : ""}{part.partTypePercent}%
          </span>
        )}
      </td>
    </tr>
  )
}

function SeverityCell({
  count,
  variant,
  active,
}: {
  count: number
  variant: "minor" | "medium" | "severe"
  active: boolean
}) {
  const meta = SEVERITY_META[variant]
  return (
    <td className="px-2 py-2 text-center tabular-nums">
      <span
        className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-semibold", active && count > 0 && "ring-2")}
        style={{
          background: count > 0 ? meta.soft : "transparent",
          color: count > 0 ? "var(--color-ink-800)" : "var(--color-ink-300)",
          ["--tw-ring-color" as string]: meta.color,
        }}
      >
        {count}
      </span>
    </td>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-[13px]">
      <span className="text-[var(--color-ink-600)]">{label}</span>
      <span className="font-medium tabular-nums text-[var(--color-ink-900)]">{value}</span>
    </div>
  )
}
