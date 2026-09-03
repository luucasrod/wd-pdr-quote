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
    exportData: "Tout exporter (JSON)",
    exportDescription: "Téléchargez une sauvegarde des devis, clients, assureurs et paramètres.",
    importData: "Importer les données de ce navigateur",
    importingData: "Importation…",
    importDescription: "Importez les données enregistrées dans ce navigateur. Répéter l'importation ne crée pas de doublons.",
    importResult: "Importés : {clients} clients, {insurers} assureurs et {quotes} devis.",
    importError: "Impossible d'importer les données. Veuillez réessayer.",
  },
} satisfies Pick<TranslationShape, "settingsPage">
