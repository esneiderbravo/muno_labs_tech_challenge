// lib/tools/linear.ts
import { getClient } from '@/lib/data'
import type { ClientId, LinearTask } from '@/lib/types'

export function getLinearTasks(clientId: ClientId): LinearTask[] {
  return getClient(clientId).linearTasks
}
