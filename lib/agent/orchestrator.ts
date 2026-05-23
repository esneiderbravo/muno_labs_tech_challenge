// lib/agent/orchestrator.ts
import { streamText, tool, stepCountIs, type LanguageModel, type ModelMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { buildSystemPrompt } from './system-prompt'
import { detectConflicts } from './conflict-detector'
import { getNotionDocs } from '@/lib/tools/notion'
import { getLinearTasks } from '@/lib/tools/linear'
import { getSlackMessages } from '@/lib/tools/slack'
import { getMeetingTranscripts } from '@/lib/tools/transcripts'
import { getCalendarEvents } from '@/lib/tools/calendar'
import { getDriveFiles } from '@/lib/tools/drive'
import { getGithubActivity } from '@/lib/tools/github'
import { getObsidianNotes } from '@/lib/tools/obsidian'
import { getPosthogMetrics } from '@/lib/tools/posthog'
import { getWhatsappMessages } from '@/lib/tools/whatsapp'
import type { ClientId, ToolResult } from '@/lib/types'

const clientIdSchema = z.object({
  clientId: z.enum([
    'vivamart',
    'clarix',
    'cornerstone',
    'paylane',
    'bloom',
    'draftly',
    'metrify',
    'nexova',
    'solara',
    'trackflow',
  ]),
})

const parseArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return val
      }
    }
    return val
  }, z.array(schema))

interface AgentScope {
  requestedClientId: ClientId | 'all'
  allowedClientIds: ClientId[]
}

type OpenAIModelCandidate = { name: string; model: LanguageModel }
const modelCooldownByName = new Map<string, number>()

const parseRetryDelayMs = (message: string): number | undefined => {
  const match = message.match(/in\s+(?:(\d+)m)?([\d.]+)s/i)
  if (!match) return undefined
  const minutes = Number(match[1] ?? 0)
  const seconds = Number(match[2] ?? 0)
  return (minutes * 60 + seconds) * 1000
}

const markModelCooldownIfRateLimited = (modelName: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  if (!/rate limit/i.test(message)) return
  const parsedDelay = parseRetryDelayMs(message)
  const cooldownMs = parsedDelay ?? 5 * 60 * 1000
  modelCooldownByName.set(modelName, Date.now() + cooldownMs)
}

const isModelCoolingDown = (modelName: string): boolean =>
  (modelCooldownByName.get(modelName) ?? 0) > Date.now()

const selectModel = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('No AI provider configured. Set OPENAI_API_KEY.')
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const primaryModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
  const fallbackModels = (process.env.OPENAI_FALLBACK_MODELS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
  const modelNames = [primaryModel, ...fallbackModels].filter(
    (value, index, self) => self.indexOf(value) === index,
  )
  const available: OpenAIModelCandidate[] = modelNames.map((name) => ({
    name,
    model: openai(name),
  }))

  const active = available.find((candidate) => !isModelCoolingDown(candidate.name))
  return active ?? available[0]
}

