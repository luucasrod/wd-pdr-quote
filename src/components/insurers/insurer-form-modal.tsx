import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, Input, Textarea } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"
import type { Insurer } from "@/types/crm"

interface InsurerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Insurer | null
  onSave: (data: Omit<Insurer, "id" | "createdAt">) => void
}

const EMPTY = { name: "", phone: "", email: "", notes: "" }

export function InsurerFormModal({ open, onOpenChange, initial, onSave }: InsurerFormModalProps) {
  const { t } = useLanguage()
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) setForm(initial ? { name: initial.name, phone: initial.phone, email: initial.email, notes: initial.notes } : EMPTY)
  }, [open, initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={initial ? t.insurers.edit : t.insurers.add}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label={t.insurers.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.insurers.phone}>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" />
          </FormField>
          <FormField label={t.insurers.email}>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
          </FormField>
        </div>
        <FormField label={t.insurers.notes}>
          <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </FormField>
        <Button type="submit" variant="accent" size="lg" className="mt-2">
          {t.insurers.save}
        </Button>
      </form>
    </Modal>
  )
}
