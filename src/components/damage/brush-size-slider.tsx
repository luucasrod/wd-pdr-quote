import { MIN_MARKER_SIZE, MAX_MARKER_SIZE } from "@/types/vehicle"
import { useLanguage } from "@/i18n/language-context"

interface BrushSizeSliderProps {
  value: number
  onChange: (value: number) => void
}

export function BrushSizeSlider({ value, onChange }: BrushSizeSliderProps) {
  const { t } = useLanguage()
  const pct = ((value - MIN_MARKER_SIZE) / (MAX_MARKER_SIZE - MIN_MARKER_SIZE)) * 100

  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-ink-100)] bg-white px-4 py-3 shadow-[var(--shadow-soft-xs)]">
      <span
        className="shrink-0 rounded-full bg-[var(--color-amber-500)]"
        style={{ width: 8, height: 8 }}
        aria-hidden
      />
      <div className="relative flex-1">
        <input
          type="range"
          min={MIN_MARKER_SIZE}
          max={MAX_MARKER_SIZE}
          step={0.05}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="brush-slider w-full"
          style={{ ["--fill-pct" as string]: `${pct}%` }}
          aria-label={t.brush.label}
        />
      </div>
      <span className="shrink-0 rounded-full bg-[var(--color-amber-500)]" style={{ width: 22, height: 22 }} aria-hidden />
      <span className="w-11 shrink-0 text-right text-[12px] font-semibold tabular-nums text-[var(--color-ink-500)]">
        {value.toFixed(1)}x
      </span>
    </div>
  )
}
