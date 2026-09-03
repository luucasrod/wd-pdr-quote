import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/form"
import { LogoLockup } from "@/components/brand/logo-mark"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { useLanguage } from "@/i18n/language-context"
import { useOficinaAuth } from "@/hooks/use-oficina-auth"

export function OficinaPasscodeGate({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const { unlocked, tryUnlock } = useOficinaAuth()
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (tryUnlock(code)) return
    setError(true)
    setCode("")
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-[var(--color-canvas)] px-6">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <LogoLockup />

      <Card className="w-full max-w-[360px]">
        <CardHeader className="items-center text-center">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-amber-50)]">
            <Lock className="h-5 w-5 text-[var(--color-amber-600)]" />
          </div>
          <CardTitle>{t.auth.title}</CardTitle>
          <CardDescription>{t.auth.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="oficina-passcode">{t.auth.passcodeLabel}</Label>
              <Input
                id="oficina-passcode"
                type="password"
                inputMode="numeric"
                autoFocus
                autoComplete="off"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError(false)
                }}
                placeholder={t.auth.passcodePlaceholder}
              />
              {error && (
                <p className="mt-1.5 text-[12.5px] text-[var(--color-severity-severe)]">{t.auth.errorMessage}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={!code}>
              {t.auth.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
