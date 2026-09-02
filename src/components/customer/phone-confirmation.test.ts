import { describe, expect, it } from "vitest"
import { formatPhoneForReview } from "@/lib/contact-validation"

describe("phone confirmation", () => {
  it("groups the number for easy rereading", () => {
    expect(formatPhoneForReview("912345678")).toBe("912 345 678")
    expect(formatPhoneForReview("+351936077121")).toBe("+351 936 077 121")
  })
})
