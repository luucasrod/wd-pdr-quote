import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppShell } from "@/components/layout/app-shell"
import { VehicleViewer } from "@/components/vehicle/vehicle-viewer"
import { VehicleTypeSelect } from "@/components/vehicle/vehicle-type-select"
import { QuotePricingPanel } from "@/components/quote/quote-pricing-panel"
import { QuoteMetaPanel } from "@/components/quote/quote-meta-panel"
import { QuotesListPage } from "@/components/quote/quotes-list-page"
import { QuoteDetailView } from "@/components/quote/quote-detail-view"
import { ClientsPage } from "@/components/clients/clients-page"
import { InsurersPage } from "@/components/insurers/insurers-page"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { SettingsPage } from "@/components/settings/settings-page"
import { Button } from "@/components/ui/button"
import { DEFAULT_MARKER_SIZE, SEVERITY_SEQUENCE } from "@/types/vehicle"
import type { DamageSeverity, VehicleType, VehicleView, ViewMarkers } from "@/types/vehicle"
import type { PartId } from "@/data/pricing/parts"
import type { Page } from "@/types/nav"
import { computeQuoteTotals } from "@/lib/pricing"
import { inferPartId } from "@/lib/part-inference"
import { useLanguage } from "@/i18n/language-context"
import { usePricingConfig } from "@/hooks/use-pricing-config"
import { useQuotes } from "@/hooks/use-quotes"

const HOURLY_RATE_KEY = "wd-pdr-hourly-rate"

