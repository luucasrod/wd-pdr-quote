import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Download, Loader2, RotateCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/i18n/language-context"
import { downloadQuotePdf } from "@/lib/generate-quote-pdf"
import type { SavedQuote, Client } from "@/types/crm"

interface CustomerDoneScreenProps {
  quote: SavedQuote
  client: Client
  totalPrice: number
  onNewRequest: () => void
}

export function CustomerDoneScreen({ quote, client, totalPrice, onNewRequest }: CustomerDoneScreenProps) {
  const { t, language } = useLanguage()
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      await downloadQuotePdf({ quote, client, t, language })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[480px] text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-severity-minor-soft)]"
      >
        <CheckCircle2 className="h-8 w-8 text-[var(--color-severity-minor)]" />
      </motion.div>

      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)]">{t.customer.doneTitle}</h1>
      <p className="mt-2 text-[14px] text-[var(--color-ink-500)]">{t.customer.doneSubtitle}</p>

      <Card className="mt-6 p-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-400)]">{t.customer.yourEstimate}</p>
        <p className="mt-1 text-[32px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)]">
          {totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
        </p>
        <p className="mt-1 text-[11.5px] text-[var(--color-ink-400)]">{t.customer.estimateNote}</p>
      </Card>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <Button variant="accent" size="lg" className="flex-1" onClick={handleDownload} disabled={downloading}>
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {t.customer.downloadPdf}
        </Button>
        <Button variant="outline" size="lg" className="flex-1" onClick={onNewRequest}>
          <RotateCcw className="h-4 w-4" />
          {t.customer.newRequest}
        </Button>
      </div>
    </div>
  )
}
