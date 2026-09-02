import type { TranslationShape } from "../translations"

export const settings = {
settingsPage: {
    title: "Ajustes de Presupuesto",
    subtitle: "Configura tus tablas de precios como mejor funcione para tu taller.",
    back: "Volver",
    tabHourly: "Tabla de Precio por Hora",
    tabPartTypes: "Tipos de Pieza",
    sizeSmall: "Pequeño",
    sizeMedium: "Medio",
    sizeLarge: "Grande",
    colQuantity: "Cantidad",
    colHourValue: "Valor en Horas",
    addValue: "Añadir valor",
    reset: "Restablecer",
    remove: "Eliminar",
    partTypeLabel: "Nombre del tipo",
    partTypePercent: "Recargo %",
    addPartType: "Añadir tipo de pieza",
  },
} satisfies Pick<TranslationShape, "settingsPage">
