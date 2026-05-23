// lib/tools/posthog.ts
import { getClient } from '@/lib/data'
import type { ClientId, PosthogMetrics } from '@/lib/types'

/**
 * Fetch PostHog metrics for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Product metrics associated with the client.
 */
export function getPosthogMetrics(clientId: ClientId): PosthogMetrics {
  return getClient(clientId).posthogMetrics
}
