import type { SavedQuote, Client, Insurer } from "@/types/crm"
import type { Language, TranslationShape } from "@/i18n/translations"
// Small pre-sized asset — the PDF only renders this at ~40pt tall, so the full-resolution header icon would waste file size.
import wdLogoSmall from "@/assets/brand/wd-logo-icon-small.png"

const INK = "#0a0a0b"
const INK_MUTED = "#5c5c64"
const INK_FAINT = "#85858d"
const AMBER = "#f5a623"
const LINE = "#eeeef0"

let logoDataUrlPromise: Promise<{ dataUrl: string; ratio: number }> | null = null

function loadLogoDataUrl(): Promise<{ dataUrl: string; ratio: number }> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(wdLogoSmall)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<{ dataUrl: string; ratio: number }>((resolve, reject) => {
            const img = new Image()
            const reader = new FileReader()
            reader.onerror = reject
            reader.onload = () => {
              const dataUrl = reader.result as string
              img.onload = () => resolve({ dataUrl, ratio: img.naturalHeight / img.naturalWidth })
              img.onerror = reject
              img.src = dataUrl
            }
            reader.readAsDataURL(blob)
          })
      )
  }
  return logoDataUrlPromise
}

interface GenerateQuotePdfParams {
  quote: SavedQuote
  client?: Client
  insurer?: Insurer
  t: TranslationShape
  language: Language
}

function money(value: number, language: Language) {
  return value.toLocaleString(language, { style: "currency", currency: "EUR" })
}

