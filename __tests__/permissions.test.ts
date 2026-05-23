// __tests__/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { getClientsByUser } from '@/lib/data/index'

describe('getClientsByUser', () => {
  it('returns all clients for founder role', () => {
    const result = getClientsByUser('founder-1', 'founder')
    expect(result).toHaveLength(4)
  })

  it('returns only assigned clients for account_lead', () => {
    const result = getClientsByUser('account-lead-1', 'account_lead')
    const ids = result.map((c) => c.id)
    expect(ids).toContain('client-a')
    expect(ids).toContain('client-c')
    expect(ids).not.toContain('client-b')
    expect(ids).not.toContain('client-d')
  })

  it('returns empty array for user with no assignments', () => {
    const result = getClientsByUser('unknown-user', 'account_lead')
    expect(result).toHaveLength(0)
  })
})
