// __tests__/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { getClientsByUser } from '@/lib/data/index'

describe('getClientsByUser', () => {
  it('returns all clients for founder role', () => {
    const result = getClientsByUser('founder-1', 'founder')
    expect(result).toHaveLength(10)
  })

  it('returns only assigned clients for account_lead', () => {
    const result = getClientsByUser('account-lead-1', 'account_lead')
    const ids = result.map((c) => c.id)
    expect(ids).toContain('vivamart')
    expect(ids).toContain('cornerstone')
    expect(ids).not.toContain('clarix')
    expect(ids).not.toContain('paylane')
  })

  it('returns empty array for user with no assignments', () => {
    const result = getClientsByUser('unknown-user', 'account_lead')
    expect(result).toHaveLength(0)
  })
})
