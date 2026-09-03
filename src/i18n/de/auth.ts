import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Werkstattbereich",
    subtitle: "Melden Sie sich an, um fortzufahren",
    submitButton: "Anmelden",
    errorMessage: "E-Mail oder Passwort ist falsch. Bitte versuchen Sie es erneut.",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    passcodeLabel: "Zugangscode",
    passcodePlaceholder: "••••",
    signingIn: "Anmeldung…",
    signOut: "Abmelden",
  },
} satisfies Pick<TranslationShape, "auth">
