import { LogoLockup } from "@/components/brand/logo-mark"
import { LanguageSwitcher } from "@/components/layout/language-switcher"

export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-ink-100)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[720px] items-center justify-between px-6">
        <LogoLockup />
        <LanguageSwitcher />
      </div>
    </header>
  )
}
