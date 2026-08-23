import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/i18n/language-context"
import type { QuoteStatus } from "@/types/crm"

const VARIANT: Record<QuoteStatus, "neutral" | "amber" | "minor" | "severe"> = {
  draft: "neutral",
  sent: "amber",
  approved: "minor",
  rejected: "severe",
}

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const { t } = useLanguage()
  const label = {
    draft: t.quotesList.statusDraft,
    sent: t.quotesList.statusSent,
    approved: t.quotesList.statusApproved,
    rejected: t.quotesList.statusRejected,
  }[status]

  return <Badge variant={VARIANT[status]}>{label}</Badge>
}
