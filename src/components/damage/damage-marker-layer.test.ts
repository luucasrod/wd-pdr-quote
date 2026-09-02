import { describe, expect, it } from "vitest"

import { normalizePointer } from "@/lib/coordinates"

describe("normalizePointer", () => {
  it("mantém a coordenada normalizada no centro sem zoom", () => {
    expect(normalizePointer({ left: 10, top: 20, width: 400, height: 200 }, 210, 120)).toEqual({ x: 0.5, y: 0.5 })
  })

  it("converte corretamente o retângulo transformado por zoom e arrasto", () => {
    const transformedRect = { left: -140, top: -30, width: 800, height: 400 }
    expect(normalizePointer(transformedRect, 60, 70)).toEqual({ x: 0.25, y: 0.25 })
  })
})
