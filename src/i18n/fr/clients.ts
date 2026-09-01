import type { TranslationShape } from "../translations"

export const clients = {
clients: {
    title: "Clients",
    subtitle: "Base de données clients de l'atelier.",
    add: "Nouveau Client",
    edit: "Modifier le Client",
    name: "Nom",
    phone: "Téléphone",
    email: "E-mail",
    nif: "N° fiscal",
    address: "Adresse",
    save: "Enregistrer",
    delete: "Supprimer",
    deleteConfirm: "Supprimer ce client ?",
    empty: "Aucun client enregistré pour l'instant.",
    searchPlaceholder: "Rechercher un client…",
    createdOn: "Ajouté le",
  },
} satisfies Pick<TranslationShape, "clients">
