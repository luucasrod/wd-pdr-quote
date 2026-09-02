import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Werkstattbereich",
    subtitle: "Geben Sie den Zugangscode ein, um fortzufahren",
    passcodeLabel: "Zugangscode",
    passcodePlaceholder: "••••",
    submitButton: "Anmelden",
    errorMessage: "Falscher Code. Bitte versuchen Sie es erneut.",
  },
} satisfies Pick<TranslationShape, "auth">
