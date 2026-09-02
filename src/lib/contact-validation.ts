export function isPlausiblePhone(value: string) {
  if (!/^\+?[\d\s().-]+$/.test(value.trim())) return false
  const digitCount = value.replace(/\D/g, "").length
  return digitCount >= 9 && digitCount <= 15
}
