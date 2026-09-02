import type { TranslationShape } from "../translations"

export const nav = {
nav: {
    dashboard: "Início",
    quotesList: "Orçamentos",
    clients: "Clientes",
    insurers: "Seguradoras",
  },
} satisfies Pick<TranslationShape, "nav">
