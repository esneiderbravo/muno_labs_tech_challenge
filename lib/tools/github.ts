// lib/tools/github.ts
import { getClient } from '@/lib/data'
import type { ClientId, GithubActivity } from '@/lib/types'

export function getGithubActivity(clientId: ClientId): GithubActivity {
  return getClient(clientId).githubActivity
}