export function createAgentStream(messages: ModelMessage[], scope: AgentScope) {
  const toolResults: ToolResult[] = []
  const allowedClientIds = new Set(scope.allowedClientIds)
  const conflicts: ToolResult[] = []
  const selectedModel = selectModel()

  const assertClientScope = (clientId: ClientId) => {
    if (!allowedClientIds.has(clientId)) {
      throw new Error(`Client "${clientId}" is outside your access scope.`)
    }
    if (scope.requestedClientId !== 'all' && clientId !== scope.requestedClientId) {
      throw new Error(`This chat is scoped to "${scope.requestedClientId}".`)
    }
  }

  const executeScopedTool = async <T>(
    toolName: string,
    clientId: ClientId,
    fetcher: (id: ClientId) => T | Promise<T>,
  ) => {
    assertClientScope(clientId)
    const data = await fetcher(clientId)
    toolResults.push({
      toolName,
      clientId,
      data,
      fetchedAt: new Date().toISOString(),
    })
    return data
  }

  return streamText({
    model: selectedModel.model,
    system: `${buildSystemPrompt(detectConflicts(conflicts))}

Access scope:
- Requested scope: ${scope.requestedClientId}
- Allowed clients: ${scope.allowedClientIds.join(', ')}
- Model in use: ${selectedModel.name}`,
    messages,
    stopWhen: stepCountIs(15),
    onError: ({ error }) => {
      markModelCooldownIfRateLimited(selectedModel.name, error)
    },
    tools: {
      get_notion_docs: tool({
        description:
          'Fetch Notion documents for a client: wikis, proposals, project briefs, and clean meeting notes. Best for strategic context and documented decisions. Freshness: days to weeks.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_notion_docs', clientId, getNotionDocs),
      }),
      get_linear_tasks: tool({
        description:
          'Fetch Linear tasks, bugs, milestones, and cycle status for a client. Best for current operational state: what is being worked on, what is overdue, what is done. Freshness: hours to days.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_linear_tasks', clientId, getLinearTasks),
      }),
      get_slack_messages: tool({
        description:
          'Fetch recent Slack messages from a client channel. Best for latest decisions, quick updates, team sentiment, and informal commitments. Freshness: minutes.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_slack_messages', clientId, getSlackMessages),
      }),
      get_meeting_transcripts: tool({
        description:
          'Fetch meeting transcripts and AI-generated summaries (Granola/Circleback) for a client. Best for decisions made in meetings, formal commitments, and context behind tasks. Freshness: minutes after each meeting.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_meeting_transcripts', clientId, getMeetingTranscripts),
      }),
      get_calendar_events: tool({
        description:
          'Fetch past and upcoming calendar events for a client. Best for temporal context: when was the last meeting, when is the next one, who attended. Freshness: variable.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_calendar_events', clientId, getCalendarEvents),
      }),
      get_drive_files: tool({
        description:
          'Fetch Google Drive files for a client: decks, proposals, exports, assets. Best for formal deliverables and reference documents. Freshness: weeks.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_drive_files', clientId, getDriveFiles),
      }),
      get_github_activity: tool({
        description:
          'Fetch GitHub activity for a client repository: open PRs, recent merges, open issues, last commit. Best for technical project state. Freshness: hours.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_github_activity', clientId, getGithubActivity),
      }),
      get_obsidian_notes: tool({
        description:
          "Fetch founder's private Obsidian notes for a client. Best for candid context, strategic concerns, and personal prep notes. Freshness: days.",
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_obsidian_notes', clientId, getObsidianNotes),
      }),
      get_posthog_metrics: tool({
        description:
          'Fetch real-time product metrics for a client from PostHog: DAU, conversion rate, top events. Best for product health and growth signals. Freshness: real-time.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_posthog_metrics', clientId, getPosthogMetrics),
      }),
      get_whatsapp_messages: tool({
        description:
          'Fetch recent WhatsApp messages from the client channel. Best for urgent client requests, informal updates, and time-sensitive items. Freshness: minutes.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) =>
          executeScopedTool('get_whatsapp_messages', clientId, getWhatsappMessages),
      }),
      finalize_response: tool({
        description:
          'REQUIRED: Call this as the last tool in every response to provide structured metadata: confidence level, detected risks, conflicts between sources, and proposed write-back actions.',
        inputSchema: z.object({
          summary: z
            .string()
            .describe('Executive summary in 2-3 lines answering the user question directly'),
          next_steps: parseArray(z.string())
            .default([])
            .describe('Concrete recommended next steps'),
          confidence: z
            .enum(['high', 'medium', 'low'])
            .describe('Overall confidence in this response'),
          confidence_reason: z.string().describe('Brief explanation of why this confidence level'),
          risks: parseArray(
              z.object({
                description: z.string(),
                source: z.string(),
                severity: z.enum(['high', 'medium', 'low']),
              }),
            ).describe('Detected risks with evidence'),
          conflicts: parseArray(
              z.object({
                topic: z.string(),
                entries: parseArray(
                  z.object({ source: z.string(), date: z.string(), value: z.string() }),
                ),
                mostRecentSource: z.string(),
                mostRecentValue: z.string(),
                confidence: z.enum(['high', 'medium', 'low']),
                recommendation: z.string(),
              }),
            ).describe('Conflicts detected between data sources'),
          proposed_actions: parseArray(
              z.object({
                type: z.enum(['linear_task', 'slack_draft', 'notion_update']),
                description: z.string(),
                previewText: z.string(),
                data: z.record(z.string(), z.unknown()),
              }),
            ).describe('Proposed write-back actions requiring user approval'),
          sources_consulted: parseArray(z.string()).describe(
            'List of tool names called during this response',
          ),
        }),
        execute: async (args) => {
          const runtimeConflicts = detectConflicts(toolResults)
          const sourcesConsulted = [...new Set(toolResults.map((result) => result.toolName))]
          return {
            ...args,
            conflicts: runtimeConflicts.length > 0 ? runtimeConflicts : args.conflicts,
            sources_consulted:
              sourcesConsulted.length > 0 ? sourcesConsulted : args.sources_consulted,
          }
        },
      }),
    },
  })
}
