import type { TranslationShape } from "../translations"

export const auth = {
auth: {
    title: "Área da Oficina",
    subtitle: "Inicie sessão para continuar",
    submitButton: "Entrar",
    errorMessage: "Email ou palavra-passe incorretos. Tente novamente.",
    emailLabel: "Email",
    passwordLabel: "Palavra-passe",
    passcodeLabel: "Código de acesso",
    passcodePlaceholder: "••••",
    signingIn: "A entrar…",
    signOut: "Terminar sessão",
  },
} satisfies Pick<TranslationShape, "auth">
