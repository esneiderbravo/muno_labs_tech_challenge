// __tests__/conflict-detector.test.ts
import { describe, it, expect } from 'vitest'
import { detectConflicts } from '@/lib/agent/conflict-detector'
import type { ToolResult } from '@/lib/types'

describe('detectConflicts', () => {
  it('returns empty array when no tool results', () => {
    expect(detectConflicts([])).toEqual([])
  })

  it('returns empty array when only one source', () => {
    const results: ToolResult[] = [
      { toolName: 'get_linear_tasks', clientId: 'client-c', data: { approach: 'REST' }, fetchedAt: '2026-05-21T15:00:00Z' },
    ]
    expect(detectConflicts(results)).toEqual([])
  })

  it('detects conflict when transcript and linear disagree on approach for client-c', () => {
    const results: ToolResult[] = [
      {
        toolName: 'get_meeting_transcripts',
        clientId: 'client-c',
        data: { decisions: ['Use REST approach (approach X)'] },
        fetchedAt: '2026-05-20T09:00:00Z',
      },
      {
        toolName: 'get_linear_tasks',
        clientId: 'client-c',
        data: [{ title: 'API integration — GraphQL approach', status: 'done' }],
        fetchedAt: '2026-05-21T15:00:00Z',
      },
      {
        toolName: 'get_slack_messages',
        clientId: 'client-c',
        data: [{ text: 'consider hybrid REST+GraphQL approach (Z)', timestamp: '2026-05-22T10:00:00Z' }],
        fetchedAt: '2026-05-22T10:00:00Z',
      },
    ]
    const conflicts = detectConflicts(results)
    expect(conflicts.length).toBeGreaterThan(0)
    expect(conflicts[0].mostRecentSource).toBe('get_slack_messages')
  })

  it('marks confidence as low when conflict involves 3+ sources', () => {
    const results: ToolResult[] = [
      { toolName: 'get_meeting_transcripts', clientId: 'client-c', data: { decisions: ['approach X'] }, fetchedAt: '2026-05-20T09:00:00Z' },
      { toolName: 'get_linear_tasks', clientId: 'client-c', data: [{ title: 'approach Y' }], fetchedAt: '2026-05-21T15:00:00Z' },
      { toolName: 'get_slack_messages', clientId: 'client-c', data: [{ text: 'approach Z', timestamp: '2026-05-22T10:00:00Z' }], fetchedAt: '2026-05-22T10:00:00Z' },
    ]
    const conflicts = detectConflicts(results)
    expect(conflicts[0].confidence).toBe('low')
  })
})
