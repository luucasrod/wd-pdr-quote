import { useMemo, useRef, useState } from "react"
import { Check, Search } from "lucide-react"
import { CAR_BRANDS } from "@/data/vehicle/car-brands"
import { cn } from "@/lib/utils"

interface BrandComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  noResults: string
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

export function BrandCombobox({ value, onChange, placeholder, noResults }: BrandComboboxProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const filtered = useMemo(() => {
    const query = normalize(value.trim())
    return CAR_BRANDS.filter((brand) => !query || normalize(brand).includes(query)).slice(0, 10)
  }, [value])

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
      <input
        value={value}
        onChange={(event) => { onChange(event.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls="vehicle-brand-options"
        aria-required="true"
        autoComplete="off"
        className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white pl-10 pr-3 text-[16px] text-[var(--color-ink-900)] outline-none focus:border-[var(--color-amber-400)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)] sm:text-[13.5px]"
      />
      {open && (
        <div
          id="vehicle-brand-options"
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-1 shadow-[var(--shadow-soft-lg)]"
        >
          {filtered.length ? filtered.map((brand) => (
            <button
              key={brand}
              type="button"
              role="option"
              aria-selected={brand === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { onChange(brand); setOpen(false) }}
              className={cn(
                "flex min-h-11 w-full items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-left text-[14px]",
                brand === value ? "bg-[var(--color-amber-50)] font-semibold" : "hover:bg-[var(--color-ink-50)]"
              )}
            >
              {brand}
              {brand === value && <Check className="h-4 w-4 text-[var(--color-amber-600)]" />}
            </button>
          )) : (
            <p className="px-3 py-4 text-center text-[13px] text-[var(--color-ink-400)]">{noResults}</p>
          )}
        </div>
      )}
    </div>
  )
}
