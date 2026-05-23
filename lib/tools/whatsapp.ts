// lib/tools/whatsapp.ts
import { getClient } from '@/lib/data'
import type { ClientId, WhatsappMessage } from '@/lib/types'

/**
 * Fetch WhatsApp messages for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns WhatsApp messages associated with the client.
 */
export function getWhatsappMessages(clientId: ClientId): WhatsappMessage[] {
  return getClient(clientId).whatsappMessages
}
