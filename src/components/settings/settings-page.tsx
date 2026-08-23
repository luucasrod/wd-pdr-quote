import { useState } from "react"
import { ArrowLeft, Euro, Clock3, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/language-context"
import { EditablePriceTable } from "@/components/settings/editable-price-table"
import { PartTypeTable } from "@/components/settings/part-type-table"
import { usePricingConfig } from "@/hooks/use-pricing-config"

type Tab = "fixed" | "hourly" | "partTypes"

interface SettingsPageProps {
  onBack: () => void
  pricingConfig: ReturnType<typeof usePricingConfig>
}

export function SettingsPage({ onBack, pricingConfig }: SettingsPageProps) {
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>("hourly")
  const {
    hourlyTable,
    fixedTable,
    partTypes,
    hourlyOps,
    fixedOps,
    addPartType,
    updatePartType,
    removePartType,
    resetHourly,
    resetFixed,
    resetPartTypes,
  } = pricingConfig

  const tabs: { id: Tab; label: string; icon: typeof Euro }[] = [
    { id: "hourly", label: t.settingsPage.tabHourly, icon: Clock3 },
    { id: "fixed", label: t.settingsPage.tabFixed, icon: Euro },
    { id: "partTypes", label: t.settingsPage.tabPartTypes, icon: Layers },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
            {t.settingsPage.title}
          </h1>
          <p className="text-[14.5px] text-[var(--color-ink-500)]">{t.settingsPage.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.settingsPage.back}
        </Button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2.5 text-[13.5px] font-medium transition-colors",
              tab === tb.id
                ? "border-[var(--color-amber-500)] bg-[var(--color-amber-500)] text-[var(--color-ink-950)]"
                : "border-[var(--color-ink-100)] bg-white text-[var(--color-ink-600)] hover:border-[var(--color-ink-200)]"
            )}
          >
            <tb.icon className="h-4 w-4" />
            {tb.label}
          </button>
        ))}
      </div>

      <Card className="p-5 sm:p-6">
        {tab === "hourly" && (
          <EditablePriceTable
            table={hourlyTable}
            valueLabel={t.settingsPage.colHourValue}
            valueSuffix="AW"
            onAddRow={hourlyOps.addRow}
            onUpdateRow={hourlyOps.updateRow}
            onRemoveRow={hourlyOps.removeRow}
            onReset={resetHourly}
          />
        )}

        {tab === "fixed" && (
          <>
            <p className="mb-4 rounded-[var(--radius-md)] bg-[var(--color-amber-50)] px-4 py-3 text-[12.5px] text-[var(--color-amber-800)]">
              {t.settingsPage.fixedNotActiveNotice}
            </p>
            <EditablePriceTable
              table={fixedTable}
              valueLabel={t.settingsPage.colFixedValue}
              valueSuffix="€"
              onAddRow={fixedOps.addRow}
              onUpdateRow={fixedOps.updateRow}
              onRemoveRow={fixedOps.removeRow}
              onReset={resetFixed}
            />
          </>
        )}

        {tab === "partTypes" && (
          <PartTypeTable
            partTypes={partTypes}
            onAdd={addPartType}
            onUpdate={updatePartType}
            onRemove={removePartType}
            onReset={resetPartTypes}
          />
        )}
      </Card>
    </div>
  )
}
