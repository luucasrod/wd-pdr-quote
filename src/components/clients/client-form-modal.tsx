import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, Input } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"
import type { Client } from "@/types/crm"

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Client | null
  onSave: (data: Omit<Client, "id" | "createdAt">) => void
}

const EMPTY = { name: "", phone: "", email: "", nif: "", address: "" }

export function ClientFormModal({ open, onOpenChange, initial, onSave }: ClientFormModalProps) {
  const { t } = useLanguage()
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) setForm(initial ? { name: initial.name, phone: initial.phone, email: initial.email, nif: initial.nif, address: initial.address } : EMPTY)
  }, [open, initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={initial ? t.clients.edit : t.clients.add}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label={t.clients.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.clients.phone}>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" />
          </FormField>
          <FormField label={t.clients.email}>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.clients.nif}>
            <Input value={form.nif} onChange={(e) => setForm({ ...form, nif: e.target.value })} />
          </FormField>
          <FormField label={t.clients.address}>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </FormField>
        </div>
        <Button type="submit" variant="accent" size="lg" className="mt-2">
          {t.clients.save}
        </Button>
      </form>
    </Modal>
  )
}
