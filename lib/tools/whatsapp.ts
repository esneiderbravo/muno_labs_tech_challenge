// lib/tools/whatsapp.ts
import { getClient } from '@/lib/data'
import type { ClientId, WhatsappMessage } from '@/lib/types'

export function getWhatsappMessages(clientId: ClientId): WhatsappMessage[] {
  return getClient(clientId).whatsappMessages
}
