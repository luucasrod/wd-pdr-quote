import type { VehicleType, VehicleView } from "@/types/vehicle"
import type { PartId } from "@/data/pricing/parts"

interface VehicleBoundaries {
  side: {
    roofMax: number
    sillMin: number
    right: [quarterEnd: number, rearDoorEnd: number, frontDoorEnd: number]
    left: [fenderEnd: number, frontDoorEnd: number, rearDoorEnd: number]
  }
  frontRoofMax: number
  rear: [roofEnd: number, upperEnd: number]
  top: [hoodEnd: number, frontRailEnd: number, rearRailStart: number, trunkStart: number]
}

/**
 * Normalized boundaries measured against the visible panel seams in the 25 vehicle
 * photos. Side cuts follow wheel arches and door gaps; vertical cuts follow the
 * roof edge and sill. Vans deliberately keep more of the long cargo panel in the
 * rear-door bucket, while compact and sedan door gaps occur further forward.
 */
const BOUNDARIES: Record<VehicleType, VehicleBoundaries> = {
  sedan: { side: { roofMax: 0.28, sillMin: 0.75, right: [0.18, 0.46, 0.69], left: [0.31, 0.54, 0.82] }, frontRoofMax: 0.15, rear: [0.12, 0.55], top: [0.22, 0.35, 0.72, 0.85] },
  suv: { side: { roofMax: 0.25, sillMin: 0.77, right: [0.20, 0.48, 0.72], left: [0.28, 0.52, 0.80] }, frontRoofMax: 0.14, rear: [0.14, 0.58], top: [0.24, 0.37, 0.70, 0.83] },
  wagon: { side: { roofMax: 0.20, sillMin: 0.78, right: [0.18, 0.50, 0.73], left: [0.27, 0.50, 0.82] }, frontRoofMax: 0.13, rear: [0.13, 0.57], top: [0.21, 0.34, 0.74, 0.87] },
  compact: { side: { roofMax: 0.25, sillMin: 0.76, right: [0.20, 0.47, 0.70], left: [0.30, 0.53, 0.80] }, frontRoofMax: 0.15, rear: [0.15, 0.60], top: [0.25, 0.38, 0.69, 0.82] },
  van: { side: { roofMax: 0.17, sillMin: 0.79, right: [0.16, 0.54, 0.72], left: [0.28, 0.46, 0.84] }, frontRoofMax: 0.11, rear: [0.10, 0.62], top: [0.18, 0.30, 0.78, 0.90] },
}

/** Guesses the body part from vehicle type, view and relative click position. */
export function inferPartId(vehicleType: VehicleType, view: VehicleView, x: number, y: number): PartId {
  const boundaries = BOUNDARIES[vehicleType]

  if (view === "right") {
    if (y > boundaries.side.sillMin) return "sillRight"
    if (y < boundaries.side.roofMax) return "roofRailRight"
    const [quarterEnd, rearDoorEnd, frontDoorEnd] = boundaries.side.right
    if (x < quarterEnd) return "quarterPanelRight"
    if (x < rearDoorEnd) return "doorRearRight"
    if (x < frontDoorEnd) return "doorFrontRight"
    return "fenderFrontRight"
  }

  if (view === "left") {
    if (y > boundaries.side.sillMin) return "sillLeft"
    if (y < boundaries.side.roofMax) return "roofRailLeft"
    const [fenderEnd, frontDoorEnd, rearDoorEnd] = boundaries.side.left
    if (x < fenderEnd) return "fenderFrontLeft"
    if (x < frontDoorEnd) return "doorFrontLeft"
    if (x < rearDoorEnd) return "doorRearLeft"
    return "quarterPanelLeft"
  }

  if (view === "front") return y < boundaries.frontRoofMax ? "roof" : "hood"

  if (view === "rear") {
    if (y < boundaries.rear[0]) return "roof"
    return y < boundaries.rear[1] ? "trunkUpper" : "trunkLower"
  }

  const [hoodEnd, frontRailEnd, rearRailStart, trunkStart] = boundaries.top
  if (y < hoodEnd) return "hood"
  if (y > trunkStart) return "trunkUpper"
  if (y < frontRailEnd || y > rearRailStart) return x < 0.5 ? "roofRailLeft" : "roofRailRight"
  return "roof"
}
