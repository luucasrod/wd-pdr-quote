import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Workshop Area",
    subtitle: "Enter the access code to continue",
    passcodeLabel: "Access code",
    passcodePlaceholder: "••••",
    submitButton: "Enter",
    errorMessage: "Incorrect code. Please try again.",
  },
} satisfies Pick<TranslationShape, "auth">
