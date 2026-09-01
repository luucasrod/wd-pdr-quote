import type { TranslationShape } from "../translations"

export const nav = {
nav: {
    dashboard: "Start",
    quotesList: "Angebote",
    clients: "Kunden",
    insurers: "Versicherer",
  },
} satisfies Pick<TranslationShape, "nav">
