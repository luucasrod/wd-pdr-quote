import { useState } from "react"
import { Plus, Search, Phone, Mail, Trash2, Pencil, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/i18n/language-context"
import { useInsurers } from "@/hooks/use-insurers"
import { InsurerFormModal } from "@/components/insurers/insurer-form-modal"
import type { Insurer } from "@/types/crm"

export function InsurersPage() {
  const { t } = useLanguage()
  const { insurers, createInsurer, updateInsurer, removeInsurer } = useInsurers()
  const [query, setQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Insurer | null>(null)

  const filtered = insurers.filter((i) => `${i.name} ${i.phone} ${i.email}`.toLowerCase().includes(query.toLowerCase()))

  function handleSave(data: Omit<Insurer, "id" | "createdAt">) {
    if (editing) updateInsurer(editing.id, data)
    else createInsurer(data)
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
            {t.insurers.title}
          </h1>
          <p className="text-[14.5px] text-[var(--color-ink-500)]">{t.insurers.subtitle}</p>
        </div>
        <Button
          variant="accent"
          size="md"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          {t.insurers.add}
        </Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.insurers.searchPlaceholder}
          className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white pl-10 pr-3 text-[13.5px] outline-none focus:border-[var(--color-amber-400)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="px-4 py-10 text-center text-[13.5px] text-[var(--color-ink-400)]">{t.insurers.empty}</Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((i) => (
            <Card key={i.id} className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-amber-100)] text-[var(--color-amber-700)]">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[var(--color-ink-950)]">{i.name}</p>
                {i.phone && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[var(--color-ink-500)]">
                    <Phone className="h-3 w-3" /> {i.phone}
                  </p>
                )}
                {i.email && (
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12.5px] text-[var(--color-ink-500)]">
                    <Mail className="h-3 w-3" /> {i.email}
                  </p>
                )}
                {i.notes && <p className="mt-1.5 text-[12px] text-[var(--color-ink-400)]">{i.notes}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(i)
                    setModalOpen(true)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-400)] hover:bg-[var(--color-ink-100)] hover:text-[var(--color-ink-800)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t.insurers.deleteConfirm)) removeInsurer(i.id)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-400)] hover:bg-[var(--color-severity-severe-soft)] hover:text-[var(--color-severity-severe)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <InsurerFormModal open={modalOpen} onOpenChange={setModalOpen} initial={editing} onSave={handleSave} />
    </div>
  )
}
