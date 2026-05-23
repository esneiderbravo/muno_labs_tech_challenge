// lib/data/index.ts
import type { Client, ClientId, UserIdentity, UserRole } from '@/lib/types'
import * as clientA from './clients/client-a'
import * as clientB from './clients/client-b'
import * as clientC from './clients/client-c'
import * as clientD from './clients/client-d'
import * as bloom from './clients/bloom'
import * as draftly from './clients/draftly'
import * as metrify from './clients/metrify'
import * as nexova from './clients/nexova'
import * as solara from './clients/solara'
import * as trackflow from './clients/trackflow'

const registry = {
  vivamart: clientA,
  clarix: clientB,
  cornerstone: clientC,
  paylane: clientD,
  bloom,
  draftly,
  metrify,
  nexova,
  solara,
  trackflow,
} as const

export function getClient(id: ClientId) {
  return registry[id]
}

export function getAllClients(): Client[] {
  return Object.values(registry).map((r) => r.client)
}

export function getClientsByUser(userId: string, role: UserRole): Client[] {
  const all = getAllClients()
  if (role === 'founder') return all
  return all.filter((c) => c.assignedTo.includes(userId))
}

const DEMO_USERS: UserIdentity[] = [
  {
    id: 'founder-1',
    role: 'founder',
    name: 'Alex Rivera',
  },
  {
    id: 'account-lead-1',
    role: 'account_lead',
    name: 'Sam Ortega',
  },
  {
    id: 'account-lead-2',
    role: 'account_lead',
    name: 'Maya Torres',
  },
]

export function getUserById(userId: string): UserIdentity | undefined {
  return DEMO_USERS.find((user) => user.id === userId)
}

export function getAllDemoUsers(): UserIdentity[] {
  return DEMO_USERS
}

export function canUserAccessClient(
  userId: string,
  role: UserRole,
  clientId: ClientId | 'all',
): boolean {
  const allowedIds = new Set(getClientsByUser(userId, role).map((client) => client.id))
  if (clientId === 'all') return allowedIds.size > 0
  return allowedIds.has(clientId)
}

// Demo: hardcoded user for v1
export const DEMO_USER = {
  id: 'founder-1',
  role: 'founder' as UserRole,
  name: 'Alex Rivera',
}
