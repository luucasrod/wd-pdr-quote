import { useLayoutEffect, useRef, useState } from "react"
import type { ViewImage } from "@/data/vehicle/vehicle-images"
import type { DamageMarker } from "@/types/vehicle"
import { DamageMarkerLayer } from "@/components/damage/damage-marker-layer"

interface VehicleImageViewProps {
  image: ViewImage
  markers: DamageMarker[]
  onAddMarker: (x: number, y: number) => void
  onCycleMarker: (id: string) => void
  label: string
}

/**
 * Renders the vehicle photo and a marker-overlay that is measured to match the
 * image's actual rendered box (not just its container) — the image is letterboxed
 * via intrinsic sizing (max-width/max-height + auto), so the overlay must track it
 * precisely or clicks/markers would drift from the visible car.
 */
export function VehicleImageView({ image, markers, onAddMarker, onCycleMarker, label }: VehicleImageViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [box, setBox] = useState({ left: 0, top: 0, width: 0, height: 0 })

  useLayoutEffect(() => {
    function measure() {
      if (!imgRef.current || !containerRef.current) return
      const imgRect = imgRef.current.getBoundingClientRect()
      const contRect = containerRef.current.getBoundingClientRect()
      setBox({
        left: imgRect.left - contRect.left,
        top: imgRect.top - contRect.top,
        width: imgRect.width,
        height: imgRect.height,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [image.src])

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center">
      <img
        ref={imgRef}
        src={image.src}
        alt=""
        draggable={false}
        onLoad={() => {
          if (!imgRef.current || !containerRef.current) return
          const imgRect = imgRef.current.getBoundingClientRect()
          const contRect = containerRef.current.getBoundingClientRect()
          setBox({
            left: imgRect.left - contRect.left,
            top: imgRect.top - contRect.top,
            width: imgRect.width,
            height: imgRect.height,
          })
        }}
        className="select-none"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          filter: "grayscale(1) contrast(1.08) brightness(1.03) drop-shadow(0 18px 20px rgba(10,10,11,0.18))",
        }}
      />
      {box.width > 0 && (
        <div className="absolute" style={{ left: box.left, top: box.top, width: box.width, height: box.height }}>
          <DamageMarkerLayer markers={markers} onAddMarker={onAddMarker} onCycleMarker={onCycleMarker} label={label} />
        </div>
      )}
    </div>
  )
}
