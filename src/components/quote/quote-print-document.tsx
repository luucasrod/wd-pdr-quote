import { useLanguage } from "@/i18n/language-context"
import type { SavedQuote, Client, Insurer } from "@/types/crm"
import wdLogoIcon from "@/assets/brand/wd-logo-icon.png"

interface QuotePrintDocumentProps {
  quote: SavedQuote
  client?: Client
  insurer?: Insurer
}

/** Rendered off-screen always; becomes visible only under @media print (see index.css #print-quote rules). */
export function QuotePrintDocument({ quote, client, insurer }: QuotePrintDocumentProps) {
  const { t, language } = useLanguage()

  return (
    <div id="print-quote" className="hidden print:block" style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #0a0a0b", paddingBottom: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={wdLogoIcon} alt="" style={{ height: 52, width: "auto" }} />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
              WD <span style={{ color: "#f5a623" }}>PDR</span>
            </h1>
            <p style={{ fontSize: 10.5, color: "#5c5c64", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: 1 }}>
              Paintless Dent Removal
            </p>
            <p style={{ fontSize: 10, color: "#85858d", margin: "3px 0 0" }}>
              +351 936 077 121 · wd.pdr@gmail.com
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "#5c5c64" }}>
          <p style={{ margin: 0 }}>{new Date(quote.createdAt).toLocaleDateString(language)}</p>
          <p style={{ margin: 0 }}>#{quote.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24, fontSize: 12.5 }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{t.quoteMeta.clientLabel}</p>
          <p style={{ margin: 0 }}>{client?.name ?? t.quotesList.noClient}</p>
          {client?.phone && <p style={{ margin: 0 }}>{client.phone}</p>}
          {client?.email && <p style={{ margin: 0 }}>{client.email}</p>}
          {client?.nif && <p style={{ margin: 0 }}>{t.clients.nif}: {client.nif}</p>}
        </div>
        <div>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{t.typeSelect.title}</p>
          <p style={{ margin: 0 }}>{t.typeSelect.types[quote.vehicleType].label}</p>
          {quote.plate && <p style={{ margin: 0 }}>{t.quoteMeta.plateLabel}: {quote.plate}</p>}
          {insurer && <p style={{ margin: 0 }}>{t.quoteMeta.insurerLabel}: {insurer.name}</p>}
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, marginBottom: 24 }}>
        <tbody>
          <Row label={t.pricing.subtotal} value={`${quote.totals.subtotalHours.toFixed(2)} AW`} />
          <Row label={t.pricing.prep} value={`${quote.totals.prepHours.toFixed(2)} AW`} />
          <Row label={t.pricing.finish} value={`${quote.totals.finishHours.toFixed(2)} AW`} />
          <Row label={t.pricing.totalAW} value={`${quote.totals.totalHours.toFixed(2)} AW`} strong />
          <Row label={t.pricing.hourlyRate} value={quote.totals.hourlyRate.toLocaleString(language, { style: "currency", currency: "EUR" })} />
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <div style={{ background: "#0a0a0b", color: "white", padding: "12px 20px", borderRadius: 8, textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>{t.pricing.totalQuote}</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            {quote.totals.totalPrice.toLocaleString(language, { style: "currency", currency: "EUR" })}
          </p>
        </div>
      </div>

      {quote.notes && (
        <div style={{ fontSize: 12, color: "#5c5c64", marginBottom: 24 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{t.quoteMeta.notesLabel}</p>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{quote.notes}</p>
        </div>
      )}

      <div style={{ borderTop: "1px solid #eeeef0", paddingTop: 12, fontSize: 10, color: "#85858d", textAlign: "center" }}>
        Rua Santo André, Edifício Europa, Lote 4 – Escritório 5, 2410-541 Leiria · @wd.pdr
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr style={{ borderBottom: "1px solid #eeeef0" }}>
      <td style={{ padding: "6px 0", color: "#5c5c64" }}>{label}</td>
      <td style={{ padding: "6px 0", textAlign: "right", fontWeight: strong ? 700 : 500 }}>{value}</td>
    </tr>
  )
}
