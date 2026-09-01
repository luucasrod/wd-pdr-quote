import type { TranslationShape } from "../translations"

export const errors = {
notFound: {
    code: "404",
    title: "Seite nicht gefunden",
    subtitle: "Die gesuchte Adresse existiert nicht oder wurde geändert.",
    backHome: "Zur Startseite",
  },
errorBoundary: {
    title: "Etwas ist schiefgelaufen",
    subtitle: "Diese Seite konnte nicht angezeigt werden. Bitte laden Sie sie neu.",
    reload: "Neu laden",
  },
} satisfies Pick<TranslationShape, "notFound" | "errorBoundary">
