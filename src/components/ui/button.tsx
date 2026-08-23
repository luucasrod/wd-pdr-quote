import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 ease-[var(--ease-premium)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-amber-500)] active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-ink-950)] text-white shadow-[var(--shadow-soft-sm)] hover:bg-[var(--color-ink-900)] hover:shadow-[var(--shadow-soft-md)]",
        accent:
          "bg-[var(--color-amber-500)] text-[var(--color-ink-950)] shadow-[0_4px_14px_rgba(245,166,35,0.35)] hover:bg-[var(--color-amber-400)] hover:shadow-[0_6px_20px_rgba(245,166,35,0.45)]",
        outline:
          "border border-[var(--color-ink-200)] bg-white text-[var(--color-ink-900)] hover:border-[var(--color-ink-300)] hover:bg-[var(--color-ink-50)]",
        ghost: "text-[var(--color-ink-600)] hover:bg-[var(--color-ink-100)] hover:text-[var(--color-ink-950)]",
        subtle: "bg-[var(--color-ink-100)] text-[var(--color-ink-800)] hover:bg-[var(--color-ink-200)]",
        destructive: "bg-[var(--color-severity-severe)] text-white hover:brightness-105 shadow-[var(--shadow-soft-sm)]",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
