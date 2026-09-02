import type { TranslationShape } from "../translations"

export const settings = {
settingsPage: {
    title: "Paramètres de Devis",
    subtitle: "Configurez vos grilles tarifaires comme cela fonctionne le mieux pour votre atelier.",
    back: "Retour",
    tabHourly: "Grille Tarif Horaire",
    tabPartTypes: "Types de Pièce",
    sizeSmall: "Petit",
    sizeMedium: "Moyen",
    sizeLarge: "Grand",
    colQuantity: "Quantité",
    colHourValue: "Valeur en Heures",
    addValue: "Ajouter une valeur",
    reset: "Réinitialiser",
    remove: "Supprimer",
    partTypeLabel: "Nom du type",
    partTypePercent: "Majoration %",
    addPartType: "Ajouter un type de pièce",
  },
} satisfies Pick<TranslationShape, "settingsPage">
