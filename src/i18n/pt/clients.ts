import type { TranslationShape } from "../translations"

export const clients = {
clients: {
    title: "Clientes",
    subtitle: "Base de dados de clientes da oficina.",
    add: "Novo Cliente",
    edit: "Editar Cliente",
    name: "Nome",
    phone: "Telefone",
    email: "Email",
    nif: "NIF",
    address: "Morada",
    city: "Cidade",
    postalCode: "Código postal",
    country: "País",
    save: "Guardar",
    delete: "Eliminar",
    deleteConfirm: "Eliminar este cliente?",
    empty: "Ainda não há clientes registados.",
    searchPlaceholder: "Procurar cliente…",
    createdOn: "Registado em",
  },
} satisfies Pick<TranslationShape, "clients">
