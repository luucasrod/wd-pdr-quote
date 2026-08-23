import { useLocalCollection, newRecordId } from "@/hooks/use-local-collection"
import type { Client } from "@/types/crm"

export function useClients() {
  const { items, add, update, remove, getById } = useLocalCollection<Client>("wd-pdr-clients")

  function createClient(data: Omit<Client, "id" | "createdAt">) {
    const client: Client = { ...data, id: newRecordId("client"), createdAt: Date.now() }
    add(client)
    return client
  }

  return { clients: items, createClient, updateClient: update, removeClient: remove, getClientById: getById }
}
