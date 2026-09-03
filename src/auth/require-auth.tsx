import type { ReactNode } from "react"
import { useAuth } from "@/auth/auth-context"
import { OwnerLoginPage } from "@/pages/owner-login-page"
import { OficinaPasscodeGate } from "@/components/auth/oficina-passcode-gate"
import { isSupabaseConfigured } from "@/lib/supabase"

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  // Sem Supabase configurado nao ha como autenticar a serio — mas tambem nao se pode
  // deixar o painel aberto a toda a gente. Cai no passcode, que e o que estava em
  // producao antes desta alteracao. Sem esta reserva, o dia em que isto fosse para o
  // ar sem as variaveis de ambiente deixaria o /oficina sem porta nenhuma: pior do que
  // o que ja existia.
  if (!isSupabaseConfigured) return <OficinaPasscodeGate>{children}</OficinaPasscodeGate>

  if (loading) return <div className="min-h-svh animate-pulse bg-[var(--color-canvas)]" />
  return session ? <>{children}</> : <OwnerLoginPage />
}
