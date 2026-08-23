import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="modal-overlay fixed inset-0 z-40 bg-[var(--color-ink-950)]/40 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-describedby={description ? undefined : "modal-no-desc"}
          className={cn(
            "modal-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-[var(--color-ink-100)] bg-white shadow-[var(--shadow-soft-lg)] outline-none",
            className
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--color-ink-100)] px-6 py-5">
            <div>
              <DialogPrimitive.Title className="text-[16px] font-bold tracking-[-0.01em] text-[var(--color-ink-950)]">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-0.5 text-[12.5px] text-[var(--color-ink-500)]">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-ink-400)] transition-colors hover:bg-[var(--color-ink-100)] hover:text-[var(--color-ink-900)]"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
