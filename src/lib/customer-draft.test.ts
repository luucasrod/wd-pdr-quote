import { afterEach, describe, expect, it, vi } from "vitest"
import { CUSTOMER_DRAFT_KEY, CUSTOMER_DRAFT_TTL_MS, loadCustomerDraft, saveCustomerDraft } from "@/lib/customer-draft"

afterEach(() => vi.unstubAllGlobals())

describe("customer draft", () => {
  it("restores a valid draft for 24 hours", () => {
    const values = new Map<string, string>()
    vi.stubGlobal("localStorage", { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v), removeItem: (k: string) => values.delete(k) })
    const draft = { step: "contact" as const, vehicleType: "sedan" as const, view: "right" as const, markersByView: {}, contact: { name: "Ana", phone: "912345678", email: "", plate: "", notes: "" }, consent: true }
    saveCustomerDraft(draft, 100)
    expect(loadCustomerDraft(100)?.contact.name).toBe("Ana")
    expect(loadCustomerDraft(100 + CUSTOMER_DRAFT_TTL_MS)).toBeNull()
  })

  it("discards malformed drafts", () => {
    const removeItem = vi.fn()
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify({ expiresAt: 999, step: "wrong" }), removeItem })
    expect(loadCustomerDraft(100)).toBeNull()
    expect(removeItem).toHaveBeenCalledWith(CUSTOMER_DRAFT_KEY)
  })
})
