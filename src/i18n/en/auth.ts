import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Workshop Area",
    subtitle: "Sign in to continue",
    submitButton: "Enter",
    errorMessage: "Incorrect email or password. Please try again.",
    emailLabel: "Email",
    passwordLabel: "Password",
    passcodeLabel: "Access code",
    passcodePlaceholder: "••••",
    signingIn: "Signing in…",
    signOut: "Sign out",
  },
} satisfies Pick<TranslationShape, "auth">
