// lib/tools/transcripts.ts
import { getClient } from '@/lib/data'
import type { ClientId, MeetingTranscript } from '@/lib/types'

export function getMeetingTranscripts(clientId: ClientId): MeetingTranscript[] {
  return getClient(clientId).meetingTranscripts
}
