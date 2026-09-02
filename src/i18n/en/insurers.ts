import type { TranslationShape } from "../translations"

export const insurers = {
insurers: {
    title: "Insurers",
    subtitle: "Insurance companies your shop works with.",
    add: "New Insurer",
    edit: "Edit Insurer",
    name: "Name",
    phone: "Phone",
    email: "Email",
    notes: "Notes",
    save: "Save",
    delete: "Delete",
    deleteConfirm: "Delete this insurer?",
    empty: "No insurers yet.",
    searchPlaceholder: "Search insurer…",
  },
} satisfies Pick<TranslationShape, "insurers">
