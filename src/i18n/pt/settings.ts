import type { TranslationShape } from "../translations"

export const settings = {
settingsPage: {
    title: "Configurações de Orçamento",
    subtitle: "Monte as tabelas de preço do jeito que funcionar melhor para a sua oficina.",
    back: "Voltar",
    tabHourly: "Tabela de Preços por Hora",
    tabPartTypes: "Tipos de Peça",
    sizeSmall: "Pequeno",
    sizeMedium: "Médio",
    sizeLarge: "Grande",
    colQuantity: "Quantidade",
    colHourValue: "Valor em Horas",
    addValue: "Adicionar valor",
    reset: "Repor padrão",
    remove: "Remover",
    partTypeLabel: "Nome do tipo",
    partTypePercent: "Acréscimo %",
    addPartType: "Adicionar tipo de peça",
    exportData: "Exportar tudo (JSON)",
    exportDescription: "Descarregue uma cópia de segurança dos orçamentos, clientes, seguradoras e definições.",
  },
} satisfies Pick<TranslationShape, "settingsPage">
