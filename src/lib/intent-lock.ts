export function createIntentLock() {
  let locked = false
  return {
    tryAcquire() {
      if (locked) return false
      locked = true
      return true
    },
    release() { locked = false },
  }
}
