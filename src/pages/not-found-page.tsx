import { ArrowLeft, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { CustomerHeader } from "@/components/customer/customer-header"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/i18n/language-context"

export function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-[var(--color-canvas)]">
      <CustomerHeader />
      <main className="mx-auto flex max-w-[720px] flex-col items-center px-6 py-20 text-center sm:py-28">
        <p className="text-[clamp(5rem,22vw,9rem)] font-black leading-none tracking-[-0.07em] text-[var(--color-amber-500)]">
          {t.notFound.code}
        </p>
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[var(--color-ink-950)] sm:text-3xl">
          {t.notFound.title}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-6 text-[var(--color-ink-500)]">
          {t.notFound.subtitle}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              {t.notFound.backHome}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="tel:+351936077121">
              <Phone className="h-4 w-4" />
              +351 936 077 121
            </a>
          </Button>
        </div>
      </main>
    </div>
  )
}
