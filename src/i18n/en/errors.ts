import type { TranslationShape } from "../translations"

export const errors = {
notFound: {
    code: "404",
    title: "Page not found",
    subtitle: "The address you are looking for does not exist or has changed.",
    backHome: "Back to home",
  },
errorBoundary: {
    title: "Something went wrong",
    subtitle: "We could not display this page. Please try reloading it.",
    reload: "Reload",
  },
} satisfies Pick<TranslationShape, "notFound" | "errorBoundary">
