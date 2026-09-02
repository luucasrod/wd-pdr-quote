import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/i18n/language-context"
import { formatPhoneForReview } from "@/lib/contact-validation"

export function PhoneConfirmation({ phone, onCorrect, onConfirm }: { phone: string; onCorrect: () => void; onConfirm: () => void }) {
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-[520px]">
      <Card className="p-6 text-center sm:p-8">
        <h1 className="text-[20px] font-bold text-[var(--color-ink-950)]">{t.customer.confirmPhoneTitle}</h1>
        <p className="mt-2 text-[14px] text-[var(--color-ink-500)]">{t.customer.confirmPhoneQuestion}</p>
        <p className="my-7 break-words text-[30px] font-bold tracking-[0.04em] text-[var(--color-ink-950)] sm:text-[36px]">{formatPhoneForReview(phone)}</p>
        <div className="flex flex-col gap-2.5 sm:flex-row-reverse">
          <Button variant="accent" size="lg" className="flex-1" onClick={onConfirm}><Send className="h-4 w-4" />{t.customer.confirmPhoneSend}</Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={onCorrect}><ArrowLeft className="h-4 w-4" />{t.customer.correctPhone}</Button>
        </div>
      </Card>
    </div>
  )
}
