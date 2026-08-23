import { useLocalCollection, newRecordId } from "@/hooks/use-local-collection"
import type { Insurer } from "@/types/crm"

export function useInsurers() {
  const { items, add, update, remove, getById } = useLocalCollection<Insurer>("wd-pdr-insurers")

  function createInsurer(data: Omit<Insurer, "id" | "createdAt">) {
    const insurer: Insurer = { ...data, id: newRecordId("insurer"), createdAt: Date.now() }
    add(insurer)
    return insurer
  }

  return { insurers: items, createInsurer, updateInsurer: update, removeInsurer: remove, getInsurerById: getById }
}
