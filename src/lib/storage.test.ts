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

  it.each(["wd-pdr-quotes", "wd-pdr-clients", "wd-pdr-insurers"])(
    "recupera a coleção %s de JSON inválido ou shape errado",
    (key) => {
      const fallback = [{ id: "default" }]
      let raw = "lixo"
      vi.stubGlobal("localStorage", { getItem: () => raw })
      expect(lerJson(key, fallback)).toBe(fallback)

      raw = JSON.stringify("continua a não ser uma coleção")
      expect(lerJson(key, fallback)).toBe(fallback)
    },
  )

  it.each([
    ["wd-pdr-part-types", []],
    ["wd-pdr-price-table-hourly", { minor: [], moderate: [], severe: [] }],
  ])("recupera a configuração estruturada %s", (key, fallback) => {
    let raw = "lixo"
    vi.stubGlobal("localStorage", { getItem: () => raw })
    expect(lerJson(key, fallback)).toBe(fallback)

    raw = JSON.stringify("shape errado")
    expect(lerJson(key, fallback)).toBe(fallback)
  })

  it("mantém compatibilidade com o idioma legado em texto simples", () => {
    vi.stubGlobal("localStorage", { getItem: () => "pt" })
    expect(lerJson("wd-pdr-language", null)).toBe("pt")
  })
})
