// lib/tools/github.ts
import { getClient } from '@/lib/data'
import type { ClientId, GithubActivity } from '@/lib/types'

/**
 * Fetch GitHub activity snapshots for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Aggregated GitHub activity for the client.
 */
export function getGithubActivity(clientId: ClientId): GithubActivity {
  return getClient(clientId).githubActivity
}