/** Builds and downloads a clean one-page PDF for a quote — replaces the old browser print-to-PDF flow. */
export async function downloadQuotePdf({ quote, client, insurer, t, language }: GenerateQuotePdfParams) {
  const { jsPDF } = await import("jspdf")
  const { dataUrl: logo, ratio } = await loadLogoDataUrl()

  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 48
  const contentWidth = pageWidth - margin * 2
  const surchargePrice = quote.totals.surchargePrice ?? quote.totals.surchargeHours * quote.totals.hourlyRate
  const subtotalPrice = quote.totals.subtotalPrice ?? quote.totals.totalPrice - surchargePrice
  const discount = quote.totals.discount ?? 0
  const vatRate = quote.totals.vatRate ?? 0
  const vatAmount = quote.totals.vatAmount ?? 0
  const usesExtrapolatedRange = quote.parts?.some((part) => part.usesExtrapolatedRange) ?? false
  let y = 56

  function ensureSpace(space: number) {
    if (y + space > pageHeight - 60) {
      doc.addPage()
      y = 56
    }
  }

  const logoW = 40
  const logoH = logoW * ratio
  doc.addImage(logo, "PNG", margin, y - 28, logoW, logoH)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(INK)
  doc.text("WD ", margin + logoW + 10, y - 8)
  doc.setTextColor(AMBER)
  doc.text("PDR", margin + logoW + 10 + doc.getTextWidth("WD "), y - 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(INK_MUTED)
  doc.text("PAINTLESS DENT REMOVAL", margin + logoW + 10, y + 4)
  doc.setTextColor(INK_FAINT)
  doc.text("+351 936 077 121  ·  wd.pdr@gmail.com", margin + logoW + 10, y + 15)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(INK_MUTED)
  const dateStr = new Date(quote.createdAt).toLocaleDateString(language)
  const idStr = `#${quote.id.slice(-8).toUpperCase()}`
  doc.text(dateStr, pageWidth - margin, y - 8, { align: "right" })
  doc.text(idStr, pageWidth - margin, y + 4, { align: "right" })

  y += 26
  doc.setDrawColor(INK)
  doc.setLineWidth(1.2)
  doc.line(margin, y, pageWidth - margin, y)
  y += 28

  const colWidth = contentWidth / 2 - 10
  const leftX = margin
  const rightX = margin + contentWidth / 2 + 10
  const colTop = y

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(INK)
  doc.text(t.quoteMeta.clientLabel.toUpperCase(), leftX, y)
  doc.text(t.typeSelect.title.toUpperCase(), rightX, y)
  y += 14

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(INK_MUTED)
  let leftY = y
  const clientLines = [
    client?.name ?? t.quotesList.noClient,
    client?.phone || null,
    client?.email || null,
    client?.nif ? `${t.clients.nif}: ${client.nif}` : null,
    client?.address || null,
    [client?.postalCode, client?.city].filter(Boolean).join(" ") || null,
    client?.country ? `${t.clients.country}: ${client.country}` : null,
  ].filter((l): l is string => !!l)
  for (const line of clientLines) {
    doc.text(line, leftX, leftY, { maxWidth: colWidth })
    leftY += 13
  }

  let rightY = y
  const vehicleLines = [
    t.typeSelect.types[quote.vehicleType].label,
    [quote.vehicleBrand, quote.vehicleModel, quote.vehicleColor].filter(Boolean).join(" / ") || null,
    quote.plate ? `${t.quoteMeta.plateLabel}: ${quote.plate}` : null,
    insurer ? `${t.quoteMeta.insurerLabel}: ${insurer.name}` : null,
  ].filter((l): l is string => !!l)
  for (const line of vehicleLines) {
    doc.text(line, rightX, rightY, { maxWidth: colWidth })
    rightY += 13
  }

  y = Math.max(leftY, rightY, colTop + 14) + 18

  const rows: [string, string, boolean?][] = [
    [t.pricing.subtotal, `${quote.totals.subtotalHours.toFixed(2)} AW`],
    [t.pricing.prep, `${quote.totals.prepHours.toFixed(2)} AW`],
    [t.pricing.finish, `${quote.totals.finishHours.toFixed(2)} AW`],
    [t.pricing.hourlyRate, money(quote.totals.hourlyRate, language)],
    [t.pricing.priceSubtotal, money(subtotalPrice, language)],
    [t.pricing.surchargeValue, money(surchargePrice, language)],
    [t.pricing.discount, `-${money(discount, language)}`],
    [t.pricing.vatAmount.replace("{rate}", String(vatRate)), money(vatAmount, language)],
    [t.pricing.totalQuote, money(quote.totals.totalPrice, language)],
  ]

  for (const [label, value, strong] of rows) {
    doc.setDrawColor(LINE)
    doc.setLineWidth(0.6)
    doc.line(margin, y + 6, pageWidth - margin, y + 6)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(INK_MUTED)
    doc.text(label, margin, y)
    doc.setFont("helvetica", strong ? "bold" : "normal")
    doc.setTextColor(INK)
    doc.text(value, pageWidth - margin, y, { align: "right" })
    y += 22
  }

  y += 12
  const boxW = 220
  const boxH = 54
  const boxX = pageWidth - margin - boxW
  doc.setFillColor(INK)
  doc.roundedRect(boxX, y, boxW, boxH, 8, 8, "F")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor("#ffffff")
  doc.text(t.pricing.totalAW, boxX + 16, y + 20)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text(`${quote.totals.totalHours.toFixed(2)} AW`, boxX + 16, y + 42)
  y += boxH + 28

  if (usesExtrapolatedRange) {
    ensureSpace(34)
    doc.setFillColor(255, 247, 237)
    doc.roundedRect(margin, y, contentWidth, 28, 5, 5, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8.5)
    doc.setTextColor(INK_MUTED)
    doc.text(t.pricing.extrapolatedQuoteWarning, margin + 10, y + 17, { maxWidth: contentWidth - 20 })
    y += 40
  }

  const partsList = quote.parts ?? []
  if (partsList.length > 0) {
    ensureSpace(42)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(INK)
    doc.text(t.quoteMeta.breakdownTitle.toUpperCase(), margin, y)
    y += 18

    const columns = [
      { label: t.pricing.colPart, x: margin, align: "left" as const },
      { label: t.pricing.colMinor, x: margin + 230, align: "right" as const },
      { label: t.pricing.colMedium, x: margin + 290, align: "right" as const },
      { label: t.pricing.colSevere, x: margin + 350, align: "right" as const },
      { label: t.pricing.colValue, x: pageWidth - margin, align: "right" as const },
    ]
    doc.setFillColor(245, 245, 246)
    doc.rect(margin, y - 11, contentWidth, 18, "F")
    doc.setFontSize(8)
    for (const column of columns) doc.text(column.label, column.x, y, { align: column.align })
    y += 18

    for (const part of partsList) {
      ensureSpace(18)
      const label = t.parts[part.partId] ?? part.partId
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor(INK_MUTED)
      doc.text(label, margin, y, { maxWidth: 210 })
      doc.text(String(part.countMinor), margin + 230, y, { align: "right" })
      doc.text(String(part.countMedium), margin + 290, y, { align: "right" })
      doc.text(String(part.countSevere), margin + 350, y, { align: "right" })
      doc.setTextColor(INK)
      doc.text(money(part.hours * quote.totals.hourlyRate, language), pageWidth - margin, y, { align: "right" })
      y += 18
    }
    y += 10
  }

  if (quote.notes) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(INK)
    doc.text(t.quoteMeta.notesLabel.toUpperCase(), margin, y)
    y += 14
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(INK_MUTED)
    const noteLines = doc.splitTextToSize(quote.notes, contentWidth)
    doc.text(noteLines, margin, y)
    y += noteLines.length * 13 + 10
  }

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(INK_FAINT)
  doc.text(
    "Rua Santo André, Edifício Europa, Lote 4 – Escritório 5, 2410-541 Leiria  ·  @wd.pdr",
    pageWidth / 2,
    pageHeight - 32,
    { align: "center" }
  )

  doc.save(`orcamento-wd-pdr-${quote.id.slice(-8)}.pdf`)
  return doc
}
