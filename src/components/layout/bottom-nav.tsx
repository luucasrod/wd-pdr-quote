import { LayoutGrid, FileText, Users, Shield } from "lucide-react"
import { useLanguage } from "@/i18n/language-context"
import { cn } from "@/lib/utils"
import type { Page } from "@/types/nav"

interface BottomNavProps {
  page: Page
  onNavigate: (page: Page) => void
}

export function BottomNav({ page, onNavigate }: BottomNavProps) {
  const { t } = useLanguage()

  const items: { id: Page; label: string; icon: typeof LayoutGrid }[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutGrid },
    { id: "quotesList", label: t.nav.quotesList, icon: FileText },
    { id: "clients", label: t.nav.clients, icon: Users },
    { id: "insurers", label: t.nav.insurers, icon: Shield },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--color-ink-100)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden print:hidden">
      {items.map((item) => {
        const active = page === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium transition-colors",
              active ? "text-[var(--color-amber-600)]" : "text-[var(--color-ink-400)]"
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
