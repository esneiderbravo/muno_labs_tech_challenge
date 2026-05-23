// lib/data/index.ts
import type { Client, ClientId, UserRole } from '@/lib/types'
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

// Demo: hardcoded user for v1
export const DEMO_USER = {
  id: 'founder-1',
  role: 'founder' as UserRole,
  name: 'Alex Rivera',
}
