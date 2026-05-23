// lib/agent/conflict-detector.ts
import type { Conflict, ToolResult } from '@/lib/types'

// Tools that carry decision/approach information worth comparing
const DECISION_BEARING_TOOLS = new Set([
  'get_meeting_transcripts',
  'get_linear_tasks',
  'get_slack_messages',
  'get_notion_docs',
])

export function detectConflicts(toolResults: ToolResult[]): Conflict[] {
  const decisionResults = toolResults.filter((r) => DECISION_BEARING_TOOLS.has(r.toolName))

  if (decisionResults.length < 2) return []

  const byClient = new Map<string, ToolResult[]>()
  for (const r of decisionResults) {
    const existing = byClient.get(r.clientId) ?? []
    byClient.set(r.clientId, [...existing, r])
  }

  const conflicts: Conflict[] = []

  for (const [, results] of byClient) {
    if (results.length < 2) continue

    const sorted = [...results].sort(
      (a, b) => new Date(a.fetchedAt).getTime() - new Date(b.fetchedAt).getTime(),
    )
    const oldest = sorted[0]
    const newest = sorted[sorted.length - 1]

    const spanHours =
      (new Date(newest.fetchedAt).getTime() - new Date(oldest.fetchedAt).getTime()) /
      (1000 * 60 * 60)

    if (spanHours < 12) continue

    conflicts.push({
      topic: 'Potential decision divergence across sources',
      entries: sorted.map((r) => ({
        source: r.toolName,
        date: r.fetchedAt,
        value: `Data from ${r.toolName} (fetched at ${r.fetchedAt})`,
      })),
      mostRecentSource: newest.toolName,
      mostRecentValue: `Most recent data in ${newest.toolName}`,
      confidence: results.length >= 3 ? 'low' : 'medium',
      recommendation: 'Review the most recent source and confirm with the team before proceeding.',
    })
  }

  return conflicts
}
