import type { TranslationShape } from "../translations"

export const insurers = {
insurers: {
    title: "Aseguradoras",
    subtitle: "Aseguradoras con las que trabaja el taller.",
    add: "Nueva Aseguradora",
    edit: "Editar Aseguradora",
    name: "Nombre",
    phone: "Teléfono",
    email: "Correo",
    notes: "Notas",
    save: "Guardar",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar esta aseguradora?",
    empty: "Aún no hay aseguradoras registradas.",
    searchPlaceholder: "Buscar aseguradora…",
  },
} satisfies Pick<TranslationShape, "insurers">
