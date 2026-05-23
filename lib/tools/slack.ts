// lib/tools/slack.ts
import { getClient } from '@/lib/data'
import type { ClientId, SlackMessage } from '@/lib/types'

/**
 * Fetch Slack messages for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Slack messages associated with the client.
 */
export function getSlackMessages(clientId: ClientId): SlackMessage[] {
  return getClient(clientId).slackMessages
}
