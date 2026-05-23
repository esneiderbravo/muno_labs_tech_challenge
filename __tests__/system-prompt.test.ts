import { describe, expect, it } from 'vitest'
import { buildSystemPrompt } from '@/lib/agent/system-prompt'
import type { Conflict } from '@/lib/types'

describe('buildSystemPrompt', () => {
  it('returns base PM guidance when there are no conflicts', () => {
    const prompt = buildSystemPrompt([])

    expect(prompt).toContain('You are the virtual PM of a growth + tech agency')
    expect(prompt).toContain('You MUST call the finalize_response tool as your last action')
    expect(prompt).not.toContain('CONFLICT ALERT')
  })

  it('injects explicit conflict context when conflicts are provided', () => {
    const conflicts: Conflict[] = [
      {
        topic: 'Conflicting implementation approach across sources',
        entries: [
          {
            source: 'get_meeting_transcripts',
            date: '2026-05-20T09:00:00Z',
            value: 'Postura detectada: REST',
          },
        ],
        mostRecentSource: 'get_slack_messages',
        mostRecentValue: 'Postura más reciente: REST + GraphQL (híbrido)',
        confidence: 'medium',
        recommendation: 'Confirmar con equipo',
      },
    ]

    const prompt = buildSystemPrompt(conflicts)

    expect(prompt).toContain('CONFLICT ALERT')
    expect(prompt).toContain('"topic": "Conflicting implementation approach across sources"')
    expect(prompt).toContain('You MUST explicitly acknowledge and address these conflicts')
  })
})

