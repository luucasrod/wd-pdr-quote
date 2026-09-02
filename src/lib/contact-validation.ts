export function isPlausiblePhone(value: string) {
  if (!/^\+?[\d\s().-]+$/.test(value.trim())) return false
  const digitCount = value.replace(/\D/g, "").length
  return digitCount >= 9 && digitCount <= 15
}

export function formatPhoneForReview(phone: string) {
  const digits = phone.replace(/\D/g, "")
  const groups: string[] = []
  for (let end = digits.length; end > 0; end -= 3) groups.unshift(digits.slice(Math.max(0, end - 3), end))
  return `${phone.trim().startsWith("+") ? "+" : ""}${groups.join(" ")}`
}
