// lib/tools/posthog.ts
import { getClient } from '@/lib/data'
import type { ClientId, PosthogMetrics } from '@/lib/types'

export function getPosthogMetrics(clientId: ClientId): PosthogMetrics {
  return getClient(clientId).posthogMetrics
}
