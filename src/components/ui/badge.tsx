import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--color-ink-100)] text-[var(--color-ink-700)]",
        amber: "bg-[var(--color-amber-100)] text-[var(--color-amber-800)]",
        minor: "bg-[var(--color-severity-minor-soft)] text-[#1a7a4a]",
        medium: "bg-[var(--color-severity-medium-soft)] text-[#8a5a06]",
        severe: "bg-[var(--color-severity-severe-soft)] text-[#a8262b]",
        ink: "bg-[var(--color-ink-950)] text-white",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
