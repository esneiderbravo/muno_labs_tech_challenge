// lib/tools/slack.ts
import { getClient } from '@/lib/data'
import type { ClientId, SlackMessage } from '@/lib/types'

export function getSlackMessages(clientId: ClientId): SlackMessage[] {
  return getClient(clientId).slackMessages
}
