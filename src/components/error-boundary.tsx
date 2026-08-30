import { Component, type ErrorInfo, type ReactNode } from "react"
import { Phone, RotateCcw } from "lucide-react"
import { CustomerHeader } from "@/components/customer/customer-header"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/i18n/language-context"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

function ErrorFallback() {
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-[var(--color-canvas)]">
      <CustomerHeader />
      <main className="mx-auto flex max-w-[720px] flex-col items-center px-6 py-20 text-center sm:py-28">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-amber-100)] text-[var(--color-amber-700)]">
          <RotateCcw className="h-9 w-9" />
        </div>
        <h1 className="mt-7 text-2xl font-bold tracking-[-0.03em] text-[var(--color-ink-950)] sm:text-3xl">
          {t.errorBoundary.title}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-6 text-[var(--color-ink-500)]">
          {t.errorBoundary.subtitle}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="accent" size="lg" onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4" />
            {t.errorBoundary.reload}
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

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled application error", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <LanguageProvider>
          <ErrorFallback />
        </LanguageProvider>
      )
    }

    return this.props.children
  }
}
