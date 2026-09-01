import type { TranslationShape } from "../translations"

export const nav = {
nav: {
    dashboard: "Accueil",
    quotesList: "Devis",
    clients: "Clients",
    insurers: "Assureurs",
  },
} satisfies Pick<TranslationShape, "nav">
