import type { TranslationShape } from "../translations"

export const nav = {
nav: {
    dashboard: "Inicio",
    quotesList: "Presupuestos",
    clients: "Clientes",
    insurers: "Aseguradoras",
  },
} satisfies Pick<TranslationShape, "nav">
