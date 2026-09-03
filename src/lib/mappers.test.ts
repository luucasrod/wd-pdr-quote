import { describe, expect, it } from "vitest"
import { clientFromRow, clientToRow, insurerFromRow, insurerToRow, quoteFromRow, quoteToRow } from "@/lib/mappers"
import type { Client, Insurer, SavedQuote } from "@/types/crm"

const createdAt = Date.parse("2026-09-03T12:00:00.000Z")

describe("Supabase mappers", () => {
  it("maps clients in both directions", () => {
    const value: Client = { id: "c1", name: "Ana", phone: "123", email: "a@b.pt", nif: "1", address: "Rua", createdAt }
    expect(clientFromRow(clientToRow(value))).toEqual(value)
  })

  it("maps insurers in both directions", () => {
    const value: Insurer = { id: "i1", name: "Seguro", phone: "123", email: "s@b.pt", notes: "nota", createdAt }
    expect(insurerFromRow(insurerToRow(value))).toEqual(value)
  })

  it("maps quotes in both directions", () => {
    const value: SavedQuote = {
      id: "q1", createdAt, updatedAt: createdAt, status: "draft", clientId: "c1", insurerId: null,
      vehicleType: "sedan", plate: "AA-00-AA", notes: "", markersByView: {}, partTypeByPart: {},
      parts: [], finishHours: 0, surcharge1: false, surcharge2: false,
      totals: { subtotalHours: 1, prepHours: .2, finishHours: 0, surchargeHours: 0, totalHours: 1.2, hourlyRate: 45, totalPrice: 54 },
      partCount: 1, markerCount: 2,
    }
    expect(quoteFromRow(quoteToRow(value))).toEqual(value)
  })
})
