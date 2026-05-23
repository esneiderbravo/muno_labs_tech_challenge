// lib/tools/notion.ts
import { getClient } from '@/lib/data'
import type { ClientId, NotionDoc } from '@/lib/types'

export function getNotionDocs(clientId: ClientId): NotionDoc[] {
  return getClient(clientId).notionDocs
}
