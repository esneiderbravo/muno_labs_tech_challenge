// lib/tools/linear.ts
import { getClient } from '@/lib/data'
import type { ClientId, LinearTask } from '@/lib/types'

/**
 * Fetch Linear tasks for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Linear tasks associated with the client.
 */
export function getLinearTasks(clientId: ClientId): LinearTask[] {
  return getClient(clientId).linearTasks
}
