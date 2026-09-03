import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Área del Taller",
    subtitle: "Inicie sesión para continuar",
    submitButton: "Entrar",
    errorMessage: "Correo o contraseña incorrectos. Inténtelo de nuevo.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passcodeLabel: "Código de acceso",
    passcodePlaceholder: "••••",
    signingIn: "Entrando…",
    signOut: "Cerrar sesión",
  },
} satisfies Pick<TranslationShape, "auth">
