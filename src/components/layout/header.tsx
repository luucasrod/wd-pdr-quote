import { useEffect, useRef, useState } from "react"
import { Search, Settings, Plus, LogOut } from "lucide-react"
import { useAuth } from "@/auth/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { LogoLockup } from "@/components/brand/logo-mark"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useLanguage } from "@/i18n/language-context"
import { cn, normalizeForSearch } from "@/lib/utils"
import type { Page } from "@/types/nav"
import type { Client, SavedQuote } from "@/types/crm"

interface HeaderProps {
  page: Page
  onNavigate: (page: Page) => void
  onNewQuote: () => void
  onOpenQuote: (id: string) => void
  quotes: SavedQuote[]
  getClientById: (id: string | null) => Client | undefined
  newQuoteCount?: number
}

export function Header({ page, onNavigate, onNewQuote, onOpenQuote, quotes, getClientById, newQuoteCount = 0 }: HeaderProps) {
  const { t, language } = useLanguage()
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const { user, signOut } = useAuth()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const trimmedQuery = normalizeForSearch(query.trim())
  const searchResults = trimmedQuery
    ? quotes
        .filter((q) => {
          const client = getClientById(q.clientId)
          const haystack = normalizeForSearch(
            `${client?.name ?? ""} ${client?.phone ?? ""} ${client?.email ?? ""} ${q.plate} ${q.id.slice(-8)} ${t.typeSelect.types[q.vehicleType].label}`
          )
          return haystack.includes(trimmedQuery)
        })
        .slice(0, 6)
    : []

  function handleSelectResult(id: string) {
    onOpenQuote(id)
    setQuery("")
    setSearchOpen(false)
    setMobileSearchOpen(false)
  }

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
              {item.label}{item.id === "quotesList" && newQuoteCount > 0 && <span className="ml-1 rounded-full bg-[var(--color-amber-500)] px-1.5 text-[10px] text-[var(--color-ink-950)]">{newQuoteCount}</span>}
            </button>
          ))}
        </nav>

        <div className="relative ml-auto hidden max-w-xs flex-1 items-center lg:flex" ref={searchRef}>
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[var(--color-ink-400)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder={t.common.searchPlaceholder}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-[var(--color-ink-50)] pl-10 pr-3 text-[13.5px] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] outline-none transition-all focus:border-[var(--color-amber-400)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
          />

          <AnimatePresence>
            {searchOpen && trimmedQuery && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white py-1 shadow-[var(--shadow-soft-lg)]"
              >
                {searchResults.length === 0 ? (
                  <p className="px-3 py-2.5 text-[13px] text-[var(--color-ink-400)]">{t.common.noResults}</p>
                ) : (
                  searchResults.map((q) => {
                    const client = getClientById(q.clientId)
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectResult(q.id)}
                        className="flex w-full flex-col gap-0.5 px-3 py-2 text-left transition-colors hover:bg-[var(--color-ink-50)]"
                      >
                        <span className="truncate text-[13px] font-medium text-[var(--color-ink-900)]">
                          {client?.name ?? t.quotesList.noClient}
                        </span>
                        <span className="truncate text-[11.5px] text-[var(--color-ink-400)]">
                          {t.typeSelect.types[q.vehicleType].label}
                          {q.plate && ` · ${q.plate}`} ·{" "}
                          {q.totals.totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
                        </span>
                      </button>
                    )
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t.common.search} onClick={() => setMobileSearchOpen((open) => !open)}><Search className="h-4.5 w-4.5" /></Button>
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
          {user && <div className="relative ml-1 hidden sm:block">
            <button type="button" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink-950)] text-[12px] font-semibold text-white shadow-[var(--shadow-soft-xs)] transition-transform hover:scale-[1.04] active:scale-95">WD</button>
            {accountOpen && <div className="absolute right-0 top-11 z-50 w-64 rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white p-2 shadow-[var(--shadow-soft-lg)]">
              <p className="truncate px-2 py-2 text-[12px] text-[var(--color-ink-500)]">{user.email}</p>
              <button type="button" onClick={() => void signOut()} className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-[13px] text-[var(--color-ink-900)] hover:bg-[var(--color-ink-50)]"><LogOut className="h-4 w-4" />{t.auth.signOut}</button>
            </div>}
          </div>}
        </div>
      </div>
      {mobileSearchOpen && <div className="absolute inset-x-0 top-[72px] z-50 border-b border-[var(--color-ink-100)] bg-white p-3 shadow-[var(--shadow-soft-lg)] lg:hidden">
        <div className="relative mx-auto max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--color-ink-400)]" />
          <input type="search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.common.searchPlaceholder} className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-[var(--color-ink-50)] pl-10 pr-3 text-[16px] text-[var(--color-ink-900)] outline-none focus:border-[var(--color-amber-400)]" />
          {trimmedQuery && <div className="mt-2 max-h-[min(45svh,320px)] overflow-y-auto overscroll-contain rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white py-1">
            {searchResults.length === 0 ? <p className="px-3 py-3 text-[13px] text-[var(--color-ink-400)]">{t.common.noResults}</p> : searchResults.map((q) => {
              const client = getClientById(q.clientId)
              return <button key={q.id} type="button" onClick={() => handleSelectResult(q.id)} className="flex min-h-12 w-full flex-col justify-center gap-0.5 px-3 py-2 text-left active:bg-[var(--color-ink-50)]">
                <span className="truncate text-[13px] font-medium text-[var(--color-ink-900)]">{client?.name ?? t.quotesList.noClient}</span>
                <span className="truncate text-[11.5px] text-[var(--color-ink-400)]">{t.typeSelect.types[q.vehicleType].label}{q.plate && ` · ${q.plate}`} · {q.totals.totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}</span>
              </button>
            })}
          </div>}
        </div>
      </div>}
    </header>
  )
}
