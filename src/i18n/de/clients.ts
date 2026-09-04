import type { TranslationShape } from "../translations"

export const clients = {
clients: {
    title: "Kunden",
    subtitle: "Kundendatenbank der Werkstatt.",
    add: "Neuer Kunde",
    edit: "Kunde bearbeiten",
    name: "Name",
    phone: "Telefon",
    email: "E-Mail",
    nif: "Steuernummer",
    address: "Adresse",
    city: "Stadt",
    postalCode: "Postleitzahl",
    country: "Land",
    save: "Speichern",
    delete: "Löschen",
    deleteConfirm: "Diesen Kunden löschen?",
    empty: "Noch keine Kunden erfasst.",
    searchPlaceholder: "Kunde suchen…",
    createdOn: "Erfasst am",
  },
} satisfies Pick<TranslationShape, "clients">
