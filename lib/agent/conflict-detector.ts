// lib/agent/conflict-detector.ts
import type { Conflict, ToolResult } from '@/lib/types'

// Tools that carry decision/approach information worth comparing
const DECISION_BEARING_TOOLS = new Set([
  'get_meeting_transcripts',
  'get_linear_tasks',
  'get_slack_messages',
  'get_notion_docs',
])

const MAX_RECURSION_DEPTH = 4

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+/_-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractStrings(value: unknown, depth = 0): string[] {
  if (depth > MAX_RECURSION_DEPTH) return []
  if (typeof value === 'string') return value.trim().length > 0 ? [value.trim()] : []
  if (Array.isArray(value)) return value.flatMap((item) => extractStrings(item, depth + 1))
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((item) => extractStrings(item, depth + 1))
  }
  return []
}

function getTextsForTool(result: ToolResult): string[] {
  if (result.toolName === 'get_linear_tasks') {
    const tasks = Array.isArray(result.data) ? (result.data as Array<{ title?: unknown }>) : []
    return tasks.flatMap((task) => (typeof task.title === 'string' ? [task.title] : []))
  }

  if (result.toolName === 'get_slack_messages') {
    const messages = Array.isArray(result.data) ? (result.data as Array<{ text?: unknown }>) : []
    return messages.flatMap((message) => (typeof message.text === 'string' ? [message.text] : []))
  }

  if (result.toolName === 'get_meeting_transcripts') {
    const transcripts = Array.isArray(result.data) ? result.data : [result.data]
    return transcripts.flatMap((transcript) => {
      if (!transcript || typeof transcript !== 'object') return []
      const typed = transcript as {
        summary?: unknown
        decisions?: unknown
        commitments?: unknown
      }
      const summaries =
        typeof typed.summary === 'string' && typed.summary.trim().length > 0 ? [typed.summary] : []
      const decisions = extractStrings(typed.decisions)
      const commitments = extractStrings(typed.commitments)
      return [...summaries, ...decisions, ...commitments]
    })
  }

  if (result.toolName === 'get_notion_docs') {
    const docs = Array.isArray(result.data)
      ? (result.data as Array<{ title?: unknown; content?: unknown }>)
      : []
    return docs.flatMap((doc) => {
      const title = typeof doc.title === 'string' ? [doc.title] : []
      const content = typeof doc.content === 'string' ? [doc.content] : []
      return [...title, ...content]
    })
  }

  return extractStrings(result.data)
}

function extractStancesFromText(text: string): string[] {
  const normalized = normalizeText(text)
  const stances = new Set<string>()

  const hasRest = /\brest\b/.test(normalized)
  const hasGraphql = /\bgraphql\b/.test(normalized)
  const hasHybrid = /\b(hibrid|hibrido|hibrida|hybrid)\b/.test(normalized)

  if ((hasRest && hasGraphql) || hasHybrid) {
    stances.add('REST + GraphQL (híbrido)')
  } else if (hasGraphql) {
    stances.add('GraphQL')
  } else if (hasRest) {
    stances.add('REST')
  }

  const approachMarker = text.match(/(?:enfoque|approach)\s*\(?\s*([xyz])\s*\)?/i)
  if (approachMarker?.[1]) {
    const marker = approachMarker[1].toUpperCase()
    if (stances.size === 0) {
      stances.add(`Enfoque ${marker}`)
    } else {
      const current = [...stances]
      stances.clear()
      for (const stance of current) {
        stances.add(`${stance} (enfoque ${marker})`)
      }
    }
  }

  return [...stances]
}

function normalizeStance(value: string): string {
  return normalizeText(value)
}

function uniqueStances(values: string[]): string[] {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const value of values) {
    const key = normalizeStance(value)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(value)
  }

  return unique
}

function summarizeSourceStance(result: ToolResult): { stances: string[]; evidence: string } {
  const texts = getTextsForTool(result)
  const stances = uniqueStances(texts.flatMap((text) => extractStancesFromText(text)))
  const evidence = texts[0] ?? `Data from ${result.toolName}`
  return { stances, evidence }
}

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

    const sortedByDate = [...results].sort(
      (a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime(),
    )

    const semanticBySource = sortedByDate.map((result) => ({
      result,
      ...summarizeSourceStance(result),
    }))
    const sourcesWithStance = semanticBySource.filter((source) => source.stances.length > 0)

    if (sourcesWithStance.length < 2) continue

    const stanceSignatures = new Set(
      sourcesWithStance
        .map((source) => source.stances.map((stance) => normalizeStance(stance)).sort().join('|'))
        .filter((signature) => signature.length > 0),
    )

    if (stanceSignatures.size < 2) continue

    const allStances = uniqueStances(sourcesWithStance.flatMap((source) => source.stances))
    const mostRecent = sourcesWithStance[0]

    conflicts.push({
      topic: 'Conflicting implementation approach across sources',
      entries: sourcesWithStance.map((source) => ({
        source: source.result.toolName,
        date: source.result.fetchedAt,
        value: `Postura detectada: ${source.stances.join(' | ')}. Evidencia: ${source.evidence}`,
      })),
      mostRecentSource: mostRecent.result.toolName,
      mostRecentValue: `Postura más reciente: ${mostRecent.stances.join(' | ')}`,
      confidence:
        allStances.length >= 3 || sourcesWithStance.length >= 3 ? 'low' : 'medium',
      recommendation:
        'Prioriza la postura más reciente, pero confirma en la siguiente reunión y actualiza Notion/Linear para dejar una sola fuente de verdad.',
    })
  }

  return conflicts
}
