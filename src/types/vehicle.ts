import type { PartId } from "@/data/pricing/parts"

export type VehicleView = "top" | "front" | "rear" | "left" | "right"

export type VehicleType = "sedan" | "suv" | "wagon" | "compact" | "van"

export type DamageSeverity = "minor" | "medium" | "severe"

export interface DamageMarker {
  id: string
  /** Relative coordinates 0..1 within the current view's canvas, so it's resolution independent */
  x: number
  y: number
  severity: DamageSeverity
  /** Relative brush-size multiplier, 0.5 (small ding) to 5 (large dent) */
  size: number
  /** Body part this dent belongs to, for the WKO hail-repair pricing table lookup */
  partId: PartId
}

export const SEVERITY_SEQUENCE: DamageSeverity[] = ["minor", "medium", "severe"]

export const SEVERITY_META: Record<
  DamageSeverity,
  { label: string; color: string; soft: string }
> = {
  minor: { label: "Amolgadela Ligeira", color: "var(--color-severity-minor)", soft: "var(--color-severity-minor-soft)" },
  medium: { label: "Amolgadela Média", color: "var(--color-severity-medium)", soft: "var(--color-severity-medium-soft)" },
  severe: { label: "Amolgadela Severa", color: "var(--color-severity-severe)", soft: "var(--color-severity-severe-soft)" },
}

export const DEFAULT_MARKER_SIZE = 1
export const MIN_MARKER_SIZE = 0.5
export const MAX_MARKER_SIZE = 5

export type ViewMarkers = Partial<Record<VehicleView, DamageMarker[]>>
