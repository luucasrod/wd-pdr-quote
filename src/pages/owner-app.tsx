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
import { useClients } from "@/hooks/use-clients"
import { houveErroStorage, STORAGE_ERROR_EVENT } from "@/lib/storage"
import { createIntentLock } from "@/lib/intent-lock"

export function OwnerApp() {
  const { t } = useLanguage()
  const pricingConfig = usePricingConfig()
  const { quotes, createQuote, updateQuote, getQuoteById, loading: quotesLoading, error: quotesError } = useQuotes()
  const { getClientById, loading: clientsLoading, error: clientsError } = useClients()

  const [page, setPage] = useState<Page>("dashboard")
  const [openQuoteId, setOpenQuoteId] = useState<string | null>(null)
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null)

  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null)
  const [view, setView] = useState<VehicleView>("right")
  const [markersByView, setMarkersByView] = useState<ViewMarkers>({})
  const [brushSize, setBrushSize] = useState(DEFAULT_MARKER_SIZE)
  const [partTypeByPart, setPartTypeByPart] = useState<Partial<Record<PartId, string>>>({})
  const [finishHours, setFinishHours] = useState(0)
  const [surcharge1, setSurcharge1] = useState(false)
  const [surcharge2, setSurcharge2] = useState(false)
  const [hourlyRate, setHourlyRate] = useState(pricingConfig.hourlyRate)
  const [storageWarning, setStorageWarning] = useState(false)

  const [clientId, setClientId] = useState<string | null>(null)
  const [insurerId, setInsurerId] = useState<string | null>(null)
  const [plate, setPlate] = useState("")
  const [notes, setNotes] = useState("")
  const [justSaved, setJustSaved] = useState(false)

  const markerCounter = useRef(0)
  const saveLock = useRef(createIntentLock())

  useEffect(() => {
    const showWarning = () => setStorageWarning(true)
    window.addEventListener(STORAGE_ERROR_EVENT, showWarning)
    if (houveErroStorage()) showWarning()
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, showWarning)
  }, [])

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
    if (!vehicleType) return
    markerCounter.current += 1
    const id = `m-${markerCounter.current}-${x.toFixed(4)}-${y.toFixed(4)}`
    const partId = inferPartId(vehicleType, view, x, y)
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
    setHourlyRate(pricingConfig.hourlyRate)
    setClientId(null)
    setInsurerId(null)
    setPlate("")
    setNotes("")
    setJustSaved(false)
    setEditingQuoteId(null)
  }

  function handleNewQuote() {
    resetQuoteState()
    setPage("quote")
  }

  function handleOpenQuote(id: string) {
    setOpenQuoteId(id)
    setPage("quoteDetail")
  }

  function handleEditQuote(id: string) {
    const quote = getQuoteById(id)
    if (!quote) return
    const restored = quote.markersByView ?? {}
    // Retomar o contador acima do maior id ja usado, senao marcadores novos colidem com os restaurados.
    const usedCounters = Object.values(restored)
      .flatMap((list) => list ?? [])
      .map((m) => Number(m.id.split("-")[1]) || 0)
    markerCounter.current = Math.max(markerCounter.current, ...usedCounters, 0)
    setVehicleType(quote.vehicleType)
    setMarkersByView(restored)
    setView("right")
    setPartTypeByPart(
      quote.partTypeByPart ?? Object.fromEntries((quote.aluParts ?? []).map((id) => [id, "aluminum"]))
    )
    setFinishHours(quote.finishHours ?? 0)
    setSurcharge1(quote.surcharge1 ?? false)
    setSurcharge2(quote.surcharge2 ?? false)
    setHourlyRate(quote.totals.hourlyRate)
    setClientId(quote.clientId)
    setInsurerId(quote.insurerId)
    setPlate(quote.plate)
    setNotes(quote.notes)
    setJustSaved(false)
    setEditingQuoteId(id)
    setPage("quote")
  }

  function handleSaveQuote() {
    if (!vehicleType || !saveLock.current.tryAcquire()) return
    const payload = {
      clientId,
      insurerId,
      vehicleType,
      plate,
      notes,
      markersByView,
      partTypeByPart,
      finishHours,
      surcharge1,
      surcharge2,
      parts: totals.parts,
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
    }
    if (editingQuoteId) {
      updateQuote(editingQuoteId, payload)
    } else {
      createQuote({ ...payload, status: "draft" })
    }
    setJustSaved(true)
    queueMicrotask(() => saveLock.current.release())
    setTimeout(() => setJustSaved(false), 2000)
  }

  function navigate(next: Page) {
    setPage(next)
  }

  if (quotesLoading || clientsLoading || pricingConfig.loading) {
    return <div className="min-h-svh animate-pulse bg-[var(--color-canvas)] p-8"><div className="mx-auto h-24 max-w-5xl rounded-[var(--radius-lg)] bg-[var(--color-ink-100)]" /></div>
  }
  if (quotesError || clientsError || pricingConfig.error) {
    return <div className="flex min-h-svh items-center justify-center bg-[var(--color-canvas)] p-8"><p role="alert" className="rounded-[var(--radius-md)] border border-[var(--color-severity-severe)] bg-white p-5 text-[var(--color-severity-severe)]">{t.errorBoundary.subtitle}</p></div>
  }

  return (
    <TooltipProvider delayDuration={200}>
      <AppShell
        page={page}
        onNavigate={navigate}
        onNewQuote={handleNewQuote}
        onOpenQuote={handleOpenQuote}
        quotes={quotes}
        getClientById={getClientById}
        newQuoteCount={quotes.filter((quote) => quote.source === "customer" && !quote.seenAt).length}
      >
        {storageWarning && (
          <div role="alert" className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-amber-500)] bg-[var(--color-amber-50)] px-4 py-3 text-[13px] text-[var(--color-ink-800)]">
            {t.common.storageWarning}
          </div>
        )}
        {page === "settings" && <SettingsPage onBack={() => setPage("dashboard")} pricingConfig={pricingConfig} />}

        {page === "dashboard" && (
          <DashboardPage onNewQuote={handleNewQuote} onOpenQuote={handleOpenQuote} onViewAllQuotes={() => setPage("quotesList")} />
        )}

        {page === "quotesList" && <QuotesListPage onNewQuote={handleNewQuote} onOpenQuote={handleOpenQuote} />}

        {page === "quoteDetail" && openQuoteId && (
          <QuoteDetailView quoteId={openQuoteId} onBack={() => setPage("quotesList")} onEdit={handleEditQuote} />
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
                    {editingQuoteId ? t.quotePage.editTitle : t.quotePage.title}
                  </h1>
                  <p className="text-[14.5px] text-[var(--color-ink-500)]">
                    {editingQuoteId ? t.quotePage.editSubtitle : t.quotePage.subtitle}
                  </p>
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
                  isEditing={editingQuoteId !== null}
                />
              </div>
            </>
          ))}
      </AppShell>
    </TooltipProvider>
  )
}
