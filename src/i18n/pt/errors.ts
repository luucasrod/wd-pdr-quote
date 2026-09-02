import type { TranslationShape } from "../translations"

export const errors = {
notFound: {
    code: "404",
    title: "Página não encontrada",
    subtitle: "O endereço que procura não existe ou foi alterado.",
    backHome: "Voltar ao início",
  },
errorBoundary: {
    title: "Algo correu mal",
    subtitle: "Não foi possível mostrar esta página. Tente recarregar.",
    reload: "Recarregar",
  },
} satisfies Pick<TranslationShape, "notFound" | "errorBoundary">
