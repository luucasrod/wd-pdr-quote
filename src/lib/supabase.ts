import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase: SupabaseClient<Database> | null = url && publishableKey
  ? createClient<Database>(url, publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export const isSupabaseConfigured = supabase !== null
