import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: React.ReactNode
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  layoutId: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  layoutId,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-[var(--radius-lg)] border border-[var(--color-ink-100)] bg-[var(--color-ink-50)] p-1",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-[var(--radius-md)] px-3.5 py-2 text-[13px] font-medium transition-colors duration-200",
              active ? "text-[var(--color-ink-950)]" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-800)]"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-soft-sm)]"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
