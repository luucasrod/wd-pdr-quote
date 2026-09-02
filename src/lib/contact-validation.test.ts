import { describe, expect, it } from "vitest"
import { isPlausiblePhone } from "@/lib/contact-validation"

describe("contact validation", () => {
  it.each(["912 345 678", "+351 936 077 121", "(351) 936-077-121"])("accepts plausible phone %s", (phone) => expect(isPlausiblePhone(phone)).toBe(true))
  it.each(["abc", "123", "+351 hello", "1234567890123456"])("rejects invalid phone %s", (phone) => expect(isPlausiblePhone(phone)).toBe(false))
})
