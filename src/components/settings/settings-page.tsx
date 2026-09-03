import { useState } from "react"
import { ArrowLeft, Clock3, Download, Layers, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/i18n/language-context"
import { EditablePriceTable } from "@/components/settings/editable-price-table"
import { PartTypeTable } from "@/components/settings/part-type-table"
import { usePricingConfig } from "@/hooks/use-pricing-config"
import { downloadExportData } from "@/lib/export-data"
import { importLocalData, type ImportCounts } from "@/lib/import-local-data"
import { isSupabaseConfigured } from "@/lib/supabase"

type Tab = "hourly" | "partTypes"

interface SettingsPageProps {
  onBack: () => void
  pricingConfig: ReturnType<typeof usePricingConfig>
}

export function SettingsPage({ onBack, pricingConfig }: SettingsPageProps) {
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>("hourly")
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState<ImportCounts | null>(null)
  const [importError, setImportError] = useState(false)
  const { hourlyTable, partTypes, hourlyOps, addPartType, updatePartType, removePartType, resetHourly, resetPartTypes } =
    pricingConfig

  const tabs: { id: Tab; label: string; icon: typeof Clock3 }[] = [
    { id: "hourly", label: t.settingsPage.tabHourly, icon: Clock3 },
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

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <p className="max-w-xl text-[13px] text-[var(--color-ink-500)]">{t.settingsPage.exportDescription}</p>
        <Button variant="outline" onClick={downloadExportData}>
          <Download className="h-4 w-4" />
          {t.settingsPage.exportData}
        </Button>
      </Card>
      {isSupabaseConfigured && <Card className="mt-6 p-5 sm:p-6">
        <p className="mb-4 text-[13px] text-[var(--color-ink-500)]">{t.settingsPage.importDescription}</p>
        <Button variant="outline" disabled={importing} onClick={async () => { setImporting(true); setImportError(false); try { setImported(await importLocalData()) } catch { setImportError(true) } finally { setImporting(false) } }}><Upload className="h-4 w-4" />{importing ? t.settingsPage.importingData : t.settingsPage.importData}</Button>
        {imported && <p className="mt-3 text-[12.5px] text-[var(--color-ink-600)]">{t.settingsPage.importResult.replace("{clients}", String(imported.clients)).replace("{insurers}", String(imported.insurers)).replace("{quotes}", String(imported.quotes))}</p>}
        {importError && <p role="alert" className="mt-3 text-[12.5px] text-[var(--color-severity-severe)]">{t.settingsPage.importError}</p>}
      </Card>}
    </div>
  )
}
