import type { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import type { Page } from "@/types/nav"
import type { Client, SavedQuote } from "@/types/crm"

interface AppShellProps {
  children: ReactNode
  page: Page
  onNavigate: (page: Page) => void
  onNewQuote: () => void
  onOpenQuote: (id: string) => void
  quotes: SavedQuote[]
  getClientById: (id: string | null) => Client | undefined
  newQuoteCount?: number
}

export function AppShell({ children, page, onNavigate, onNewQuote, onOpenQuote, quotes, getClientById, newQuoteCount = 0 }: AppShellProps) {
  return (
    <div className="min-h-svh bg-[var(--color-canvas)]">
      <Header
        page={page}
        onNavigate={onNavigate}
        onNewQuote={onNewQuote}
        onOpenQuote={onOpenQuote}
        quotes={quotes}
        getClientById={getClientById}
        newQuoteCount={newQuoteCount}
      />
      <main className="mx-auto max-w-[1440px] px-6 pb-28 pt-8 lg:px-10 lg:pt-10">{children}</main>
      <BottomNav page={page} onNavigate={onNavigate} newQuoteCount={newQuoteCount} />
    </div>
  )
}
