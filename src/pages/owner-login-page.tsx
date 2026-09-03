import { useState, type FormEvent } from "react"
import { Lock } from "lucide-react"
import { useAuth } from "@/auth/auth-context"
import { LogoLockup } from "@/components/brand/logo-mark"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input, Label } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"

export function OwnerLoginPage() {
  const { t } = useLanguage()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setSubmitting(true); setError(false)
    const message = await signIn(email.trim(), password)
    setSubmitting(false); if (message) setError(true)
  }

  return <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-[var(--color-canvas)] px-6">
    <div className="absolute right-6 top-6"><LanguageSwitcher /></div>
    <div className="rounded-[var(--radius-lg)] bg-white p-4"><LogoLockup /></div>
    <Card className="w-full max-w-[380px]">
      <CardHeader className="items-center text-center"><div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-amber-50)]"><Lock className="h-5 w-5 text-[var(--color-amber-600)]" /></div><CardTitle>{t.auth.title}</CardTitle><CardDescription>{t.auth.subtitle}</CardDescription></CardHeader>
      <CardContent><form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div><Label htmlFor="owner-email">{t.auth.emailLabel}</Label><Input id="owner-email" type="email" autoComplete="username" autoFocus required value={email} onChange={(e) => { setEmail(e.target.value); setError(false) }} /></div>
        <div><Label htmlFor="owner-password">{t.auth.passwordLabel}</Label><Input id="owner-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(false) }} /></div>
        {error && <p role="alert" className="text-[12.5px] text-[var(--color-severity-severe)]">{t.auth.errorMessage}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>{submitting ? t.auth.signingIn : t.auth.submitButton}</Button>
      </form></CardContent>
    </Card>
  </div>
}
