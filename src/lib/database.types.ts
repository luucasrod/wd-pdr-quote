import type { PriceTable, PartTypeDef } from "@/data/pricing/pricing-config"
import type { PartBreakdown } from "@/lib/pricing"
import type { SavedQuoteTotalsSnapshot } from "@/types/crm"
import type { VehicleType, ViewMarkers } from "@/types/vehicle"

type QuoteStatus = "draft" | "sent" | "approved" | "rejected"
type QuoteSource = "owner" | "customer"

export interface ClientRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  nif: string | null
  address: string | null
  legacy_id: string | null
  created_at: string
}

export interface InsurerRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  notes: string | null
  legacy_id: string | null
  created_at: string
}

export interface QuoteRow {
  id: string
  status: QuoteStatus
  source: QuoteSource
  client_id: string | null
  insurer_id: string | null
  vehicle_type: VehicleType
  plate: string | null
  notes: string | null
  markers_by_view: ViewMarkers
  part_type_by_part: Record<string, string>
  part_breakdown: PartBreakdown[]
  finish_hours: number
  surcharge1: boolean
  surcharge2: boolean
  totals: SavedQuoteTotalsSnapshot
  part_count: number
  marker_count: number
  seen_at: string | null
  legacy_id: string | null
  created_at: string
  updated_at: string
}

export interface ShopSettingsRow {
  id: string
  hourly_table: PriceTable
  part_types: PartTypeDef[]
  hourly_rate: number
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      clients: { Row: ClientRow; Insert: Partial<ClientRow> & Pick<ClientRow, "name">; Update: Partial<ClientRow>; Relationships: [] }
      insurers: { Row: InsurerRow; Insert: Partial<InsurerRow> & Pick<InsurerRow, "name">; Update: Partial<InsurerRow>; Relationships: [] }
      quotes: { Row: QuoteRow; Insert: Partial<QuoteRow> & Pick<QuoteRow, "vehicle_type" | "totals">; Update: Partial<QuoteRow>; Relationships: [] }
      shop_settings: { Row: ShopSettingsRow; Insert: Partial<ShopSettingsRow> & Pick<ShopSettingsRow, "hourly_table" | "part_types">; Update: Partial<ShopSettingsRow>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: {
      submeter_pedido: {
        Args: {
          p_nome: string; p_telefone: string; p_email: string; p_matricula: string; p_notas: string
          p_tipo_veiculo: string; p_markers: ViewMarkers; p_breakdown: PartBreakdown[]
          p_totals: SavedQuoteTotalsSnapshot; p_part_count: number; p_marker_count: number
        }
        Returns: string
      }
    }
    Enums: { quote_status: QuoteStatus; quote_source: QuoteSource; vehicle_type: VehicleType }
    CompositeTypes: Record<string, never>
  }
}
