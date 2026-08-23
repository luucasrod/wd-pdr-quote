import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField, Input, Textarea } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"

export interface ContactFormData {
  name: string
  phone: string
  email: string
  plate: string
  notes: string
}

interface CustomerContactFormProps {
  onBack: () => void
  onSubmit: (data: ContactFormData) => void
  submitting: boolean
}

const EMPTY: ContactFormData = { name: "", phone: "", email: "", plate: "", notes: "" }

export function CustomerContactForm({ onBack, onSubmit, submitting }: CustomerContactFormProps) {
  const { t } = useLanguage()
  const [form, setForm] = useState<ContactFormData>(EMPTY)
  const [consent, setConsent] = useState(false)

  const canSubmit = form.name.trim() && form.phone.trim() && consent && !submitting

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(form)
  }

  return (
    <div className="mx-auto max-w-[520px]">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t.customer.backButton}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t.customer.contactTitle}</CardTitle>
          <CardDescription>{t.customer.contactSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label={`${t.customer.nameLabel} *`}>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.customer.namePlaceholder}
                required
                autoFocus
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={`${t.customer.phoneLabel} *`}>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t.customer.phonePlaceholder}
                  required
                />
              </FormField>
              <FormField label={t.customer.emailLabel}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t.customer.emailPlaceholder}
                />
              </FormField>
            </div>
            <FormField label={t.customer.plateLabel}>
              <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
            </FormField>
            <FormField label={t.customer.notesLabel}>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={t.customer.notesPlaceholder}
              />
            </FormField>

            <label className="flex items-start gap-2.5 text-[12.5px] text-[var(--color-ink-600)]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-amber-500)]"
                required
              />
              {t.customer.consentLabel}
            </label>

            <p className="text-[11px] text-[var(--color-ink-400)]">* {t.customer.requiredFieldsNote}</p>

            <Button type="submit" variant="accent" size="lg" disabled={!canSubmit} className="mt-1">
              <Send className="h-4 w-4" />
              {submitting ? t.customer.submittingButton : t.customer.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
