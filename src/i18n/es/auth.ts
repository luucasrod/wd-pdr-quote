import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Área del Taller",
    subtitle: "Introduzca el código de acceso para continuar",
    passcodeLabel: "Código de acceso",
    passcodePlaceholder: "••••",
    submitButton: "Entrar",
    errorMessage: "Código incorrecto. Inténtelo de nuevo.",
  },
} satisfies Pick<TranslationShape, "auth">
