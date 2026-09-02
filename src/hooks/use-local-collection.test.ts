import { beforeEach, describe, expect, it, vi } from "vitest"
import { mutateLocalCollection } from "@/hooks/use-local-collection"

describe("mutateLocalCollection", () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    })
    vi.stubGlobal("window", new EventTarget())
    vi.stubGlobal("CustomEvent", class<T> extends Event {
      detail: T
      constructor(type: string, init: CustomEventInit<T>) {
        super(type)
        this.detail = init.detail as T
      }
    })
  })

  it("bases concurrent snapshot mutations on the latest stored collection", () => {
    mutateLocalCollection<{ id: string }>("quotes", (current) => [{ id: "quote-A" }, ...current])
    mutateLocalCollection<{ id: string }>("quotes", (current) => [{ id: "quote-B" }, ...current])

    expect(JSON.parse(localStorage.getItem("quotes")!)).toEqual([
      { id: "quote-B" },
      { id: "quote-A" },
    ])
  })

  it("notifies other hook instances in the same document", () => {
    const listener = vi.fn()
    window.addEventListener("wd-pdr-collection-change", listener)

    mutateLocalCollection<{ id: string }>("quotes", () => [{ id: "quote-A" }])

    expect(listener).toHaveBeenCalledOnce()
  })
})
