import type { VehicleView } from "@/types/vehicle"
import type { PartId } from "@/data/pricing/parts"

/**
 * Guesses which body part a click belongs to from its view + relative position.
 * This runs silently behind the free-click marking flow (no part picker shown to
 * the user) so the WKO pricing table can still group dents by part.
 */
export function inferPartId(view: VehicleView, x: number, y: number): PartId {
  if (view === "right") {
    if (y > 0.78) return "sillRight"
    if (y < 0.28) return "roofRailRight"
    if (x < 0.15) return "quarterPanelRight"
    if (x < 0.42) return "doorRearRight"
    if (x < 0.68) return "doorFrontRight"
    return "fenderFrontRight"
  }

  if (view === "left") {
    if (y > 0.78) return "sillLeft"
    if (y < 0.28) return "roofRailLeft"
    if (x < 0.32) return "fenderFrontLeft"
    if (x < 0.58) return "doorFrontLeft"
    if (x < 0.85) return "doorRearLeft"
    return "quarterPanelLeft"
  }

  if (view === "front") {
    if (y < 0.15) return "roof"
    return "hood"
  }

  if (view === "rear") {
    if (y < 0.12) return "roof"
    if (y < 0.55) return "trunkUpper"
    return "trunkLower"
  }

  // top
  if (y < 0.22) return "hood"
  if (y > 0.85) return "trunkUpper"
  if (y < 0.35 || y > 0.72) return x < 0.5 ? "roofRailLeft" : "roofRailRight"
  return "roof"
}
