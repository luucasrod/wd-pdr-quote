import type { TranslationShape } from "../translations"

export const clients = {
clients: {
    title: "Clients",
    subtitle: "Your shop's customer database.",
    add: "New Client",
    edit: "Edit Client",
    name: "Name",
    phone: "Phone",
    email: "Email",
    nif: "Tax ID",
    address: "Address",
    city: "City",
    postalCode: "Postcode",
    country: "Country",
    save: "Save",
    delete: "Delete",
    deleteConfirm: "Delete this client?",
    empty: "No clients yet.",
    searchPlaceholder: "Search client…",
    createdOn: "Added on",
  },
} satisfies Pick<TranslationShape, "clients">
