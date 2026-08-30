export type Language = "pt" | "en" | "de" | "fr" | "es"

export const LANGUAGE_META: Record<Language, { label: string; flag: string }> = {
  pt: { label: "Português", flag: "🇵🇹" },
  en: { label: "English", flag: "🇬🇧" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  fr: { label: "Français", flag: "🇫🇷" },
  es: { label: "Español", flag: "🇪🇸" },
}

export interface TranslationShape {
  common: {
    appName: string
    tagline: string
    newQuote: string
    search: string
    searchPlaceholder: string
    noResults: string
    settings: string
    quotes: string
    changeType: string
  }
  typeSelect: {
    title: string
    subtitle: string
    types: Record<"sedan" | "suv" | "wagon" | "compact" | "van", { label: string; description: string }>
  }
  quotePage: {
    title: string
    subtitle: string
  }
  views: Record<"top" | "front" | "right" | "rear" | "left", string>
  viewer: {
    hint: string
    markingAreaLabel: string
    markingAreaInstruction: string
  }
  brush: {
    label: string
  }
  severity: {
    minor: string
    medium: string
    severe: string
  }
  parts: Record<
    | "hood"
    | "roof"
    | "roofRailLeft"
    | "roofRailRight"
    | "fenderFrontLeft"
    | "fenderFrontRight"
    | "doorFrontLeft"
    | "doorFrontRight"
    | "doorRearLeft"
    | "doorRearRight"
    | "quarterPanelLeft"
    | "quarterPanelRight"
    | "sillLeft"
    | "sillRight"
    | "trunkUpper"
    | "trunkLower",
    string
  >
  pricing: {
    title: string
    subtitle: string
    emptyState: string
    colPart: string
    colMinor: string
    colMedium: string
    colSevere: string
    colAluminum: string
    colAW: string
    subtotal: string
    prep: string
    finish: string
    surcharge1: string
    surcharge2: string
    totalAW: string
    hourlyRate: string
    totalQuote: string
  }
  settingsPage: {
    title: string
    subtitle: string
    back: string
    tabHourly: string
    tabPartTypes: string
    sizeSmall: string
    sizeMedium: string
    sizeLarge: string
    colQuantity: string
    colHourValue: string
    addValue: string
    reset: string
    remove: string
    partTypeLabel: string
    partTypePercent: string
    addPartType: string
  }
  nav: {
    dashboard: string
    quotesList: string
    clients: string
    insurers: string
  }
  clients: {
    title: string
    subtitle: string
    add: string
    edit: string
    name: string
    phone: string
    email: string
    nif: string
    address: string
    save: string
    delete: string
    deleteConfirm: string
    empty: string
    searchPlaceholder: string
    createdOn: string
  }
  insurers: {
    title: string
    subtitle: string
    add: string
    edit: string
    name: string
    phone: string
    email: string
    notes: string
    save: string
    delete: string
    deleteConfirm: string
    empty: string
    searchPlaceholder: string
  }
  quotesList: {
    title: string
    subtitle: string
    newQuote: string
    empty: string
    statusDraft: string
    statusSent: string
    statusApproved: string
    statusRejected: string
    colClient: string
    colVehicle: string
    colDate: string
    colStatus: string
    colTotal: string
    noClient: string
    delete: string
    deleteConfirm: string
    view: string
  }
  quoteMeta: {
    title: string
    clientLabel: string
    insurerLabel: string
    plateLabel: string
    plateePlaceholder: string
    notesLabel: string
    notesPlaceholder: string
    none: string
    selectClient: string
    selectInsurer: string
    saveQuote: string
    savedToast: string
    print: string
    edit: string
    backToList: string
    newClient: string
    statusLabel: string
    breakdownTitle: string
  }
  dashboard: {
    title: string
    subtitle: string
    statQuotesMonth: string
    statPending: string
    statApproved: string
    statRevenue: string
    recentQuotes: string
    viewAll: string
  }
  customer: {
    heroTitle: string
    heroSubtitle: string
    stepVehicle: string
    stepDamage: string
    stepContact: string
    continueButton: string
    backButton: string
    yourEstimate: string
    estimateNote: string
    contactTitle: string
    contactSubtitle: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    plateLabel: string
    notesLabel: string
    notesPlaceholder: string
    consentLabel: string
    privacyLinkLabel: string
    submitButton: string
    submittingButton: string
    doneTitle: string
    doneSubtitle: string
    downloadPdf: string
    newRequest: string
    requiredFieldsNote: string
  }
  notFound: {
    code: string
    title: string
    subtitle: string
    backHome: string
  }
  errorBoundary: {
    title: string
    subtitle: string
    reload: string
  }
  auth: {
    title: string
    subtitle: string
    passcodeLabel: string
    passcodePlaceholder: string
    submitButton: string
    errorMessage: string
  }
}

export const TRANSLATIONS: Record<Language, TranslationShape> = {
  pt: {
    common: {
      appName: "WD PDR",
      tagline: "Paintless Dent Removal",
      newQuote: "Novo Orçamento",
      search: "Procurar",
      searchPlaceholder: "Procurar orçamento, cliente ou matrícula…",
      noResults: "Sem resultados",
      settings: "Definições",
      quotes: "Orçamentos",
      changeType: "trocar tipo",
    },
    typeSelect: {
      title: "Qual o tipo de veículo?",
      subtitle: "Escolha a categoria mais próxima — depois é só marcar os danos diretamente na imagem.",
      types: {
        sedan: { label: "Sedan", description: "Carroçaria baixa, três volumes" },
        suv: { label: "SUV", description: "Carroçaria alta, rodas grandes" },
        wagon: { label: "Carrinha", description: "Perua longa, mala grande" },
        compact: { label: "Compacto", description: "Citadino, 5 portas" },
        van: { label: "Van", description: "Utilitário, carroçaria alta" },
      },
    },
    quotePage: {
      title: "Novo Orçamento",
      subtitle: "Rode o veículo e clique diretamente na carroçaria para marcar cada amolgadela.",
    },
    views: { top: "Topo", front: "Frente", right: "Direita", rear: "Traseira", left: "Esquerda" },
    viewer: {
      hint: "Clique em qualquer ponto do carro para marcar um dano",
      markingAreaLabel: "Área de marcação",
      markingAreaInstruction: "Clique para adicionar um dano.",
    },
    brush: { label: "Tamanho do marcador" },
    severity: { minor: "Ligeira", medium: "Média", severe: "Severa" },
    parts: {
      hood: "Capot",
      roof: "Tejadilho",
      roofRailLeft: "Calha do Tejadilho Esq.",
      roofRailRight: "Calha do Tejadilho Dir.",
      fenderFrontLeft: "Guarda-lamas Diant. Esq.",
      fenderFrontRight: "Guarda-lamas Diant. Dir.",
      doorFrontLeft: "Porta Diant. Esq.",
      doorFrontRight: "Porta Diant. Dir.",
      doorRearLeft: "Porta Tras. Esq.",
      doorRearRight: "Porta Tras. Dir.",
      quarterPanelLeft: "Parede Lateral Esq.",
      quarterPanelRight: "Parede Lateral Dir.",
      sillLeft: "Soleira Esq.",
      sillRight: "Soleira Dir.",
      trunkUpper: "Tampa da Mala (Sup.)",
      trunkLower: "Tampa da Mala (Inf.)",
    },
    pricing: {
      title: "Orçamento — Tabela de Granizo WKO",
      subtitle: "Valores oficiais da Wirtschaftskammer Österreich (Lack- u. Karosseriebeirat)",
      emptyState: "Marque danos no veículo para ver o cálculo aparecer aqui.",
      colPart: "Peça",
      colMinor: "Ligeiras",
      colMedium: "Médias",
      colSevere: "Severas",
      colAluminum: "Tipo",
      colAW: "AW",
      subtotal: "Subtotal (peças)",
      prep: "Preparação (0,2 AW/peça, máx. 1 AW)",
      finish: "Finish (manual)",
      surcharge1: "Acréscimo 25% (motivo 1)",
      surcharge2: "Acréscimo 25% (motivo 2)",
      totalAW: "Total Arbeitsaufwand",
      hourlyRate: "Valor da hora (AW)",
      totalQuote: "Total do Orçamento",
    },
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
    },
    nav: {
      dashboard: "Início",
      quotesList: "Orçamentos",
      clients: "Clientes",
      insurers: "Seguradoras",
    },
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
      save: "Guardar",
      delete: "Eliminar",
      deleteConfirm: "Eliminar este cliente?",
      empty: "Ainda não há clientes registados.",
      searchPlaceholder: "Procurar cliente…",
      createdOn: "Registado em",
    },
    insurers: {
      title: "Seguradoras",
      subtitle: "Seguradoras com quem a oficina trabalha.",
      add: "Nova Seguradora",
      edit: "Editar Seguradora",
      name: "Nome",
      phone: "Telefone",
      email: "Email",
      notes: "Notas",
      save: "Guardar",
      delete: "Eliminar",
      deleteConfirm: "Eliminar esta seguradora?",
      empty: "Ainda não há seguradoras registadas.",
      searchPlaceholder: "Procurar seguradora…",
    },
    quotesList: {
      title: "Orçamentos",
      subtitle: "Histórico de orçamentos guardados.",
      newQuote: "Novo Orçamento",
      empty: "Ainda não há orçamentos guardados.",
      statusDraft: "Rascunho",
      statusSent: "Enviado",
      statusApproved: "Aprovado",
      statusRejected: "Recusado",
      colClient: "Cliente",
      colVehicle: "Veículo",
      colDate: "Data",
      colStatus: "Estado",
      colTotal: "Total",
      noClient: "Sem cliente",
      delete: "Eliminar",
      deleteConfirm: "Eliminar este orçamento?",
      view: "Ver",
    },
    quoteMeta: {
      title: "Detalhes do Orçamento",
      clientLabel: "Cliente",
      insurerLabel: "Seguradora",
      plateLabel: "Matrícula",
      plateePlaceholder: "AA-00-AA",
      notesLabel: "Notas",
      notesPlaceholder: "Observações adicionais…",
      none: "Nenhum(a)",
      selectClient: "Selecionar cliente",
      selectInsurer: "Selecionar seguradora",
      saveQuote: "Guardar Orçamento",
      savedToast: "Orçamento guardado",
      print: "Baixar PDF",
      edit: "Editar Orçamento",
      backToList: "Ver Orçamentos",
      newClient: "+ Criar novo cliente",
      statusLabel: "Estado",
      breakdownTitle: "Detalhe por Peça",
    },
    dashboard: {
      title: "Olá 👋",
      subtitle: "Aqui está um resumo da sua oficina.",
      statQuotesMonth: "Orçamentos este mês",
      statPending: "Pendentes",
      statApproved: "Aprovados",
      statRevenue: "Valor aprovado",
      recentQuotes: "Orçamentos recentes",
      viewAll: "Ver todos",
    },
    customer: {
      heroTitle: "Peça o seu orçamento em 2 minutos",
      heroSubtitle: "Escolha o seu veículo, marque as amolgadelas e receba o valor na hora.",
      stepVehicle: "Veículo",
      stepDamage: "Danos",
      stepContact: "Contacto",
      continueButton: "Continuar",
      backButton: "Voltar",
      yourEstimate: "O seu orçamento estimado",
      estimateNote: "Valor sujeito a confirmação final pela oficina.",
      contactTitle: "Os seus dados",
      contactSubtitle: "Para lhe enviarmos o orçamento.",
      nameLabel: "Nome",
      namePlaceholder: "O seu nome",
      phoneLabel: "Telefone",
      phonePlaceholder: "912 345 678",
      emailLabel: "Email",
      emailPlaceholder: "email@exemplo.com",
      plateLabel: "Matrícula (opcional)",
      notesLabel: "Alguma observação?",
      notesPlaceholder: "Opcional…",
      consentLabel: "Aceito ser contactado pela WD PDR sobre este orçamento.",
      privacyLinkLabel: "Ver política de privacidade",
      submitButton: "Enviar Pedido",
      submittingButton: "A enviar…",
      doneTitle: "Orçamento guardado! 🎉",
      doneSubtitle: "Descarregue o PDF e contacte a oficina para enviar o seu pedido.",
      downloadPdf: "Descarregar PDF",
      newRequest: "Novo Pedido",
      requiredFieldsNote: "Campos obrigatórios",
    },
    notFound: {
      code: "404",
      title: "Página não encontrada",
      subtitle: "O endereço que procura não existe ou foi alterado.",
      backHome: "Voltar ao início",
    },
    errorBoundary: {
      title: "Algo correu mal",
      subtitle: "Não foi possível mostrar esta página. Tente recarregar.",
      reload: "Recarregar",
    },
    auth: {
      title: "Área da Oficina",
      subtitle: "Introduza o código de acesso para continuar",
      passcodeLabel: "Código de acesso",
      passcodePlaceholder: "••••",
      submitButton: "Entrar",
      errorMessage: "Código incorreto. Tente novamente.",
    },
  },
  en: {
    common: {
      appName: "WD PDR",
      tagline: "Paintless Dent Removal",
      newQuote: "New Quote",
      search: "Search",
      searchPlaceholder: "Search quote, customer or plate…",
      noResults: "No results",
      settings: "Settings",
      quotes: "Quotes",
      changeType: "change type",
    },
    typeSelect: {
      title: "What type of vehicle?",
      subtitle: "Pick the closest category — then just mark the damage directly on the photo.",
      types: {
        sedan: { label: "Sedan", description: "Low body, three-box shape" },
        suv: { label: "SUV", description: "Tall body, large wheels" },
        wagon: { label: "Estate", description: "Long wagon, big boot" },
        compact: { label: "Compact", description: "City car, 5 doors" },
        van: { label: "Van", description: "Commercial, tall body" },
      },
    },
    quotePage: {
      title: "New Quote",
      subtitle: "Rotate the vehicle and click directly on the body to mark each dent.",
    },
    views: { top: "Top", front: "Front", right: "Right", rear: "Rear", left: "Left" },
    viewer: {
      hint: "Click anywhere on the car to mark a dent",
      markingAreaLabel: "Marking area",
      markingAreaInstruction: "Click to add a dent.",
    },
    brush: { label: "Marker size" },
    severity: { minor: "Minor", medium: "Medium", severe: "Severe" },
    parts: {
      hood: "Hood",
      roof: "Roof",
      roofRailLeft: "Roof Rail L.",
      roofRailRight: "Roof Rail R.",
      fenderFrontLeft: "Front Fender L.",
      fenderFrontRight: "Front Fender R.",
      doorFrontLeft: "Front Door L.",
      doorFrontRight: "Front Door R.",
      doorRearLeft: "Rear Door L.",
      doorRearRight: "Rear Door R.",
      quarterPanelLeft: "Quarter Panel L.",
      quarterPanelRight: "Quarter Panel R.",
      sillLeft: "Sill L.",
      sillRight: "Sill R.",
      trunkUpper: "Trunk Lid (Upper)",
      trunkLower: "Trunk Lid (Lower)",
    },
    pricing: {
      title: "Quote — WKO Hail Table",
      subtitle: "Official Wirtschaftskammer Österreich values (Lack- u. Karosseriebeirat)",
      emptyState: "Mark damage on the vehicle to see the calculation appear here.",
      colPart: "Part",
      colMinor: "Minor",
      colMedium: "Medium",
      colSevere: "Severe",
      colAluminum: "Type",
      colAW: "AW",
      subtotal: "Subtotal (parts)",
      prep: "Prep (0.2 AW/part, max 1 AW)",
      finish: "Finish (manual)",
      surcharge1: "25% surcharge (reason 1)",
      surcharge2: "25% surcharge (reason 2)",
      totalAW: "Total Arbeitsaufwand",
      hourlyRate: "Hourly rate (AW)",
      totalQuote: "Quote Total",
    },
    settingsPage: {
      title: "Quote Settings",
      subtitle: "Set up your pricing tables the way that works best for your shop.",
      back: "Back",
      tabHourly: "Hourly Price Table",
      tabPartTypes: "Part Types",
      sizeSmall: "Small",
      sizeMedium: "Medium",
      sizeLarge: "Large",
      colQuantity: "Quantity",
      colHourValue: "Hour Value",
      addValue: "Add value",
      reset: "Reset to default",
      remove: "Remove",
      partTypeLabel: "Type name",
      partTypePercent: "Surcharge %",
      addPartType: "Add part type",
    },
    nav: {
      dashboard: "Home",
      quotesList: "Quotes",
      clients: "Clients",
      insurers: "Insurers",
    },
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
      save: "Save",
      delete: "Delete",
      deleteConfirm: "Delete this client?",
      empty: "No clients yet.",
      searchPlaceholder: "Search client…",
      createdOn: "Added on",
    },
    insurers: {
      title: "Insurers",
      subtitle: "Insurance companies your shop works with.",
      add: "New Insurer",
      edit: "Edit Insurer",
      name: "Name",
      phone: "Phone",
      email: "Email",
      notes: "Notes",
      save: "Save",
      delete: "Delete",
      deleteConfirm: "Delete this insurer?",
      empty: "No insurers yet.",
      searchPlaceholder: "Search insurer…",
    },
    quotesList: {
      title: "Quotes",
      subtitle: "History of saved quotes.",
      newQuote: "New Quote",
      empty: "No quotes saved yet.",
      statusDraft: "Draft",
      statusSent: "Sent",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      colClient: "Client",
      colVehicle: "Vehicle",
      colDate: "Date",
      colStatus: "Status",
      colTotal: "Total",
      noClient: "No client",
      delete: "Delete",
      deleteConfirm: "Delete this quote?",
      view: "View",
    },
    quoteMeta: {
      title: "Quote Details",
      clientLabel: "Client",
      insurerLabel: "Insurer",
      plateLabel: "Plate",
      plateePlaceholder: "AB-12-CD",
      notesLabel: "Notes",
      notesPlaceholder: "Additional notes…",
      none: "None",
      selectClient: "Select client",
      selectInsurer: "Select insurer",
      saveQuote: "Save Quote",
      savedToast: "Quote saved",
      print: "Download PDF",
      edit: "Edit Quote",
      backToList: "View Quotes",
      newClient: "+ Create new client",
      statusLabel: "Status",
      breakdownTitle: "Part Breakdown",
    },
    dashboard: {
      title: "Hi 👋",
      subtitle: "Here's an overview of your shop.",
      statQuotesMonth: "Quotes this month",
      statPending: "Pending",
      statApproved: "Approved",
      statRevenue: "Approved value",
      recentQuotes: "Recent quotes",
      viewAll: "View all",
    },
    customer: {
      heroTitle: "Get your quote in 2 minutes",
      heroSubtitle: "Pick your vehicle, mark the dents and get an instant estimate.",
      stepVehicle: "Vehicle",
      stepDamage: "Damage",
      stepContact: "Contact",
      continueButton: "Continue",
      backButton: "Back",
      yourEstimate: "Your estimated quote",
      estimateNote: "Final value subject to confirmation by the shop.",
      contactTitle: "Your details",
      contactSubtitle: "So we can send you the quote.",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      phoneLabel: "Phone",
      phonePlaceholder: "Phone number",
      emailLabel: "Email",
      emailPlaceholder: "email@example.com",
      plateLabel: "Plate (optional)",
      notesLabel: "Any notes?",
      notesPlaceholder: "Optional…",
      consentLabel: "I agree to be contacted by WD PDR about this quote.",
      privacyLinkLabel: "View privacy policy",
      submitButton: "Send Request",
      submittingButton: "Sending…",
      doneTitle: "Quote saved! 🎉",
      doneSubtitle: "Download the PDF and contact the shop to send your request.",
      downloadPdf: "Download PDF",
      newRequest: "New Request",
      requiredFieldsNote: "Required fields",
    },
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
    auth: {
      title: "Workshop Area",
      subtitle: "Enter the access code to continue",
      passcodeLabel: "Access code",
      passcodePlaceholder: "••••",
      submitButton: "Enter",
      errorMessage: "Incorrect code. Please try again.",
    },
  },
  de: {
    common: {
      appName: "WD PDR",
      tagline: "Paintless Dent Removal",
      newQuote: "Neues Angebot",
      search: "Suchen",
      searchPlaceholder: "Angebot, Kunde oder Kennzeichen suchen…",
      noResults: "Keine Ergebnisse",
      settings: "Einstellungen",
      quotes: "Angebote",
      changeType: "Typ ändern",
    },
    typeSelect: {
      title: "Welcher Fahrzeugtyp?",
      subtitle: "Wählen Sie die passendste Kategorie — danach markieren Sie die Schäden direkt im Bild.",
      types: {
        sedan: { label: "Limousine", description: "Flache Karosserie, drei Boxen" },
        suv: { label: "SUV", description: "Hohe Karosserie, große Räder" },
        wagon: { label: "Kombi", description: "Langer Kombi, großer Kofferraum" },
        compact: { label: "Kompakt", description: "Stadtauto, 5 Türen" },
        van: { label: "Van", description: "Nutzfahrzeug, hohe Karosserie" },
      },
    },
    quotePage: {
      title: "Neues Angebot",
      subtitle: "Drehen Sie das Fahrzeug und klicken Sie direkt auf die Karosserie, um jede Delle zu markieren.",
    },
    views: { top: "Oben", front: "Front", right: "Rechts", rear: "Heck", left: "Links" },
    viewer: {
      hint: "Klicken Sie irgendwo auf das Auto, um eine Delle zu markieren",
      markingAreaLabel: "Markierungsbereich",
      markingAreaInstruction: "Klicken Sie, um eine Delle hinzuzufügen.",
    },
    brush: { label: "Markergröße" },
    severity: { minor: "Leicht", medium: "Mittel", severe: "Stark" },
    parts: {
      hood: "Motorhaube",
      roof: "Dach",
      roofRailLeft: "Dachrahmen links",
      roofRailRight: "Dachrahmen rechts",
      fenderFrontLeft: "Kotflügel vorne links",
      fenderFrontRight: "Kotflügel vorne rechts",
      doorFrontLeft: "Tür vorne links",
      doorFrontRight: "Tür vorne rechts",
      doorRearLeft: "Tür hinten links",
      doorRearRight: "Tür hinten rechts",
      quarterPanelLeft: "Seitenwand links",
      quarterPanelRight: "Seitenwand rechts",
      sillLeft: "Schwelle links",
      sillRight: "Schwelle rechts",
      trunkUpper: "Heckdeckel oben",
      trunkLower: "Heckdeckel unten",
    },
    pricing: {
      title: "Angebot — WKO Hageldellenliste",
      subtitle: "Offizielle Werte der Wirtschaftskammer Österreich (Lack- u. Karosseriebeirat)",
      emptyState: "Markieren Sie Schäden am Fahrzeug, damit hier die Berechnung erscheint.",
      colPart: "Bauteil",
      colMinor: "Leicht",
      colMedium: "Mittel",
      colSevere: "Stark",
      colAluminum: "Typ",
      colAW: "AW",
      subtotal: "Zwischensumme (Bauteile)",
      prep: "Vorbereitung (0,2 AW/Bauteil, max. 1 AW)",
      finish: "Finish (manuell)",
      surcharge1: "Zuschlag 25% (Grund 1)",
      surcharge2: "Zuschlag 25% (Grund 2)",
      totalAW: "Total-Arbeitsaufwand",
      hourlyRate: "Stundensatz (AW)",
      totalQuote: "Angebotssumme",
    },
    settingsPage: {
      title: "Angebotseinstellungen",
      subtitle: "Richten Sie Ihre Preistabellen so ein, wie es für Ihre Werkstatt am besten passt.",
      back: "Zurück",
      tabHourly: "Stundenpreistabelle",
      tabPartTypes: "Bauteiltypen",
      sizeSmall: "Klein",
      sizeMedium: "Mittel",
      sizeLarge: "Groß",
      colQuantity: "Anzahl",
      colHourValue: "Stundenwert",
      addValue: "Wert hinzufügen",
      reset: "Auf Standard zurücksetzen",
      remove: "Entfernen",
      partTypeLabel: "Typname",
      partTypePercent: "Zuschlag %",
      addPartType: "Bauteiltyp hinzufügen",
    },
    nav: {
      dashboard: "Start",
      quotesList: "Angebote",
      clients: "Kunden",
      insurers: "Versicherer",
    },
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
      save: "Speichern",
      delete: "Löschen",
      deleteConfirm: "Diesen Kunden löschen?",
      empty: "Noch keine Kunden erfasst.",
      searchPlaceholder: "Kunde suchen…",
      createdOn: "Erfasst am",
    },
    insurers: {
      title: "Versicherer",
      subtitle: "Versicherungen, mit denen die Werkstatt zusammenarbeitet.",
      add: "Neuer Versicherer",
      edit: "Versicherer bearbeiten",
      name: "Name",
      phone: "Telefon",
      email: "E-Mail",
      notes: "Notizen",
      save: "Speichern",
      delete: "Löschen",
      deleteConfirm: "Diesen Versicherer löschen?",
      empty: "Noch keine Versicherer erfasst.",
      searchPlaceholder: "Versicherer suchen…",
    },
    quotesList: {
      title: "Angebote",
      subtitle: "Verlauf der gespeicherten Angebote.",
      newQuote: "Neues Angebot",
      empty: "Noch keine Angebote gespeichert.",
      statusDraft: "Entwurf",
      statusSent: "Gesendet",
      statusApproved: "Genehmigt",
      statusRejected: "Abgelehnt",
      colClient: "Kunde",
      colVehicle: "Fahrzeug",
      colDate: "Datum",
      colStatus: "Status",
      colTotal: "Total",
      noClient: "Kein Kunde",
      delete: "Löschen",
      deleteConfirm: "Dieses Angebot löschen?",
      view: "Ansehen",
    },
    quoteMeta: {
      title: "Angebotsdetails",
      clientLabel: "Kunde",
      insurerLabel: "Versicherer",
      plateLabel: "Kennzeichen",
      plateePlaceholder: "W-AB 1234",
      notesLabel: "Notizen",
      notesPlaceholder: "Zusätzliche Notizen…",
      none: "Keine",
      selectClient: "Kunde auswählen",
      selectInsurer: "Versicherer auswählen",
      saveQuote: "Angebot speichern",
      savedToast: "Angebot gespeichert",
      print: "PDF herunterladen",
      edit: "Angebot bearbeiten",
      backToList: "Angebote ansehen",
      newClient: "+ Neuen Kunden anlegen",
      statusLabel: "Status",
      breakdownTitle: "Aufschlüsselung nach Teil",
    },
    dashboard: {
      title: "Hallo 👋",
      subtitle: "Hier ist eine Übersicht Ihrer Werkstatt.",
      statQuotesMonth: "Angebote diesen Monat",
      statPending: "Ausstehend",
      statApproved: "Genehmigt",
      statRevenue: "Genehmigter Wert",
      recentQuotes: "Letzte Angebote",
      viewAll: "Alle ansehen",
    },
    customer: {
      heroTitle: "Ihr Angebot in 2 Minuten",
      heroSubtitle: "Fahrzeug wählen, Dellen markieren, sofort den Wert erhalten.",
      stepVehicle: "Fahrzeug",
      stepDamage: "Schäden",
      stepContact: "Kontakt",
      continueButton: "Weiter",
      backButton: "Zurück",
      yourEstimate: "Ihr geschätztes Angebot",
      estimateNote: "Endgültiger Wert vorbehaltlich Bestätigung durch die Werkstatt.",
      contactTitle: "Ihre Daten",
      contactSubtitle: "Damit wir Ihnen das Angebot senden können.",
      nameLabel: "Name",
      namePlaceholder: "Ihr Name",
      phoneLabel: "Telefon",
      phonePlaceholder: "Telefonnummer",
      emailLabel: "E-Mail",
      emailPlaceholder: "email@beispiel.com",
      plateLabel: "Kennzeichen (optional)",
      notesLabel: "Anmerkungen?",
      notesPlaceholder: "Optional…",
      consentLabel: "Ich stimme zu, von WD PDR zu diesem Angebot kontaktiert zu werden.",
      privacyLinkLabel: "Datenschutzerklärung ansehen",
      submitButton: "Anfrage senden",
      submittingButton: "Wird gesendet…",
      doneTitle: "Angebot gespeichert! 🎉",
      doneSubtitle: "Laden Sie das PDF herunter und kontaktieren Sie die Werkstatt, um Ihre Anfrage zu senden.",
      downloadPdf: "PDF herunterladen",
      newRequest: "Neue Anfrage",
      requiredFieldsNote: "Pflichtfelder",
    },
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
    auth: {
      title: "Werkstattbereich",
      subtitle: "Geben Sie den Zugangscode ein, um fortzufahren",
      passcodeLabel: "Zugangscode",
      passcodePlaceholder: "••••",
      submitButton: "Anmelden",
      errorMessage: "Falscher Code. Bitte versuchen Sie es erneut.",
    },
  },
  fr: {
    common: {
      appName: "WD PDR",
      tagline: "Paintless Dent Removal",
      newQuote: "Nouveau Devis",
      search: "Rechercher",
      searchPlaceholder: "Rechercher devis, client ou plaque…",
      noResults: "Aucun résultat",
      settings: "Paramètres",
      quotes: "Devis",
      changeType: "changer de type",
    },
    typeSelect: {
      title: "Quel type de véhicule ?",
      subtitle: "Choisissez la catégorie la plus proche — puis marquez les dommages directement sur l'image.",
      types: {
        sedan: { label: "Berline", description: "Carrosserie basse, trois volumes" },
        suv: { label: "SUV", description: "Carrosserie haute, grandes roues" },
        wagon: { label: "Break", description: "Break long, grand coffre" },
        compact: { label: "Citadine", description: "Petite voiture, 5 portes" },
        van: { label: "Fourgon", description: "Utilitaire, carrosserie haute" },
      },
    },
    quotePage: {
      title: "Nouveau Devis",
      subtitle: "Tournez le véhicule et cliquez directement sur la carrosserie pour marquer chaque impact.",
    },
    views: { top: "Dessus", front: "Avant", right: "Droite", rear: "Arrière", left: "Gauche" },
    viewer: {
      hint: "Cliquez n'importe où sur la voiture pour marquer un impact",
      markingAreaLabel: "Zone de marquage",
      markingAreaInstruction: "Cliquez pour ajouter un impact.",
    },
    brush: { label: "Taille du marqueur" },
    severity: { minor: "Léger", medium: "Moyen", severe: "Fort" },
    parts: {
      hood: "Capot",
      roof: "Toit",
      roofRailLeft: "Longeron de toit G.",
      roofRailRight: "Longeron de toit D.",
      fenderFrontLeft: "Aile avant G.",
      fenderFrontRight: "Aile avant D.",
      doorFrontLeft: "Porte avant G.",
      doorFrontRight: "Porte avant D.",
      doorRearLeft: "Porte arrière G.",
      doorRearRight: "Porte arrière D.",
      quarterPanelLeft: "Panneau latéral G.",
      quarterPanelRight: "Panneau latéral D.",
      sillLeft: "Bas de caisse G.",
      sillRight: "Bas de caisse D.",
      trunkUpper: "Coffre (haut)",
      trunkLower: "Coffre (bas)",
    },
    pricing: {
      title: "Devis — Barème Grêle WKO",
      subtitle: "Valeurs officielles de la Wirtschaftskammer Österreich (Lack- u. Karosseriebeirat)",
      emptyState: "Marquez des dommages sur le véhicule pour voir le calcul apparaître ici.",
      colPart: "Pièce",
      colMinor: "Léger",
      colMedium: "Moyen",
      colSevere: "Fort",
      colAluminum: "Type",
      colAW: "AW",
      subtotal: "Sous-total (pièces)",
      prep: "Préparation (0,2 AW/pièce, max 1 AW)",
      finish: "Finition (manuel)",
      surcharge1: "Majoration 25% (motif 1)",
      surcharge2: "Majoration 25% (motif 2)",
      totalAW: "Total Arbeitsaufwand",
      hourlyRate: "Taux horaire (AW)",
      totalQuote: "Total du Devis",
    },
    settingsPage: {
      title: "Paramètres de Devis",
      subtitle: "Configurez vos grilles tarifaires comme cela fonctionne le mieux pour votre atelier.",
      back: "Retour",
      tabHourly: "Grille Tarif Horaire",
      tabPartTypes: "Types de Pièce",
      sizeSmall: "Petit",
      sizeMedium: "Moyen",
      sizeLarge: "Grand",
      colQuantity: "Quantité",
      colHourValue: "Valeur en Heures",
      addValue: "Ajouter une valeur",
      reset: "Réinitialiser",
      remove: "Supprimer",
      partTypeLabel: "Nom du type",
      partTypePercent: "Majoration %",
      addPartType: "Ajouter un type de pièce",
    },
    nav: {
      dashboard: "Accueil",
      quotesList: "Devis",
      clients: "Clients",
      insurers: "Assureurs",
    },
    clients: {
      title: "Clients",
      subtitle: "Base de données clients de l'atelier.",
      add: "Nouveau Client",
      edit: "Modifier le Client",
      name: "Nom",
      phone: "Téléphone",
      email: "E-mail",
      nif: "N° fiscal",
      address: "Adresse",
      save: "Enregistrer",
      delete: "Supprimer",
      deleteConfirm: "Supprimer ce client ?",
      empty: "Aucun client enregistré pour l'instant.",
      searchPlaceholder: "Rechercher un client…",
      createdOn: "Ajouté le",
    },
    insurers: {
      title: "Assureurs",
      subtitle: "Compagnies d'assurance partenaires de l'atelier.",
      add: "Nouvel Assureur",
      edit: "Modifier l'Assureur",
      name: "Nom",
      phone: "Téléphone",
      email: "E-mail",
      notes: "Notes",
      save: "Enregistrer",
      delete: "Supprimer",
      deleteConfirm: "Supprimer cet assureur ?",
      empty: "Aucun assureur enregistré pour l'instant.",
      searchPlaceholder: "Rechercher un assureur…",
    },
    quotesList: {
      title: "Devis",
      subtitle: "Historique des devis enregistrés.",
      newQuote: "Nouveau Devis",
      empty: "Aucun devis enregistré pour l'instant.",
      statusDraft: "Brouillon",
      statusSent: "Envoyé",
      statusApproved: "Approuvé",
      statusRejected: "Refusé",
      colClient: "Client",
      colVehicle: "Véhicule",
      colDate: "Date",
      colStatus: "Statut",
      colTotal: "Total",
      noClient: "Sans client",
      delete: "Supprimer",
      deleteConfirm: "Supprimer ce devis ?",
      view: "Voir",
    },
    quoteMeta: {
      title: "Détails du Devis",
      clientLabel: "Client",
      insurerLabel: "Assureur",
      plateLabel: "Plaque",
      plateePlaceholder: "AA-123-AA",
      notesLabel: "Notes",
      notesPlaceholder: "Notes complémentaires…",
      none: "Aucun",
      selectClient: "Choisir un client",
      selectInsurer: "Choisir un assureur",
      saveQuote: "Enregistrer le Devis",
      savedToast: "Devis enregistré",
      print: "Télécharger le PDF",
      edit: "Modifier le Devis",
      backToList: "Voir les Devis",
      newClient: "+ Créer un nouveau client",
      statusLabel: "Statut",
      breakdownTitle: "Détail par Pièce",
    },
    dashboard: {
      title: "Bonjour 👋",
      subtitle: "Voici un aperçu de votre atelier.",
      statQuotesMonth: "Devis ce mois-ci",
      statPending: "En attente",
      statApproved: "Approuvés",
      statRevenue: "Valeur approuvée",
      recentQuotes: "Devis récents",
      viewAll: "Voir tout",
    },
    customer: {
      heroTitle: "Obtenez votre devis en 2 minutes",
      heroSubtitle: "Choisissez votre véhicule, marquez les impacts et recevez le montant immédiatement.",
      stepVehicle: "Véhicule",
      stepDamage: "Dommages",
      stepContact: "Contact",
      continueButton: "Continuer",
      backButton: "Retour",
      yourEstimate: "Votre devis estimé",
      estimateNote: "Valeur finale sous réserve de confirmation par l'atelier.",
      contactTitle: "Vos coordonnées",
      contactSubtitle: "Pour vous envoyer le devis.",
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      phoneLabel: "Téléphone",
      phonePlaceholder: "Numéro de téléphone",
      emailLabel: "E-mail",
      emailPlaceholder: "email@exemple.com",
      plateLabel: "Plaque (facultatif)",
      notesLabel: "Une remarque ?",
      notesPlaceholder: "Facultatif…",
      consentLabel: "J'accepte d'être contacté par WD PDR au sujet de ce devis.",
      privacyLinkLabel: "Voir la politique de confidentialité",
      submitButton: "Envoyer la Demande",
      submittingButton: "Envoi…",
      doneTitle: "Devis enregistré ! 🎉",
      doneSubtitle: "Téléchargez le PDF et contactez l’atelier pour envoyer votre demande.",
      downloadPdf: "Télécharger le PDF",
      newRequest: "Nouvelle Demande",
      requiredFieldsNote: "Champs obligatoires",
    },
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
    auth: {
      title: "Espace Atelier",
      subtitle: "Saisissez le code d'accès pour continuer",
      passcodeLabel: "Code d'accès",
      passcodePlaceholder: "••••",
      submitButton: "Entrer",
      errorMessage: "Code incorrect. Veuillez réessayer.",
    },
  },
  es: {
    common: {
      appName: "WD PDR",
      tagline: "Paintless Dent Removal",
      newQuote: "Nuevo Presupuesto",
      search: "Buscar",
      searchPlaceholder: "Buscar presupuesto, cliente o matrícula…",
      noResults: "Sin resultados",
      settings: "Ajustes",
      quotes: "Presupuestos",
      changeType: "cambiar tipo",
    },
    typeSelect: {
      title: "¿Qué tipo de vehículo?",
      subtitle: "Elige la categoría más parecida — luego marca los daños directamente en la imagen.",
      types: {
        sedan: { label: "Sedán", description: "Carrocería baja, tres volúmenes" },
        suv: { label: "SUV", description: "Carrocería alta, ruedas grandes" },
        wagon: { label: "Familiar", description: "Ranchera larga, maletero grande" },
        compact: { label: "Compacto", description: "Urbano, 5 puertas" },
        van: { label: "Furgoneta", description: "Comercial, carrocería alta" },
      },
    },
    quotePage: {
      title: "Nuevo Presupuesto",
      subtitle: "Gira el vehículo y haz clic directamente en la carrocería para marcar cada abolladura.",
    },
    views: { top: "Arriba", front: "Frente", right: "Derecha", rear: "Trasera", left: "Izquierda" },
    viewer: {
      hint: "Haz clic en cualquier punto del coche para marcar un daño",
      markingAreaLabel: "Área de marcado",
      markingAreaInstruction: "Haz clic para añadir un daño.",
    },
    brush: { label: "Tamaño del marcador" },
    severity: { minor: "Leve", medium: "Media", severe: "Fuerte" },
    parts: {
      hood: "Capó",
      roof: "Techo",
      roofRailLeft: "Riel del Techo Izq.",
      roofRailRight: "Riel del Techo Der.",
      fenderFrontLeft: "Guardabarros Del. Izq.",
      fenderFrontRight: "Guardabarros Del. Der.",
      doorFrontLeft: "Puerta Del. Izq.",
      doorFrontRight: "Puerta Del. Der.",
      doorRearLeft: "Puerta Tras. Izq.",
      doorRearRight: "Puerta Tras. Der.",
      quarterPanelLeft: "Pared Lateral Izq.",
      quarterPanelRight: "Pared Lateral Der.",
      sillLeft: "Estribo Izq.",
      sillRight: "Estribo Der.",
      trunkUpper: "Tapa del Maletero (Sup.)",
      trunkLower: "Tapa del Maletero (Inf.)",
    },
    pricing: {
      title: "Presupuesto — Tabla de Granizo WKO",
      subtitle: "Valores oficiales de la Wirtschaftskammer Österreich (Lack- u. Karosseriebeirat)",
      emptyState: "Marca daños en el vehículo para ver aquí el cálculo.",
      colPart: "Pieza",
      colMinor: "Leves",
      colMedium: "Medias",
      colSevere: "Fuertes",
      colAluminum: "Tipo",
      colAW: "AW",
      subtotal: "Subtotal (piezas)",
      prep: "Preparación (0,2 AW/pieza, máx. 1 AW)",
      finish: "Finish (manual)",
      surcharge1: "Recargo 25% (motivo 1)",
      surcharge2: "Recargo 25% (motivo 2)",
      totalAW: "Total Arbeitsaufwand",
      hourlyRate: "Valor de la hora (AW)",
      totalQuote: "Total del Presupuesto",
    },
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
    nav: {
      dashboard: "Inicio",
      quotesList: "Presupuestos",
      clients: "Clientes",
      insurers: "Aseguradoras",
    },
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
      save: "Guardar",
      delete: "Eliminar",
      deleteConfirm: "¿Eliminar este cliente?",
      empty: "Aún no hay clientes registrados.",
      searchPlaceholder: "Buscar cliente…",
      createdOn: "Añadido el",
    },
    insurers: {
      title: "Aseguradoras",
      subtitle: "Aseguradoras con las que trabaja el taller.",
      add: "Nueva Aseguradora",
      edit: "Editar Aseguradora",
      name: "Nombre",
      phone: "Teléfono",
      email: "Correo",
      notes: "Notas",
      save: "Guardar",
      delete: "Eliminar",
      deleteConfirm: "¿Eliminar esta aseguradora?",
      empty: "Aún no hay aseguradoras registradas.",
      searchPlaceholder: "Buscar aseguradora…",
    },
    quotesList: {
      title: "Presupuestos",
      subtitle: "Historial de presupuestos guardados.",
      newQuote: "Nuevo Presupuesto",
      empty: "Aún no hay presupuestos guardados.",
      statusDraft: "Borrador",
      statusSent: "Enviado",
      statusApproved: "Aprobado",
      statusRejected: "Rechazado",
      colClient: "Cliente",
      colVehicle: "Vehículo",
      colDate: "Fecha",
      colStatus: "Estado",
      colTotal: "Total",
      noClient: "Sin cliente",
      delete: "Eliminar",
      deleteConfirm: "¿Eliminar este presupuesto?",
      view: "Ver",
    },
    quoteMeta: {
      title: "Detalles del Presupuesto",
      clientLabel: "Cliente",
      insurerLabel: "Aseguradora",
      plateLabel: "Matrícula",
      plateePlaceholder: "0000-AAA",
      notesLabel: "Notas",
      notesPlaceholder: "Notas adicionales…",
      none: "Ninguno",
      selectClient: "Seleccionar cliente",
      selectInsurer: "Seleccionar aseguradora",
      saveQuote: "Guardar Presupuesto",
      savedToast: "Presupuesto guardado",
      print: "Descargar PDF",
      edit: "Editar Presupuesto",
      backToList: "Ver Presupuestos",
      newClient: "+ Crear nuevo cliente",
      statusLabel: "Estado",
      breakdownTitle: "Detalle por Pieza",
    },
    dashboard: {
      title: "Hola 👋",
      subtitle: "Aquí tienes un resumen de tu taller.",
      statQuotesMonth: "Presupuestos este mes",
      statPending: "Pendientes",
      statApproved: "Aprobados",
      statRevenue: "Valor aprobado",
      recentQuotes: "Presupuestos recientes",
      viewAll: "Ver todos",
    },
    customer: {
      heroTitle: "Pide tu presupuesto en 2 minutos",
      heroSubtitle: "Elige tu vehículo, marca las abolladuras y recibe el valor al instante.",
      stepVehicle: "Vehículo",
      stepDamage: "Daños",
      stepContact: "Contacto",
      continueButton: "Continuar",
      backButton: "Volver",
      yourEstimate: "Tu presupuesto estimado",
      estimateNote: "Valor final sujeto a confirmación por el taller.",
      contactTitle: "Tus datos",
      contactSubtitle: "Para enviarte el presupuesto.",
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      phoneLabel: "Teléfono",
      phonePlaceholder: "Número de teléfono",
      emailLabel: "Correo",
      emailPlaceholder: "correo@ejemplo.com",
      plateLabel: "Matrícula (opcional)",
      notesLabel: "¿Alguna observación?",
      notesPlaceholder: "Opcional…",
      consentLabel: "Acepto ser contactado por WD PDR sobre este presupuesto.",
      privacyLinkLabel: "Ver política de privacidad",
      submitButton: "Enviar Solicitud",
      submittingButton: "Enviando…",
      doneTitle: "¡Presupuesto guardado! 🎉",
      doneSubtitle: "Descarga el PDF y contacta con el taller para enviar tu solicitud.",
      downloadPdf: "Descargar PDF",
      newRequest: "Nueva Solicitud",
      requiredFieldsNote: "Campos obligatorios",
    },
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
    auth: {
      title: "Área del Taller",
      subtitle: "Introduzca el código de acceso para continuar",
      passcodeLabel: "Código de acceso",
      passcodePlaceholder: "••••",
      submitButton: "Entrar",
      errorMessage: "Código incorrecto. Inténtelo de nuevo.",
    },
  },
}
