import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/i18n/language-context"

interface CustomerPriceBarProps {
  totalPrice: number
  markerCount: number
  onContinue: () => void
}

export function CustomerPriceBar({ totalPrice, markerCount, onContinue }: CustomerPriceBarProps) {
  const { t, language } = useLanguage()

  return (
    <div className="sticky bottom-0 z-20 -mx-6 border-t border-[var(--color-ink-100)] bg-white/95 px-6 py-4 backdrop-blur-xl lg:mx-0 lg:rounded-[var(--radius-xl)] lg:border">
      <div className="mx-auto flex max-w-[720px] items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-400)]">{t.customer.yourEstimate}</p>
          <motion.p
            key={totalPrice.toFixed(2)}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[22px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)]"
          >
            {totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
          </motion.p>
        </div>
        <Button variant="accent" size="lg" onClick={onContinue} disabled={markerCount === 0}>
          {t.customer.continueButton}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
