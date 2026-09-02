import { useState } from "react"
import { Plus, Search, Phone, Mail, Trash2, Pencil, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/i18n/language-context"
import { useClients } from "@/hooks/use-clients"
import { ClientFormModal } from "@/components/clients/client-form-modal"
import type { Client } from "@/types/crm"
import { DeleteDialog, UndoDelete } from "@/components/ui/delete-dialog"
import { useUndoableDelete } from "@/hooks/use-undoable-delete"

export function ClientsPage() {
  const { t, language } = useLanguage()
  const { clients, createClient, updateClient, removeClient } = useClients()
  const [query, setQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const deletion = useUndoableDelete(removeClient)

  const filtered = clients.filter((c) => c.id !== deletion.pending?.id).filter((c) =>
    `${c.name} ${c.phone} ${c.email} ${c.nif}`.toLowerCase().includes(query.toLowerCase())
  )

  function handleSave(data: Omit<Client, "id" | "createdAt">) {
    if (editing) updateClient(editing.id, data)
    else createClient(data)
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
            {t.clients.title}
          </h1>
          <p className="text-[14.5px] text-[var(--color-ink-500)]">{t.clients.subtitle}</p>
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
          {t.clients.add}
        </Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.clients.searchPlaceholder}
          className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white pl-10 pr-3 text-[13.5px] outline-none focus:border-[var(--color-amber-400)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="px-4 py-10 text-center text-[13.5px] text-[var(--color-ink-400)]">{t.clients.empty}</Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((c) => (
            <Card key={c.id} className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-100)] text-[var(--color-ink-600)]">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[var(--color-ink-950)]">{c.name}</p>
                {c.phone && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[var(--color-ink-500)]">
                    <Phone className="h-3 w-3" /> {c.phone}
                  </p>
                )}
                {c.email && (
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12.5px] text-[var(--color-ink-500)]">
                    <Mail className="h-3 w-3" /> {c.email}
                  </p>
                )}
                <p className="mt-1.5 text-[11px] text-[var(--color-ink-300)]">
                  {t.clients.createdOn} {new Date(c.createdAt).toLocaleDateString(language)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(c)
                    setModalOpen(true)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-400)] hover:bg-[var(--color-ink-100)] hover:text-[var(--color-ink-800)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(c)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-400)] hover:bg-[var(--color-severity-severe-soft)] hover:text-[var(--color-severity-severe)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ClientFormModal open={modalOpen} onOpenChange={setModalOpen} initial={editing} onSave={handleSave} />
      <DeleteDialog
        name={deleteTarget?.name ?? null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deletion.schedule(deleteTarget); setDeleteTarget(null) }}
      />
      <UndoDelete visible={Boolean(deletion.pending)} onUndo={deletion.undo} />
    </div>
  )
}
