// lib/tools/obsidian.ts
import { getClient } from '@/lib/data'
import type { ClientId, ObsidianNote } from '@/lib/types'

/**
 * Fetch Obsidian notes for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Private notes associated with the client.
 */
export function getObsidianNotes(clientId: ClientId): ObsidianNote[] {
  return getClient(clientId).obsidianNotes
}
