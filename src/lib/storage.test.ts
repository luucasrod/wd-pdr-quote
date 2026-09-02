import { afterEach, describe, expect, it, vi } from "vitest"

import { escreverJson, lerJson, STORAGE_ERROR_EVENT } from "@/lib/storage"

afterEach(() => vi.unstubAllGlobals())

describe("storage seguro", () => {
  it("continua sem lançar quando a escrita falha", () => {
    const dispatchEvent = vi.fn()
    vi.stubGlobal("localStorage", { setItem: () => { throw new DOMException("QuotaExceededError") } })
    vi.stubGlobal("window", { dispatchEvent })
    vi.stubGlobal("Event", class {
      type: string
      constructor(type: string) { this.type = type }
    })

    expect(escreverJson("key", { value: 1 })).toBe(false)
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: STORAGE_ERROR_EVENT }))
  })

  it("devolve o fallback quando a leitura falha", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new DOMException("SecurityError") } })
    expect(lerJson("key", 45)).toBe(45)
  })
})
