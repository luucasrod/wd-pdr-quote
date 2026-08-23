import { cn } from "@/lib/utils"
import wdLogoIcon from "@/assets/brand/wd-logo-icon.png"

/**
 * Real WD PDR crest (mechanic + car), extracted from the shop's business card.
 * Black linework only reads on light backgrounds — never place on dark fills.
 */
export function LogoMark({ className }: { className?: string }) {
  return <img src={wdLogoIcon} alt="" draggable={false} className={cn("h-10 w-auto select-none", className)} />
}

export function LogoLockup({ className, subtitle = true }: { className?: string; subtitle?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)]">
          WD <span className="text-[var(--color-amber-500)]">PDR</span>
        </span>
        {subtitle && (
          <span className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-400)]">
            Paintless Dent Removal
          </span>
        )}
      </div>
    </div>
  )
}
