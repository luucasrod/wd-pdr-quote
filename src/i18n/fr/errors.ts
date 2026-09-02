import type { TranslationShape } from "../translations"

export const errors = {
notFound: {
    code: "404",
    title: "Page introuvable",
    subtitle: "L’adresse que vous recherchez n’existe pas ou a été modifiée.",
    backHome: "Retour à l’accueil",
  },
errorBoundary: {
    title: "Un problème est survenu",
    subtitle: "Impossible d’afficher cette page. Essayez de la recharger.",
    reload: "Recharger",
  },
} satisfies Pick<TranslationShape, "notFound" | "errorBoundary">
