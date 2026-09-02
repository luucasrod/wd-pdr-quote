import { useRef, useState } from "react"

export function useUndoableDelete<T extends { id: string }>(onDelete: (id: string) => void, delay = 5000) {
  const [pending, setPending] = useState<T | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function schedule(item: T) {
    if (timer.current) clearTimeout(timer.current)
    setPending(item)
    timer.current = setTimeout(() => {
      onDelete(item.id)
      setPending(null)
      timer.current = null
    }, delay)
  }

  function undo() {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    setPending(null)
  }

  return { pending, schedule, undo }
}
