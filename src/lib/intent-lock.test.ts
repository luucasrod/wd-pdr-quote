import { describe, expect, it, vi } from "vitest"
import { createIntentLock } from "@/lib/intent-lock"

describe("intent lock", () => {
  it("allows only one write when submit fires twice in the same tick", () => {
    const lock = createIntentLock()
    const write = vi.fn()
    const submit = () => { if (lock.tryAcquire()) write() }
    submit()
    submit()
    expect(write).toHaveBeenCalledOnce()
  })
})
