import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square } from "lucide-react"
import type { VehicleView } from "@/types/vehicle"
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control"
import { useLanguage } from "@/i18n/language-context"

interface VehicleViewSelectorProps {
  value: VehicleView
  onChange: (view: VehicleView) => void
}

export function VehicleViewSelector({ value, onChange }: VehicleViewSelectorProps) {
  const { t } = useLanguage()

  const options: SegmentedOption<VehicleView>[] = [
    { value: "top", label: t.views.top, icon: <Square className="h-3.5 w-3.5" /> },
    { value: "front", label: t.views.front, icon: <ArrowUp className="h-3.5 w-3.5" /> },
    { value: "right", label: t.views.right, icon: <ArrowRight className="h-3.5 w-3.5" /> },
    { value: "rear", label: t.views.rear, icon: <ArrowDown className="h-3.5 w-3.5" /> },
    { value: "left", label: t.views.left, icon: <ArrowLeft className="h-3.5 w-3.5" /> },
  ]

  return <SegmentedControl layoutId="vehicle-view-pill" options={options} value={value} onChange={onChange} />
}
