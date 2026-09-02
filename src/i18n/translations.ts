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
    storageWarning: string
  }
  typeSelect: {
    title: string
    subtitle: string
    types: Record<"sedan" | "suv" | "wagon" | "compact" | "van", { label: string; description: string }>
  }
  quotePage: {
    title: string
    subtitle: string
    editTitle: string
    editSubtitle: string
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
    saveChanges: string
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

import { pt } from "./pt"
import { en } from "./en"
import { de } from "./de"
import { fr } from "./fr"
import { es } from "./es"

export const TRANSLATIONS: Record<Language, TranslationShape> = {
  pt,
  en,
  de,
  fr,
  es,
}
