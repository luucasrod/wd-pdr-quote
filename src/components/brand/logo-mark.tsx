import { cn } from "@/lib/utils"

/**
 * Compact badge mark distilled from the WD PDR crest (mechanic + shield + car grille).
 * Used at small sizes (header, favicon-scale UI) where the full illustration doesn't read.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="13" fill="var(--color-ink-950)" />
      <path
        d="M14 15.5L16.6 30.5H19.9L21.7 20.6L23.5 30.5H26.8L29.4 15.5H26.7L25.2 26L23.4 15.5H20L18.2 26L16.7 15.5H14Z"
        fill="var(--color-amber-500)"
      />
      <path
        d="M31 15.5H33.8C36.4 15.5 38 17.4 38 20.6C38 23.9 36.4 25.6 33.8 25.6H33.4V30.5H31V15.5ZM33.4 17.8V23.3H33.7C35 23.3 35.6 22.5 35.6 20.6C35.6 18.7 35 17.8 33.7 17.8H33.4Z"
        fill="var(--color-amber-500)"
      />
      <circle cx="24" cy="37" r="2.1" fill="var(--color-amber-500)" fillOpacity="0.9" />
    </svg>
  )
}

export function LogoLockup({ className, subtitle = true }: { className?: string; subtitle?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
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
