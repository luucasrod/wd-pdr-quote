import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/i18n/language-context"
import { LANGUAGE_META } from "@/i18n/translations"
import type { Language } from "@/i18n/translations"
import { cn } from "@/lib/utils"

const LANGUAGES: Language[] = ["pt", "en", "de", "fr", "es"]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const current = LANGUAGE_META[language]

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white px-2.5 text-[13px] font-medium text-[var(--color-ink-700)] transition-colors hover:border-[var(--color-ink-200)]"
      >
        <span className="text-[15px] leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-[var(--color-ink-400)] transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-ink-100)] bg-white py-1 shadow-[var(--shadow-soft-lg)]"
          >
            {LANGUAGES.map((lang) => {
              const meta = LANGUAGE_META[lang]
              const active = lang === language
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguage(lang)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors",
                    active ? "bg-[var(--color-amber-50)] font-semibold text-[var(--color-ink-950)]" : "text-[var(--color-ink-700)] hover:bg-[var(--color-ink-50)]"
                  )}
                >
                  <span className="text-[15px] leading-none">{meta.flag}</span>
                  {meta.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
