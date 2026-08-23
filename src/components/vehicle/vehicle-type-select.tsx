import { motion } from "framer-motion"
import type { VehicleType } from "@/types/vehicle"
import { VEHICLE_IMAGES } from "@/data/vehicle/vehicle-images"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/i18n/language-context"

const TYPE_ORDER: VehicleType[] = ["sedan", "compact", "suv", "wagon", "van"]

interface VehicleTypeSelectProps {
  onSelect: (type: VehicleType) => void
}

export function VehicleTypeSelect({ onSelect }: VehicleTypeSelectProps) {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)] sm:text-[30px]">
          {t.typeSelect.title}
        </h1>
        <p className="mt-1.5 text-[14.5px] text-[var(--color-ink-500)]">{t.typeSelect.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {TYPE_ORDER.map((type, i) => {
          const meta = t.typeSelect.types[type]
          const thumb = VEHICLE_IMAGES[type].right
          return (
            <motion.button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="text-left"
            >
              <Card className="group relative flex h-full flex-col items-center gap-4 overflow-hidden border-[var(--color-ink-100)] p-5 transition-shadow hover:border-[var(--color-amber-300)] hover:shadow-[var(--shadow-soft-md)]">
                <span className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-[var(--color-amber-500)] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-20 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] p-2">
                  <img
                    src={thumb.src}
                    alt=""
                    draggable={false}
                    className="h-full w-full select-none object-contain"
                    style={{ filter: "grayscale(1) contrast(1.08)" }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-semibold text-[var(--color-ink-950)]">{meta.label}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-400)]">{meta.description}</p>
                </div>
              </Card>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
