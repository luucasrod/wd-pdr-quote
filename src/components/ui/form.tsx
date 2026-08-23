import * as React from "react"
import { cn } from "@/lib/utils"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("mb-1.5 block text-[12.5px] font-medium text-[var(--color-ink-600)]", className)}
      {...props}
    />
  )
)
Label.displayName = "Label"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white px-3 text-[13.5px] text-[var(--color-ink-900)] outline-none transition-all placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-amber-400)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white px-3 py-2.5 text-[13.5px] text-[var(--color-ink-900)] outline-none transition-all placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-amber-400)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white px-3 text-[13.5px] text-[var(--color-ink-900)] outline-none transition-all focus:border-[var(--color-amber-400)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = "Select"

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
