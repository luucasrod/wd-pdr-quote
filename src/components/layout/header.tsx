import { Search, Settings, Plus } from "lucide-react"
import { LogoLockup } from "@/components/brand/logo-mark"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useLanguage } from "@/i18n/language-context"
import { cn } from "@/lib/utils"
import type { Page } from "@/types/nav"

interface HeaderProps {
  page: Page
  onNavigate: (page: Page) => void
  onNewQuote: () => void
}

export function Header({ page, onNavigate, onNewQuote }: HeaderProps) {
  const { t } = useLanguage()

  const navItems: { id: Page; label: string }[] = [
    { id: "dashboard", label: t.nav.dashboard },
    { id: "quotesList", label: t.nav.quotesList },
    { id: "clients", label: t.nav.clients },
    { id: "insurers", label: t.nav.insurers },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-ink-100)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-8 px-6 lg:px-10">
        <button onClick={() => onNavigate("dashboard")} className="shrink-0">
          <LogoLockup />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-[var(--color-ink-100)] md:block" />

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-2 text-[13.5px] font-medium transition-colors",
                page === item.id
                  ? "bg-[var(--color-ink-100)] text-[var(--color-ink-950)]"
                  : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="relative ml-auto hidden max-w-xs flex-1 items-center lg:flex">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[var(--color-ink-400)]" />
          <input
            type="text"
            placeholder={t.common.searchPlaceholder}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-[var(--color-ink-50)] pl-10 pr-3 text-[13.5px] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] outline-none transition-all focus:border-[var(--color-amber-400)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <LanguageSwitcher />
          <Button variant="accent" size="md" className="hidden sm:inline-flex" onClick={onNewQuote}>
            <Plus className="h-4 w-4" />
            {t.common.newQuote}
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label={t.common.newQuote} onClick={onNewQuote}>
            <Plus className="h-4.5 w-4.5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={t.common.settings} onClick={() => onNavigate("settings")}>
            <Settings className="h-4.5 w-4.5" />
          </Button>
          <button className="ml-1 hidden h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink-950)] text-[12px] font-semibold text-white shadow-[var(--shadow-soft-xs)] transition-transform hover:scale-[1.04] active:scale-95 sm:flex">
            WD
          </button>
        </div>
      </div>
    </header>
  )
}
