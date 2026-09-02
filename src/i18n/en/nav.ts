import type { TranslationShape } from "../translations"

export const nav = {
nav: {
    dashboard: "Home",
    quotesList: "Quotes",
    clients: "Clients",
    insurers: "Insurers",
  },
} satisfies Pick<TranslationShape, "nav">
