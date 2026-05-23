// lib/tools/transcripts.ts
import { getClient } from '@/lib/data'
import type { ClientId, MeetingTranscript } from '@/lib/types'

/**
 * Fetch meeting transcripts for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Transcript entries associated with the client.
 */
export function getMeetingTranscripts(clientId: ClientId): MeetingTranscript[] {
  return getClient(clientId).meetingTranscripts
}
