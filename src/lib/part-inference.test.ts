import { describe, expect, it } from "vitest"

import { inferPartId } from "@/lib/part-inference"
import type { VehicleType } from "@/types/vehicle"

describe("inferPartId", () => {
  const rightQuarterBoundaries: Array<[VehicleType, number]> = [
    ["sedan", 0.18],
    ["suv", 0.20],
    ["wagon", 0.18],
    ["compact", 0.20],
    ["van", 0.16],
  ]

  it.each(rightQuarterBoundaries)("respeita a fronteira lateral de %s", (vehicleType, boundary) => {
    expect(inferPartId(vehicleType, "right", boundary - 0.001, 0.5)).toBe("quarterPanelRight")
    expect(inferPartId(vehicleType, "right", boundary, 0.5)).toBe("doorRearRight")
  })

  it("distingue intencionalmente a porta de uma van e de um sedan no mesmo ponto", () => {
    expect(inferPartId("sedan", "right", 0.5, 0.5)).toBe("doorFrontRight")
    expect(inferPartId("van", "right", 0.5, 0.5)).toBe("doorRearRight")
  })

  it("mantém as fronteiras verticais de tejadilho e soleira por tipo", () => {
    expect(inferPartId("van", "right", 0.5, 0.16)).toBe("roofRailRight")
    expect(inferPartId("van", "right", 0.5, 0.18)).toBe("doorRearRight")
    expect(inferPartId("compact", "left", 0.5, 0.77)).toBe("sillLeft")
  })
})
