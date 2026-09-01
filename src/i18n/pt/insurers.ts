import type { TranslationShape } from "../translations"

export const insurers = {
insurers: {
    title: "Seguradoras",
    subtitle: "Seguradoras com quem a oficina trabalha.",
    add: "Nova Seguradora",
    edit: "Editar Seguradora",
    name: "Nome",
    phone: "Telefone",
    email: "Email",
    notes: "Notas",
    save: "Guardar",
    delete: "Eliminar",
    deleteConfirm: "Eliminar esta seguradora?",
    empty: "Ainda não há seguradoras registadas.",
    searchPlaceholder: "Procurar seguradora…",
  },
} satisfies Pick<TranslationShape, "insurers">
