import type { TranslationShape } from "../translations"

export const clients = {
clients: {
    title: "Clientes",
    subtitle: "Base de datos de clientes del taller.",
    add: "Nuevo Cliente",
    edit: "Editar Cliente",
    name: "Nombre",
    phone: "Teléfono",
    email: "Correo",
    nif: "NIF",
    address: "Dirección",
    city: "Ciudad",
    postalCode: "Código postal",
    country: "País",
    save: "Guardar",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar este cliente?",
    empty: "Aún no hay clientes registrados.",
    searchPlaceholder: "Buscar cliente…",
    createdOn: "Añadido el",
  },
} satisfies Pick<TranslationShape, "clients">