export function OwnerApp() {
  const { t } = useLanguage()
  const pricingConfig = usePricingConfig()
  const { createQuote } = useQuotes()

  const [page, setPage] = useState<Page>("dashboard")
  const [openQuoteId, setOpenQuoteId] = useState<string | null>(null)

  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null)
  const [view, setView] = useState<VehicleView>("right")
  const [markersByView, setMarkersByView] = useState<ViewMarkers>({})
  const [brushSize, setBrushSize] = useState(DEFAULT_MARKER_SIZE)
  const [partTypeByPart, setPartTypeByPart] = useState<Partial<Record<PartId, string>>>({})
  const [finishHours, setFinishHours] = useState(0)
  const [surcharge1, setSurcharge1] = useState(false)
  const [surcharge2, setSurcharge2] = useState(false)
  const [hourlyRate, setHourlyRate] = useState(() => {
    const saved = localStorage.getItem(HOURLY_RATE_KEY)
    return saved ? Number(saved) : 45
  })

  const [clientId, setClientId] = useState<string | null>(null)
  const [insurerId, setInsurerId] = useState<string | null>(null)
  const [plate, setPlate] = useState("")
  const [notes, setNotes] = useState("")
  const [justSaved, setJustSaved] = useState(false)

  const markerCounter = useRef(0)

  useEffect(() => {
    localStorage.setItem(HOURLY_RATE_KEY, String(hourlyRate))
  }, [hourlyRate])

  const markers = markersByView[view] ?? []
  const allMarkers = useMemo(() => Object.values(markersByView).flatMap((m) => m ?? []), [markersByView])

  const totals = useMemo(
    () =>
      computeQuoteTotals({
        markers: allMarkers,
        partTypeByPart,
        hourlyTable: pricingConfig.hourlyTable,
        partTypes: pricingConfig.partTypes,
        finishHours,
        surcharge1,
        surcharge2,
        hourlyRate,
      }),
    [allMarkers, partTypeByPart, pricingConfig.hourlyTable, pricingConfig.partTypes, finishHours, surcharge1, surcharge2, hourlyRate]
  )

  function addMarker(x: number, y: number) {
    markerCounter.current += 1
    const id = `m-${markerCounter.current}-${x.toFixed(4)}-${y.toFixed(4)}`
    const partId = inferPartId(view, x, y)
    setMarkersByView((prev) => ({
      ...prev,
      [view]: [...(prev[view] ?? []), { id, x, y, severity: "minor", size: brushSize, partId }],
    }))
    setJustSaved(false)
  }

  function cycleMarker(id: string) {
    setMarkersByView((prev) => {
      const current = prev[view] ?? []
      const next = []
      for (const m of current) {
        if (m.id !== id) {
          next.push(m)
          continue
        }
        const idx = SEVERITY_SEQUENCE.indexOf(m.severity)
        if (idx === SEVERITY_SEQUENCE.length - 1) continue
        next.push({ ...m, severity: SEVERITY_SEQUENCE[idx + 1] as DamageSeverity })
      }
      return { ...prev, [view]: next }
    })
    setJustSaved(false)
  }

  function setPartType(partId: PartId, typeId: string) {
    setPartTypeByPart((prev) => ({ ...prev, [partId]: typeId }))
  }

  function resetQuoteState() {
    setVehicleType(null)
    setMarkersByView({})
    setView("right")
    setPartTypeByPart({})
    setFinishHours(0)
    setSurcharge1(false)
    setSurcharge2(false)
    setClientId(null)
    setInsurerId(null)
    setPlate("")
    setNotes("")
    setJustSaved(false)
  }

  function handleNewQuote() {
    resetQuoteState()
    setPage("quote")
  }

  function handleOpenQuote(id: string) {
    setOpenQuoteId(id)
    setPage("quoteDetail")
  }

  function handleSaveQuote() {
    if (!vehicleType) return
    createQuote({
      status: "draft",
      clientId,
      insurerId,
      vehicleType,
      plate,
      notes,
      totals: {
        subtotalHours: totals.subtotalHours,
        prepHours: totals.prepHours,
        finishHours: totals.finishHours,
        surchargeHours: totals.surchargeHours,
        totalHours: totals.totalHours,
        hourlyRate: totals.hourlyRate,
        totalPrice: totals.totalPrice,
      },
      partCount: totals.parts.length,
      markerCount: allMarkers.length,
    })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  function navigate(next: Page) {
    setPage(next)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <AppShell page={page} onNavigate={navigate} onNewQuote={handleNewQuote}>
        {page === "settings" && <SettingsPage onBack={() => setPage("dashboard")} pricingConfig={pricingConfig} />}

        {page === "dashboard" && (
          <DashboardPage onNewQuote={handleNewQuote} onOpenQuote={handleOpenQuote} onViewAllQuotes={() => setPage("quotesList")} />
        )}

        {page === "quotesList" && <QuotesListPage onNewQuote={handleNewQuote} onOpenQuote={handleOpenQuote} />}

        {page === "quoteDetail" && openQuoteId && (
          <QuoteDetailView quoteId={openQuoteId} onBack={() => setPage("quotesList")} />
        )}

        {page === "clients" && <ClientsPage />}
        {page === "insurers" && <InsurersPage />}

        {page === "quote" &&
          (!vehicleType ? (
            <VehicleTypeSelect onSelect={setVehicleType} />
          ) : (
            <>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
                    {t.quotePage.title}
                  </h1>
                  <p className="text-[14.5px] text-[var(--color-ink-500)]">{t.quotePage.subtitle}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setVehicleType(null)}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t.typeSelect.types[vehicleType].label} — {t.common.changeType}
                </Button>
              </div>

              <div className="flex flex-col items-center gap-5">
                <VehicleViewer
                  vehicleType={vehicleType}
                  view={view}
                  onViewChange={setView}
                  markers={markers}
                  onAddMarker={addMarker}
                  onCycleMarker={cycleMarker}
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                <QuotePricingPanel
                  totals={totals}
                  partTypes={pricingConfig.partTypes}
                  onPartTypeChange={setPartType}
                  finishHours={finishHours}
                  onFinishHoursChange={setFinishHours}
                  surcharge1={surcharge1}
                  onSurcharge1Change={setSurcharge1}
                  surcharge2={surcharge2}
                  onSurcharge2Change={setSurcharge2}
                  hourlyRate={hourlyRate}
                  onHourlyRateChange={setHourlyRate}
                />
                <QuoteMetaPanel
                  clientId={clientId}
                  onClientIdChange={setClientId}
                  insurerId={insurerId}
                  onInsurerIdChange={setInsurerId}
                  plate={plate}
                  onPlateChange={setPlate}
                  notes={notes}
                  onNotesChange={setNotes}
                  onSave={handleSaveQuote}
                  justSaved={justSaved}
                />
              </div>
            </>
          ))}
      </AppShell>
    </TooltipProvider>
  )
}
