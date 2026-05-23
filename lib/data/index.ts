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

/**
 * Return the full dataset bundle for a specific client.
 *
 * @param id - Stable client identifier.
 * @returns Client data module with channel-specific datasets.
 */
export function getClient(id: ClientId) {
  return registry[id]
}

/**
 * List all clients available in the in-memory registry.
 *
 * @returns Client records used by the UI and access checks.
 */
export function getAllClients(): Client[] {
  return Object.values(registry).map((r) => r.client)
}

/**
 * Resolve clients a user is allowed to access based on role assignment.
 *
 * @param userId - Authenticated user identifier.
 * @param role - User role used for access policy decisions.
 * @returns Clients visible to the user.
 */
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

/**
 * Find a demo user identity by identifier.
 *
 * @param userId - User identifier to resolve.
 * @returns Matching user identity when found.
 */
export function getUserById(userId: string): UserIdentity | undefined {
  return DEMO_USERS.find((user) => user.id === userId)
}

/**
 * Return all demo identities available for local switching.
 *
 * @returns Demo user records.
 */
export function getAllDemoUsers(): UserIdentity[] {
  return DEMO_USERS
}

/**
 * Check whether a user can access a specific client scope.
 *
 * @param userId - Authenticated user identifier.
 * @param role - User role used for access policy decisions.
 * @param clientId - Requested client scope, including the cross-client scope.
 * @returns True when access is allowed for the requested scope.
 */
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
