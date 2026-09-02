import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { DamageMarker, VehicleType, VehicleView } from "@/types/vehicle"
import { VehicleViewSelector } from "@/components/vehicle/vehicle-view-selector"
import { VehicleImageView } from "@/components/vehicle/vehicle-image-view"
import { BrushSizeSlider } from "@/components/damage/brush-size-slider"
import { VEHICLE_IMAGES } from "@/data/vehicle/vehicle-images"
import { MousePointerClick } from "lucide-react"
import { useLanguage } from "@/i18n/language-context"

const VIEW_ORDER: VehicleView[] = ["front", "right", "rear", "left", "top"]

interface VehicleViewerProps {
  vehicleType: VehicleType
  view: VehicleView
  onViewChange: (view: VehicleView) => void
  markers: DamageMarker[]
  onAddMarker: (x: number, y: number) => void
  onCycleMarker: (id: string) => void
  brushSize: number
  onBrushSizeChange: (size: number) => void
}

export function VehicleViewer({
  vehicleType,
  view,
  onViewChange,
  markers,
  onAddMarker,
  onCycleMarker,
  brushSize,
  onBrushSizeChange,
}: VehicleViewerProps) {
  const { t } = useLanguage()
  const [direction, setDirection] = useState(1)
  const prevIndex = useRef(VIEW_ORDER.indexOf(view))
  const image = VEHICLE_IMAGES[vehicleType][view]

  function handleChange(next: VehicleView) {
    if (next === view) return
    const from = VIEW_ORDER.indexOf(view)
    const to = VIEW_ORDER.indexOf(next)
    let delta = to - from
    if (Math.abs(delta) > VIEW_ORDER.length / 2) delta = delta > 0 ? delta - VIEW_ORDER.length : delta + VIEW_ORDER.length
    setDirection(delta >= 0 ? 1 : -1)
    prevIndex.current = to
    onViewChange(next)
  }

  const isTop = view === "top"

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="mb-6 flex items-center gap-3">
        <VehicleViewSelector value={view} onChange={handleChange} />
      </div>

      {/*
        A altura vem da proporcao da imagem em vez de ser fixa. Com alturas fixas
        (580/640px) e imagens de 560px sobrava uma faixa cinzenta grande por baixo
        do carro. Assim o contentor cola-se a imagem em qualquer vista e em qualquer
        largura de ecra. O max-w acompanha o limite de 840px da propria imagem.
      */}
      <div
        className="relative flex w-full max-w-[840px] items-center justify-center overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-ink-100)] bg-gradient-to-b from-white to-[var(--color-ink-50)] transition-[aspect-ratio] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ perspective: 1600, aspectRatio: image.aspect }}
      >
        <div className="pointer-events-none absolute inset-x-10 bottom-10 h-10 rounded-full bg-[var(--color-ink-950)]/10 blur-2xl" />

        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={view}
            custom={direction}
            initial={
              isTop
                ? { opacity: 0, rotateX: -22, y: -24, scale: 0.94 }
                : { opacity: 0, rotateY: direction * 34, scale: 0.94 }
            }
            animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0, scale: 1 }}
            exit={
              isTop
                ? { opacity: 0, rotateX: 18, y: 16, scale: 0.94 }
                : { opacity: 0, rotateY: -direction * 34, scale: 0.94 }
            }
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center" style={{ width: "100%", height: "100%" }}>
              <VehicleImageView
                image={image}
                markers={markers}
                onAddMarker={onAddMarker}
                onCycleMarker={onCycleMarker}
                label={t.views[view]}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11.5px] font-medium text-[var(--color-ink-500)] shadow-[var(--shadow-soft-xs)] backdrop-blur-sm">
          <MousePointerClick className="h-3.5 w-3.5 text-[var(--color-amber-500)]" />
          {t.viewer.hint}
        </div>
      </div>

      <div className="mt-4 w-full max-w-[840px]">
        <BrushSizeSlider value={brushSize} onChange={onBrushSizeChange} />
      </div>
    </div>
  )
}
