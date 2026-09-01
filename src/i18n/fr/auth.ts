import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Espace Atelier",
    subtitle: "Saisissez le code d'accès pour continuer",
    passcodeLabel: "Code d'accès",
    passcodePlaceholder: "••••",
    submitButton: "Entrer",
    errorMessage: "Code incorrect. Veuillez réessayer.",
  },
} satisfies Pick<TranslationShape, "auth">
