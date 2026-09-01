import type { TranslationShape } from "../translations"

export const settings = {
settingsPage: {
    title: "Angebotseinstellungen",
    subtitle: "Richten Sie Ihre Preistabellen so ein, wie es für Ihre Werkstatt am besten passt.",
    back: "Zurück",
    tabHourly: "Stundenpreistabelle",
    tabPartTypes: "Bauteiltypen",
    sizeSmall: "Klein",
    sizeMedium: "Mittel",
    sizeLarge: "Groß",
    colQuantity: "Anzahl",
    colHourValue: "Stundenwert",
    addValue: "Wert hinzufügen",
    reset: "Auf Standard zurücksetzen",
    remove: "Entfernen",
    partTypeLabel: "Typname",
    partTypePercent: "Zuschlag %",
    addPartType: "Bauteiltyp hinzufügen",
  },
} satisfies Pick<TranslationShape, "settingsPage">
