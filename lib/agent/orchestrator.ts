// lib/agent/orchestrator.ts
import { streamText, tool, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
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
  clientId: z.enum(['client-a', 'client-b', 'client-c', 'client-d']),
})

export function createAgentStream(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  clientId: ClientId | 'all',
) {
  const preDetectedConflicts: ToolResult[] = []
  const conflicts = detectConflicts(preDetectedConflicts)

  return streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: buildSystemPrompt(conflicts),
    messages,
    stopWhen: stepCountIs(15),
    tools: {
      get_notion_docs: tool({
        description: 'Fetch Notion documents for a client: wikis, proposals, project briefs, and clean meeting notes. Best for strategic context and documented decisions. Freshness: days to weeks.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getNotionDocs(clientId),
      }),
      get_linear_tasks: tool({
        description: 'Fetch Linear tasks, bugs, milestones, and cycle status for a client. Best for current operational state: what is being worked on, what is overdue, what is done. Freshness: hours to days.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getLinearTasks(clientId),
      }),
      get_slack_messages: tool({
        description: 'Fetch recent Slack messages from a client channel. Best for latest decisions, quick updates, team sentiment, and informal commitments. Freshness: minutes.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getSlackMessages(clientId),
      }),
      get_meeting_transcripts: tool({
        description: 'Fetch meeting transcripts and AI-generated summaries (Granola/Circleback) for a client. Best for decisions made in meetings, formal commitments, and context behind tasks. Freshness: minutes after each meeting.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getMeetingTranscripts(clientId),
      }),
      get_calendar_events: tool({
        description: 'Fetch past and upcoming calendar events for a client. Best for temporal context: when was the last meeting, when is the next one, who attended. Freshness: variable.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getCalendarEvents(clientId),
      }),
      get_drive_files: tool({
        description: 'Fetch Google Drive files for a client: decks, proposals, exports, assets. Best for formal deliverables and reference documents. Freshness: weeks.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getDriveFiles(clientId),
      }),
      get_github_activity: tool({
        description: 'Fetch GitHub activity for a client repository: open PRs, recent merges, open issues, last commit. Best for technical project state. Freshness: hours.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getGithubActivity(clientId),
      }),
      get_obsidian_notes: tool({
        description: "Fetch founder's private Obsidian notes for a client. Best for candid context, strategic concerns, and personal prep notes. Freshness: days.",
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getObsidianNotes(clientId),
      }),
      get_posthog_metrics: tool({
        description: 'Fetch real-time product metrics for a client from PostHog: DAU, conversion rate, top events. Best for product health and growth signals. Freshness: real-time.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getPosthogMetrics(clientId),
      }),
      get_whatsapp_messages: tool({
        description: 'Fetch recent WhatsApp messages from the client channel. Best for urgent client requests, informal updates, and time-sensitive items. Freshness: minutes.',
        inputSchema: clientIdSchema,
        execute: async ({ clientId }) => getWhatsappMessages(clientId),
      }),
      finalize_response: tool({
        description: 'REQUIRED: Call this as the last tool in every response to provide structured metadata: confidence level, detected risks, conflicts between sources, and proposed write-back actions.',
        inputSchema: z.object({
          confidence: z.enum(['high', 'medium', 'low']).describe('Overall confidence in this response'),
          confidence_reason: z.string().describe('Brief explanation of why this confidence level'),
          risks: z.array(z.object({
            description: z.string(),
            source: z.string(),
            severity: z.enum(['high', 'medium', 'low']),
          })).describe('Detected risks with evidence'),
          conflicts: z.array(z.object({
            topic: z.string(),
            entries: z.array(z.object({ source: z.string(), date: z.string(), value: z.string() })),
            mostRecentSource: z.string(),
            mostRecentValue: z.string(),
            confidence: z.enum(['high', 'medium', 'low']),
            recommendation: z.string(),
          })).describe('Conflicts detected between data sources'),
          proposed_actions: z.array(z.object({
            type: z.enum(['linear_task', 'slack_draft', 'notion_update']),
            description: z.string(),
            previewText: z.string(),
            data: z.record(z.string(), z.unknown()),
          })).describe('Proposed write-back actions requiring user approval'),
          sources_consulted: z.array(z.string()).describe('List of tool names called during this response'),
        }),
        execute: async (args) => args,
      }),
    },
  })
}
