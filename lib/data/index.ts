// lib/data/index.ts
import type { Client, ClientId, UserRole } from '@/lib/types'
import * as clientA from './clients/client-a'
import * as clientB from './clients/client-b'
import * as clientC from './clients/client-c'
import * as clientD from './clients/client-d'

const registry = {
  'client-a': clientA,
  'client-b': clientB,
  'client-c': clientC,
  'client-d': clientD,
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

// Demo: hardcoded user for v1
export const DEMO_USER = {
  id: 'founder-1',
  role: 'founder' as UserRole,
  name: 'Alex Rivera',
}
