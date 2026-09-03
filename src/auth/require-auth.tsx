import type { ReactNode } from "react"
import { useAuth } from "@/auth/auth-context"
import { OwnerLoginPage } from "@/pages/owner-login-page"
import { isSupabaseConfigured } from "@/lib/supabase"

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (!isSupabaseConfigured) return <>{children}</>
  if (loading) return <div className="min-h-svh animate-pulse bg-[var(--color-canvas)]" />
  return session ? <>{children}</> : <OwnerLoginPage />
}
