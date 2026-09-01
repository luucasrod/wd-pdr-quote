import type { TranslationShape } from "../translations"

export const insurers = {
insurers: {
    title: "Versicherer",
    subtitle: "Versicherungen, mit denen die Werkstatt zusammenarbeitet.",
    add: "Neuer Versicherer",
    edit: "Versicherer bearbeiten",
    name: "Name",
    phone: "Telefon",
    email: "E-Mail",
    notes: "Notizen",
    save: "Speichern",
    delete: "Löschen",
    deleteConfirm: "Diesen Versicherer löschen?",
    empty: "Noch keine Versicherer erfasst.",
    searchPlaceholder: "Versicherer suchen…",
  },
} satisfies Pick<TranslationShape, "insurers">
