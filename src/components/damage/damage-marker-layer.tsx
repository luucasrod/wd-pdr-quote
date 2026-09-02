import { useRef } from "react"
import { AnimatePresence } from "framer-motion"
import type { DamageMarker as DamageMarkerType } from "@/types/vehicle"
import { DamageMarker } from "@/components/damage/damage-marker"
import { useLanguage } from "@/i18n/language-context"
import { normalizePointer } from "@/lib/coordinates"

interface DamageMarkerLayerProps {
  markers: DamageMarkerType[]
  onAddMarker?: (x: number, y: number) => void
  onCycleMarker?: (id: string) => void
  label: string
}

export function DamageMarkerLayer({ markers, onAddMarker, onCycleMarker, label }: DamageMarkerLayerProps) {
  const { t } = useLanguage()
  const overlayRef = useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!overlayRef.current || !onAddMarker) return
    const rect = overlayRef.current.getBoundingClientRect()
    const { x, y } = normalizePointer(rect, e.clientX, e.clientY)
    if (x < 0 || x > 1 || y < 0 || y > 1) return
    onAddMarker(x, y)
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleClick}
      role={onAddMarker ? "button" : "img"}
      aria-label={onAddMarker ? `${t.viewer.markingAreaLabel} — ${label}. ${t.viewer.markingAreaInstruction}` : label}
      className={onAddMarker ? "absolute inset-0 cursor-crosshair" : "pointer-events-none absolute inset-0"}
    >
      <AnimatePresence>
        {markers.map((marker, i) => (
          <DamageMarker key={marker.id} marker={marker} onCycle={onCycleMarker} index={i} />
        ))}
      </AnimatePresence>
    </div>
  )
}
