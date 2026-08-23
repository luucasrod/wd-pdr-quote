import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, RotateCcw } from "lucide-react"
import type { PartTypeDef } from "@/data/pricing/pricing-config"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/i18n/language-context"

interface PartTypeTableProps {
  partTypes: PartTypeDef[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Omit<PartTypeDef, "id">>) => void
  onRemove: (id: string) => void
  onReset: () => void
}

export function PartTypeTable({ partTypes, onAdd, onUpdate, onRemove, onReset }: PartTypeTableProps) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="mb-5 flex items-center justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          {t.settingsPage.reset}
        </Button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-ink-100)]">
        <div className="grid grid-cols-[1fr_140px_44px] bg-[var(--color-ink-950)] text-[13px] font-semibold text-white">
          <div className="px-4 py-2.5">{t.settingsPage.partTypeLabel}</div>
          <div className="px-4 py-2.5">{t.settingsPage.partTypePercent}</div>
          <div />
        </div>

        <div className="space-y-2 bg-[var(--color-ink-50)] p-3">
          <AnimatePresence initial={false}>
            {partTypes.map((pt) => (
              <motion.div
                key={pt.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-[1fr_140px_44px] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white px-3 py-2"
              >
                <input
                  type="text"
                  value={pt.label}
                  onChange={(e) => onUpdate(pt.id, { label: e.target.value })}
                  className="min-w-0 rounded-[var(--radius-sm)] px-2 py-1.5 text-[13px] outline-none focus:bg-[var(--color-amber-50)]"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={pt.percent}
                    onChange={(e) => onUpdate(pt.id, { percent: Number(e.target.value) })}
                    className="w-full min-w-0 rounded-[var(--radius-sm)] px-2 py-1.5 text-center text-[13px] font-semibold outline-none focus:bg-[var(--color-amber-50)]"
                  />
                  <span className="text-[12px] text-[var(--color-ink-400)]">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(pt.id)}
                  aria-label={t.settingsPage.remove}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-400)] hover:bg-[var(--color-severity-severe-soft)] hover:text-[var(--color-severity-severe)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button variant="outline" size="md" className="w-full" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {t.settingsPage.addPartType}
          </Button>
        </div>
      </div>
    </div>
  )
}
