import { motion } from "framer-motion"
import type { DamageMarker as DamageMarkerType } from "@/types/vehicle"
import { SEVERITY_META } from "@/types/vehicle"
import { useLanguage } from "@/i18n/language-context"

interface DamageMarkerProps {
  marker: DamageMarkerType
  onCycle?: (id: string) => void
  index: number
}

const CRACKS = [
  "M0,0 L-9,-7 M-9,-7 L-14,-5",
  "M0,0 L10,-6 M10,-6 L15,-2",
  "M0,0 L-6,9 M-6,9 L-10,14",
  "M0,0 L7,10 M7,10 L6,16",
]

export function DamageMarker({ marker, onCycle, index }: DamageMarkerProps) {
  const { t } = useLanguage()
  const meta = SEVERITY_META[marker.severity]
  const severityLabel = t.severity[marker.severity]
  const size = marker.size ?? 1
  const coreSize = 16 * size
  const glowSize = 26 * size
  const crackSize = 40 * size

  return (
    <motion.button
      type="button"
      disabled={!onCycle}
      aria-label={`${index + 1}: ${severityLabel}`}
      onClick={(e) => {
        e.stopPropagation()
        onCycle?.(marker.id)
      }}
      className="group absolute z-10 flex h-11 w-11 items-center justify-center"
      style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%`, translateX: "-50%", translateY: "-50%" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 480, damping: 22 }}
      whileTap={onCycle ? { scale: 0.85 } : undefined}
    >
      {marker.severity === "severe" && (
        <motion.svg
          width={crackSize}
          height={crackSize}
          viewBox={`${-crackSize / 2} ${-crackSize / 2} ${crackSize} ${crackSize}`}
          className="pointer-events-none absolute"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <g transform={`scale(${size})`}>
            {CRACKS.map((d, i) => (
              <path key={i} d={d} stroke={meta.color} strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.75} />
            ))}
          </g>
        </motion.svg>
      )}

      <motion.span
        key={marker.severity}
        className="absolute rounded-full"
        style={{ background: meta.color, width: glowSize, height: glowSize }}
        initial={{ scale: 1.6, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 0.28 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      <motion.span
        key={`core-${marker.severity}`}
        className="relative flex items-center justify-center rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        style={{ background: meta.color, width: coreSize, height: coreSize }}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 18 }}
      />
    </motion.button>
  )
}
