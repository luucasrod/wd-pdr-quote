import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Área da Oficina",
    subtitle: "Introduza o código de acesso para continuar",
    passcodeLabel: "Código de acesso",
    passcodePlaceholder: "••••",
    submitButton: "Entrar",
    errorMessage: "Código incorreto. Tente novamente.",
  },
} satisfies Pick<TranslationShape, "auth">
