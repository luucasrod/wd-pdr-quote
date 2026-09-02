import type { TranslationShape } from "../translations"

export const settings = {
settingsPage: {
    title: "Quote Settings",
    subtitle: "Set up your pricing tables the way that works best for your shop.",
    back: "Back",
    tabHourly: "Hourly Price Table",
    tabPartTypes: "Part Types",
    sizeSmall: "Small",
    sizeMedium: "Medium",
    sizeLarge: "Large",
    colQuantity: "Quantity",
    colHourValue: "Hour Value",
    addValue: "Add value",
    reset: "Reset to default",
    remove: "Remove",
    partTypeLabel: "Type name",
    partTypePercent: "Surcharge %",
    addPartType: "Add part type",
    exportData: "Export all (JSON)",
    exportDescription: "Download a backup of quotes, clients, insurers and settings.",
  },
} satisfies Pick<TranslationShape, "settingsPage">
