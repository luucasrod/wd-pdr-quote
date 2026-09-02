import type { TranslationShape } from "../translations"

export const insurers = {
insurers: {
    title: "Assureurs",
    subtitle: "Compagnies d'assurance partenaires de l'atelier.",
    add: "Nouvel Assureur",
    edit: "Modifier l'Assureur",
    name: "Nom",
    phone: "Téléphone",
    email: "E-mail",
    notes: "Notes",
    save: "Enregistrer",
    delete: "Supprimer",
    deleteConfirm: "Supprimer cet assureur ?",
    empty: "Aucun assureur enregistré pour l'instant.",
    searchPlaceholder: "Rechercher un assureur…",
  },
} satisfies Pick<TranslationShape, "insurers">
