import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { Language, TranslationShape } from "@/i18n/translations"
import { TRANSLATIONS } from "@/i18n/translations"
import { escreverJson, lerJson } from "@/lib/storage"

const STORAGE_KEY = "wd-pdr-language"

function detectInitialLanguage(): Language {
  const saved = lerJson<Language | null>(STORAGE_KEY, null)
  if (saved && saved in TRANSLATIONS) return saved
  const browserLang = navigator.language.slice(0, 2).toLowerCase()
  if (browserLang in TRANSLATIONS) return browserLang as Language
  return "pt"
}

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationShape
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage)

  useEffect(() => {
    escreverJson(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
