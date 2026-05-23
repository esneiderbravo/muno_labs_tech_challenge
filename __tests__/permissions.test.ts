// __tests__/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { canUserAccessClient, getClientsByUser, getUserById } from '@/lib/data/index'

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

  it('resolves known demo users', () => {
    const founder = getUserById('founder-1')
    const lead = getUserById('account-lead-1')
    expect(founder?.role).toBe('founder')
    expect(lead?.role).toBe('account_lead')
  })

  it('enforces access by role and assignment', () => {
    expect(canUserAccessClient('founder-1', 'founder', 'all')).toBe(true)
    expect(canUserAccessClient('account-lead-1', 'account_lead', 'all')).toBe(true)
    expect(canUserAccessClient('unknown-user', 'account_lead', 'all')).toBe(false)
    expect(canUserAccessClient('account-lead-1', 'account_lead', 'vivamart')).toBe(true)
    expect(canUserAccessClient('account-lead-1', 'account_lead', 'clarix')).toBe(false)
  })
})
