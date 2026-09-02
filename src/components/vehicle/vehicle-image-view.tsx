import { useLayoutEffect, useRef, useState } from "react"
import { Minus, Plus, RotateCcw } from "lucide-react"
import type { ViewImage } from "@/data/vehicle/vehicle-images"
import type { DamageMarker } from "@/types/vehicle"
import { DamageMarkerLayer } from "@/components/damage/damage-marker-layer"
import { useLanguage } from "@/i18n/language-context"

interface VehicleImageViewProps {
  image: ViewImage
  markers: DamageMarker[]
  onAddMarker?: (x: number, y: number) => void
  onCycleMarker?: (id: string) => void
  label: string
}

export function VehicleImageView({ image, markers, onAddMarker, onCycleMarker, label }: VehicleImageViewProps) {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [box, setBox] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ distance: 0, zoom: 1, panX: 0, panY: 0, x: 0, y: 0, moved: false })
  const suppressClick = useRef(false)

  function measure() {
    if (!imgRef.current || !containerRef.current) return
    const width = imgRef.current.offsetWidth
    const height = imgRef.current.offsetHeight
    setBox({
      left: (containerRef.current.clientWidth - width) / 2,
      top: (containerRef.current.clientHeight - height) / 2,
      width,
      height,
    })
  }

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [image.src])

  function clampPan(next: { x: number; y: number }, nextZoom = zoom) {
    const maxX = (box.width * (nextZoom - 1)) / 2
    const maxY = (box.height * (nextZoom - 1)) / 2
    return { x: Math.max(-maxX, Math.min(maxX, next.x)), y: Math.max(-maxY, Math.min(maxY, next.y)) }
  }

  function setZoomLevel(next: number) {
    const level = Math.max(1, Math.min(4, next))
    setZoom(level)
    setPan((current) => level === 1 ? { x: 0, y: 0 } : clampPan(current, level))
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!onAddMarker || (event.target as HTMLElement).closest("[data-zoom-control]")) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const values = [...pointers.current.values()]
    gesture.current = { distance: 0, zoom, panX: pan.x, panY: pan.y, x: event.clientX, y: event.clientY, moved: false }
    if (values.length === 2) gesture.current.distance = Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const values = [...pointers.current.values()]
    if (values.length === 2) {
      const distance = Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y)
      if (Math.abs(distance - gesture.current.distance) > 3) gesture.current.moved = true
      setZoomLevel(gesture.current.zoom * distance / Math.max(gesture.current.distance, 1))
    } else if (zoom > 1) {
      const dx = event.clientX - gesture.current.x
      const dy = event.clientY - gesture.current.y
      if (Math.hypot(dx, dy) > 3) gesture.current.moved = true
      setPan(clampPan({ x: gesture.current.panX + dx, y: gesture.current.panY + dy }))
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    if (gesture.current.moved) {
      suppressClick.current = true
      setTimeout(() => { suppressClick.current = false }, 0)
    }
  }

  const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full touch-none items-center justify-center overflow-hidden"
      onPointerDownCapture={handlePointerDown}
      onPointerMoveCapture={handlePointerMove}
      onPointerUpCapture={handlePointerUp}
      onPointerCancelCapture={handlePointerUp}
    >
      <img
        ref={imgRef}
        src={image.src}
        alt=""
        draggable={false}
        onLoad={measure}
        className="select-none"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          filter: "grayscale(1) contrast(1.08) brightness(1.03) drop-shadow(0 18px 20px rgba(10,10,11,0.18))",
          transform,
          transformOrigin: "center",
        }}
      />
      {box.width > 0 && (
        <div className="absolute" style={{ left: box.left, top: box.top, width: box.width, height: box.height, transform, transformOrigin: "center" }}>
          <DamageMarkerLayer
            markers={markers}
            onAddMarker={(x, y) => { if (!suppressClick.current) onAddMarker?.(x, y) }}
            onCycleMarker={onCycleMarker}
            label={label}
          />
        </div>
      )}
      {onAddMarker && (
        <div data-zoom-control className="absolute bottom-2 right-2 z-30 flex gap-1 rounded-[var(--radius-md)] bg-white/95 p-1 shadow-[var(--shadow-soft-md)]">
          <button type="button" aria-label={t.viewer.zoomOut} disabled={zoom <= 1} onClick={() => setZoomLevel(zoom - 0.5)} className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] disabled:opacity-30"><Minus className="h-4 w-4" /></button>
          <button type="button" aria-label={t.viewer.resetZoom} onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }} className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)]"><RotateCcw className="h-4 w-4" /></button>
          <button type="button" aria-label={t.viewer.zoomIn} disabled={zoom >= 4} onClick={() => setZoomLevel(zoom + 0.5)} className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] disabled:opacity-30"><Plus className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  )
}
