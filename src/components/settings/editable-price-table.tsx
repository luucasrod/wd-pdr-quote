import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, RotateCcw } from "lucide-react"
import type { DamageSeverity } from "@/types/vehicle"
import { isExtrapolatedPriceRow, type PriceTable } from "@/data/pricing/pricing-config"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/language-context"

interface EditablePriceTableProps {
  table: PriceTable
  valueLabel: string
  valueSuffix?: string
  onAddRow: (severity: DamageSeverity) => void
  onUpdateRow: (severity: DamageSeverity, id: string, patch: { min?: number; max?: number; value?: number }) => void
  onRemoveRow: (severity: DamageSeverity, id: string) => void
  onReset: () => void
}

const SIZE_TABS: DamageSeverity[] = ["minor", "medium", "severe"]

export function EditablePriceTable({
  table,
  valueLabel,
  valueSuffix,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onReset,
}: EditablePriceTableProps) {
  const { t } = useLanguage()
  const [active, setActive] = useState<DamageSeverity>("minor")

  const sizeLabel: Record<DamageSeverity, string> = {
    minor: t.settingsPage.sizeSmall,
    medium: t.settingsPage.sizeMedium,
    severe: t.settingsPage.sizeLarge,
  }

  const rows = table[active]

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-[var(--radius-lg)] border border-[var(--color-ink-100)] bg-[var(--color-ink-50)] p-1">
          {SIZE_TABS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
              className={cn(
                "rounded-[var(--radius-md)] px-4 py-2 text-[13px] font-medium transition-colors",
                active === s ? "bg-white text-[var(--color-ink-950)] shadow-[var(--shadow-soft-xs)]" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-800)]"
              )}
            >
              {sizeLabel[s]}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          {t.settingsPage.reset}
        </Button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-ink-100)]">
        <p className="border-b border-[var(--color-amber-200)] bg-[var(--color-amber-50)] px-4 py-3 text-[12px] text-[var(--color-amber-800)]">
          {t.settingsPage.extrapolatedSettingsWarning}
        </p>
        <div className="grid grid-cols-2 bg-[var(--color-ink-950)] text-[13px] font-semibold text-white">
          <div className="px-4 py-2.5">{t.settingsPage.colQuantity}</div>
          <div className="px-4 py-2.5">{valueLabel}</div>
        </div>

        <div className="max-h-[440px] overflow-y-auto bg-[var(--color-ink-50)] p-3">
          <div className="grid grid-cols-2 gap-2.5">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "group relative flex items-center gap-1 rounded-[var(--radius-md)] border bg-white px-2 py-2",
                    isExtrapolatedPriceRow(active, row) ? "border-[var(--color-amber-500)]" : "border-[var(--color-ink-200)]"
                  )}
                  style={{ order: rows.indexOf(row) * 2 }}
                >
                  <input
                    type="number"
                    value={row.min}
                    onChange={(e) => onUpdateRow(active, row.id, { min: Number(e.target.value) })}
                    className="w-full min-w-0 flex-1 rounded-[var(--radius-sm)] px-1 py-1 text-center text-[13px] outline-none focus:bg-[var(--color-amber-50)]"
                  />
                  {isExtrapolatedPriceRow(active, row) && (
                    <span className="absolute -left-1.5 -top-2 rounded-full bg-[var(--color-amber-500)] px-1.5 py-0.5 text-[8px] font-bold uppercase text-[var(--color-ink-950)]">
                      {t.settingsPage.extrapolatedBadge}
                    </span>
                  )}
                  <span className="text-[var(--color-ink-300)]">–</span>
                  <input
                    type="number"
                    value={row.max}
                    onChange={(e) => onUpdateRow(active, row.id, { max: Number(e.target.value) })}
                    className="w-full min-w-0 flex-1 rounded-[var(--radius-sm)] px-1 py-1 text-center text-[13px] outline-none focus:bg-[var(--color-amber-50)]"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveRow(active, row.id)}
                    aria-label={t.settingsPage.remove}
                    className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-[var(--color-severity-severe)] text-white shadow-sm group-hover:flex"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {rows.map((row) => (
              <motion.div
                key={`v-${row.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "flex items-center gap-1 rounded-[var(--radius-md)] border bg-white px-2 py-2",
                  isExtrapolatedPriceRow(active, row) ? "border-[var(--color-amber-500)]" : "border-[var(--color-ink-200)]"
                )}
                style={{ order: rows.indexOf(row) * 2 + 1 }}
              >
                <input
                  type="number"
                  step={0.01}
                  value={row.value}
                  onChange={(e) => onUpdateRow(active, row.id, { value: Number(e.target.value) })}
                  className="w-full min-w-0 flex-1 rounded-[var(--radius-sm)] px-1 py-1 text-center text-[13px] font-semibold outline-none focus:bg-[var(--color-amber-50)]"
                />
                {valueSuffix && <span className="shrink-0 text-[11px] text-[var(--color-ink-400)]">{valueSuffix}</span>}
              </motion.div>
            ))}
          </div>

          <Button variant="outline" size="md" className="mt-3 w-full" onClick={() => onAddRow(active)}>
            <Plus className="h-4 w-4" />
            {t.settingsPage.addValue}
          </Button>
        </div>
      </div>
    </div>
  )
}
