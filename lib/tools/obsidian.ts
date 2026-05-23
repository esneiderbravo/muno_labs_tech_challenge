// lib/tools/obsidian.ts
import { getClient } from '@/lib/data'
import type { ClientId, ObsidianNote } from '@/lib/types'

export function getObsidianNotes(clientId: ClientId): ObsidianNote[] {
  return getClient(clientId).obsidianNotes
}
