import { lerJson } from "@/lib/storage"

export function buildExportData() {
  return {
    exportedAt: new Date().toISOString(),
    quotes: lerJson("wd-pdr-quotes", []),
    clients: lerJson("wd-pdr-clients", []),
    insurers: lerJson("wd-pdr-insurers", []),
    settings: {
      hourlyTable: lerJson("wd-pdr-price-table-hourly", null),
      partTypes: lerJson("wd-pdr-part-types", null),
      hourlyRate: lerJson("wd-pdr-hourly-rate", 45),
    },
  }
}

export function downloadExportData() {
  const blob = new Blob([JSON.stringify(buildExportData(), null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `wd-pdr-backup-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
