import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { CustomerHeader } from "@/components/customer/customer-header"
import { CustomerPriceBar } from "@/components/customer/customer-price-bar"
import { CustomerContactForm } from "@/components/customer/customer-contact-form"
import type { ContactFormData } from "@/components/customer/customer-contact-form"
import { CustomerDoneScreen } from "@/components/customer/customer-done-screen"
import { VehicleTypeSelect } from "@/components/vehicle/vehicle-type-select"
import { VehicleViewer } from "@/components/vehicle/vehicle-viewer"
import { Button } from "@/components/ui/button"
import { DEFAULT_MARKER_SIZE, SEVERITY_SEQUENCE } from "@/types/vehicle"
import type { DamageSeverity, VehicleType, VehicleView, ViewMarkers } from "@/types/vehicle"
import type { SavedQuote, Client } from "@/types/crm"
import { computeQuoteTotals } from "@/lib/pricing"
import { inferPartId } from "@/lib/part-inference"
import { useLanguage } from "@/i18n/language-context"
import { usePricingConfig } from "@/hooks/use-pricing-config"
import { useClients } from "@/hooks/use-clients"
import { useQuotes } from "@/hooks/use-quotes"
import { cn } from "@/lib/utils"
import { lerJson } from "@/lib/storage"
import { clearCustomerDraft, loadCustomerDraft, saveCustomerDraft } from "@/lib/customer-draft"
import { createIntentLock } from "@/lib/intent-lock"

const HOURLY_RATE_KEY = "wd-pdr-hourly-rate"

type Step = "vehicle" | "damage" | "contact" | "done"

export function CustomerQuotePage() {
  const initialDraft = useMemo(() => loadCustomerDraft(), [])
  const { t } = useLanguage()
  const pricingConfig = usePricingConfig()
  const { createClient } = useClients()
  const { createQuote } = useQuotes()

  const [step, setStep] = useState<Step>(initialDraft?.step ?? "vehicle")
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(initialDraft?.vehicleType ?? null)
  const [view, setView] = useState<VehicleView>(initialDraft?.view ?? "right")
  const [markersByView, setMarkersByView] = useState<ViewMarkers>(initialDraft?.markersByView ?? {})
  const [contactForm, setContactForm] = useState<ContactFormData>(initialDraft?.contact ?? { name: "", phone: "", email: "", plate: "", notes: "" })
  const [consent, setConsent] = useState(initialDraft?.consent ?? false)
  const [brushSize, setBrushSize] = useState(DEFAULT_MARKER_SIZE)
  const [submitting, setSubmitting] = useState(false)
  const [savedQuote, setSavedQuote] = useState<SavedQuote | null>(null)
  const [savedClient, setSavedClient] = useState<Client | null>(null)

  const markerCounter = useRef(0)
  const submitLock = useRef(createIntentLock())

  useEffect(() => {
    if (step === "done") return
    saveCustomerDraft({ step, vehicleType, view, markersByView, contact: contactForm, consent })
  }, [step, vehicleType, view, markersByView, contactForm, consent])

  const markers = markersByView[view] ?? []
  const allMarkers = useMemo(() => Object.values(markersByView).flatMap((m) => m ?? []), [markersByView])

  const hourlyRate = useMemo(() => {
    return Number(lerJson(HOURLY_RATE_KEY, 45))
  }, [])

  const totals = useMemo(
    () =>
      computeQuoteTotals({
        markers: allMarkers,
        partTypeByPart: {},
        hourlyTable: pricingConfig.hourlyTable,
        partTypes: pricingConfig.partTypes,
        finishHours: 0,
        surcharge1: false,
        surcharge2: false,
        hourlyRate,
      }),
    [allMarkers, pricingConfig.hourlyTable, pricingConfig.partTypes, hourlyRate]
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
  }

  function handleSubmit(data: ContactFormData) {
    if (!vehicleType || !submitLock.current.tryAcquire()) return
    setSubmitting(true)
    const client = createClient({ name: data.name, phone: data.phone, email: data.email, nif: "", address: "" })
    const quote = createQuote({
      status: "sent",
      clientId: client.id,
      insurerId: null,
      vehicleType,
      plate: data.plate,
      notes: data.notes,
      markersByView,
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
    })
    setSavedClient(client)
    setSavedQuote(quote)
    clearCustomerDraft()
    setSubmitting(false)
    setStep("done")
  }

  function handleNewRequest() {
    submitLock.current.release()
    setVehicleType(null)
    setMarkersByView({})
    setView("right")
    setSavedQuote(null)
    setSavedClient(null)
    setContactForm({ name: "", phone: "", email: "", plate: "", notes: "" })
    setConsent(false)
    clearCustomerDraft()
    setStep("vehicle")
  }

  const steps: { id: Step; label: string }[] = [
    { id: "vehicle", label: t.customer.stepVehicle },
    { id: "damage", label: t.customer.stepDamage },
    { id: "contact", label: t.customer.stepContact },
  ]
  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-svh bg-[var(--color-canvas)]">
      <CustomerHeader />

      <main className="mx-auto max-w-[720px] px-6 pb-16 pt-8">
        {step !== "done" && (
          <div className="mx-auto mb-8 flex max-w-[360px] items-center justify-between print:hidden">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-colors",
                      i <= stepIndex ? "bg-[var(--color-amber-500)] text-[var(--color-ink-950)]" : "bg-[var(--color-ink-100)] text-[var(--color-ink-400)]"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className={cn("text-[10.5px] font-medium", i <= stepIndex ? "text-[var(--color-ink-800)]" : "text-[var(--color-ink-400)]")}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("mx-1.5 mb-4 h-0.5 flex-1 rounded-full", i < stepIndex ? "bg-[var(--color-amber-500)]" : "bg-[var(--color-ink-100)]")} />
                )}
              </div>
            ))}
          </div>
        )}

        {step === "vehicle" && (
          <>
            <div className="relative mb-10 -mt-2 overflow-hidden rounded-[var(--radius-2xl)] px-6 py-12 text-center sm:py-16">
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(60% 100% at 50% 0%, rgba(245,166,35,0.14) 0%, rgba(245,166,35,0) 70%)",
                }}
              />
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-amber-200)] bg-[var(--color-amber-50)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-amber-800)]">
                WD PDR · Leiria
              </span>
              <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[32px]">
                {t.customer.heroTitle}
              </h1>
              <p className="mx-auto mt-2 max-w-[440px] text-[14.5px] text-[var(--color-ink-500)]">{t.customer.heroSubtitle}</p>
            </div>
            <VehicleTypeSelect
              onSelect={(type) => {
                setVehicleType(type)
                setStep("damage")
              }}
            />
          </>
        )}

        {step === "damage" && vehicleType && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setStep("vehicle")} className="mb-4">
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.customer.backButton}
            </Button>

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

            <div className="mt-6">
              <CustomerPriceBar totalPrice={totals.totalPrice} markerCount={allMarkers.length} onContinue={() => setStep("contact")} />
            </div>
          </>
        )}

        {step === "contact" && (
          <CustomerContactForm onBack={() => setStep("damage")} onSubmit={handleSubmit} submitting={submitting}
            form={contactForm} consent={consent} onFormChange={setContactForm} onConsentChange={setConsent} />
        )}

        {step === "done" && savedQuote && savedClient && (
          <CustomerDoneScreen
            quote={savedQuote}
            client={savedClient}
            totalPrice={savedQuote.totals.totalPrice}
            onNewRequest={handleNewRequest}
          />
        )}
      </main>
    </div>
  )
}
