import type { TranslationShape } from "../translations"

export const errors = {
notFound: {
    code: "404",
    title: "Página no encontrada",
    subtitle: "La dirección que buscas no existe o ha cambiado.",
    backHome: "Volver al inicio",
  },
errorBoundary: {
    title: "Algo ha salido mal",
    subtitle: "No se ha podido mostrar esta página. Intenta recargarla.",
    reload: "Recargar",
  },
} satisfies Pick<TranslationShape, "notFound" | "errorBoundary">
