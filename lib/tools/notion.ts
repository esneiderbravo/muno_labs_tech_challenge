// lib/tools/notion.ts
import { getClient } from '@/lib/data'
import type { ClientId, NotionDoc } from '@/lib/types'

/**
 * Fetch Notion documents for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Notion documents associated with the client.
 */
export function getNotionDocs(clientId: ClientId): NotionDoc[] {
  return getClient(clientId).notionDocs
}
