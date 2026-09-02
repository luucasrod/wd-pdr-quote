import { Link } from "react-router-dom"
import { ArrowLeft, Send } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField, Input, Textarea } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"

import type { CustomerDraftContact as ContactFormData } from "@/lib/customer-draft"
import { isPlausiblePhone } from "@/lib/contact-validation"
export type { CustomerDraftContact as ContactFormData } from "@/lib/customer-draft"

interface CustomerContactFormProps {
  onBack: () => void
  onSubmit: (data: ContactFormData) => void
  submitting: boolean
  form: ContactFormData
  consent: boolean
  onFormChange: (form: ContactFormData) => void
  onConsentChange: (consent: boolean) => void
}

export function CustomerContactForm({ onBack, onSubmit, submitting, form, consent, onFormChange, onConsentChange }: CustomerContactFormProps) {
  const { t } = useLanguage()

  const phoneValid = !form.phone || isPlausiblePhone(form.phone)
  const canSubmit = form.name.trim() && phoneValid && consent && !submitting

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
                onChange={(e) => onFormChange({ ...form, name: e.target.value })}
                placeholder={t.customer.namePlaceholder}
                required
                maxLength={200}
                autoFocus
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={`${t.customer.phoneLabel} *`}>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
                  placeholder={t.customer.phonePlaceholder}
                  required
                  maxLength={40}
                  pattern="\+?[0-9\s().-]{9,40}"
                  title={t.customer.phoneInvalid}
                />
                {!phoneValid && <p role="alert" className="mt-1 text-[12px] text-[var(--color-severity-severe)]">{t.customer.phoneInvalid}</p>}
              </FormField>
              <FormField label={t.customer.emailLabel}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => onFormChange({ ...form, email: e.target.value })}
                  placeholder={t.customer.emailPlaceholder}
                  maxLength={200}
                />
              </FormField>
            </div>
            <FormField label={t.customer.plateLabel}>
              <Input value={form.plate} maxLength={20} onChange={(e) => onFormChange({ ...form, plate: e.target.value })} />
            </FormField>
            <FormField label={t.customer.notesLabel}>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
                placeholder={t.customer.notesPlaceholder}
                maxLength={2000}
              />
            </FormField>

            <label className="flex items-start gap-2.5 text-[12.5px] text-[var(--color-ink-600)]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => onConsentChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-amber-500)]"
                required
              />
              {t.customer.consentLabel}
            </label>

            <Link
              to="/privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="-mt-2 text-[12px] text-[var(--color-amber-700)] underline underline-offset-2"
            >
              {t.customer.privacyLinkLabel}
            </Link>

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
