import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Espace Atelier",
    subtitle: "Connectez-vous pour continuer",
    submitButton: "Entrer",
    errorMessage: "E-mail ou mot de passe incorrect. Veuillez réessayer.",
    emailLabel: "E-mail",
    passwordLabel: "Mot de passe",
    passcodeLabel: "Code d'accès",
    passcodePlaceholder: "••••",
    signingIn: "Connexion…",
    signOut: "Se déconnecter",
  },
} satisfies Pick<TranslationShape, "auth">
