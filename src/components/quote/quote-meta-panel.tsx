import { useState } from "react"
import { Save, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField, Input, Select, Textarea } from "@/components/ui/form"
import { useLanguage } from "@/i18n/language-context"
import { useClients } from "@/hooks/use-clients"
import { useInsurers } from "@/hooks/use-insurers"
import { ClientFormModal } from "@/components/clients/client-form-modal"
import { BrandCombobox } from "@/components/vehicle/brand-combobox"

interface QuoteMetaPanelProps {
  clientId: string | null
  onClientIdChange: (id: string | null) => void
  insurerId: string | null
  onInsurerIdChange: (id: string | null) => void
  plate: string
  onPlateChange: (v: string) => void
  vehicleBrand: string
  onVehicleBrandChange: (v: string) => void
  vehicleModel: string
  onVehicleModelChange: (v: string) => void
  vehicleColor: string
  onVehicleColorChange: (v: string) => void
  notes: string
  onNotesChange: (v: string) => void
  onSave: () => void
  justSaved: boolean
  isEditing: boolean
}

export function QuoteMetaPanel({
  clientId,
  onClientIdChange,
  insurerId,
  onInsurerIdChange,
  plate,
  onPlateChange,
  vehicleBrand,
  onVehicleBrandChange,
  vehicleModel,
  onVehicleModelChange,
  vehicleColor,
  onVehicleColorChange,
  notes,
  onNotesChange,
  onSave,
  justSaved,
  isEditing,
}: QuoteMetaPanelProps) {
  const { t } = useLanguage()
  const { clients, createClient } = useClients()
  const { insurers } = useInsurers()
  const [newClientOpen, setNewClientOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.quoteMeta.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <FormField label={t.quoteMeta.clientLabel}>
          <div className="flex gap-2">
            <Select value={clientId ?? ""} onChange={(e) => onClientIdChange(e.target.value || null)} className="flex-1">
              <option value="">{t.quoteMeta.none}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" size="md" onClick={() => setNewClientOpen(true)}>
              +
            </Button>
          </div>
        </FormField>

        <FormField label={t.quoteMeta.insurerLabel}>
          <Select value={insurerId ?? ""} onChange={(e) => onInsurerIdChange(e.target.value || null)}>
            <option value="">{t.quoteMeta.none}</option>
            {insurers.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t.quoteMeta.plateLabel}>
          <Input value={plate} onChange={(e) => onPlateChange(e.target.value)} placeholder={t.quoteMeta.plateePlaceholder} />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label={t.quoteMeta.vehicleBrandLabel}>
            <BrandCombobox
              value={vehicleBrand}
              onChange={onVehicleBrandChange}
              placeholder={t.quoteMeta.vehicleBrandPlaceholder}
              noResults={t.quoteMeta.vehicleBrandNoResults}
            />
          </FormField>
          <FormField label={t.quoteMeta.vehicleModelLabel}>
            <Input value={vehicleModel} onChange={(e) => onVehicleModelChange(e.target.value)} />
          </FormField>
        </div>

        <FormField label={t.quoteMeta.vehicleColorLabel}>
          <Input value={vehicleColor} onChange={(e) => onVehicleColorChange(e.target.value)} />
        </FormField>

        <FormField label={t.quoteMeta.notesLabel}>
          <Textarea rows={3} value={notes} onChange={(e) => onNotesChange(e.target.value)} placeholder={t.quoteMeta.notesPlaceholder} />
        </FormField>

        <Button variant="accent" size="lg" onClick={onSave} className="mt-1" disabled={!vehicleBrand.trim()}>
          {justSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {justSaved ? t.quoteMeta.savedToast : isEditing ? t.quoteMeta.saveChanges : t.quoteMeta.saveQuote}
        </Button>
      </CardContent>

      <ClientFormModal
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        onSave={(data) => {
          const client = createClient(data)
          onClientIdChange(client.id)
        }}
      />
    </Card>
  )
}
