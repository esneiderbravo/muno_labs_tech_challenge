// lib/types.ts

export type ClientId = 'vivamart' | 'clarix' | 'cornerstone' | 'paylane'
export type UserRole = 'founder' | 'account_lead'

export interface Client {
  id: ClientId
  name: string
  industry: string
  assignedTo: string[] // userIds
}

// --- Tool result shapes ---

export interface LinearTask {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  assignee: string
  dueDate: string | null
  updatedAt: string
}

export interface SlackMessage {
  channel: string
  author: string
  text: string
  timestamp: string
}

export interface MeetingTranscript {
  date: string
  attendees: string[]
  summary: string
  decisions: string[]
  commitments: Array<{ owner: string; item: string; dueDate: string | null }>
}

export interface CalendarEvent {
  title: string
  date: string
  attendees: string[]
  isUpcoming: boolean
}

export interface NotionDoc {
  title: string
  content: string
  lastEditedAt: string
}

export interface DriveFile {
  name: string
  type: string
  lastModifiedAt: string
  url: string
}

export interface GithubActivity {
  openPRs: number
  mergedThisWeek: number
  openIssues: number
  lastCommitAt: string
  recentPRs: Array<{ title: string; state: string; author: string }>
}

export interface ObsidianNote {
  title: string
  content: string
  updatedAt: string
}

export interface PosthogMetrics {
  dau: number
  dauChange: string // e.g. "+12%" or "-5%"
  conversionRate: string
  conversionChange: string
  topEvent: string
}

export interface WhatsappMessage {
  from: string
  text: string
  timestamp: string
  hasAttachment: boolean
}

// --- Agent output shapes ---

export interface Risk {
  description: string
  source: string
  severity: 'high' | 'medium' | 'low'
}

export interface Conflict {
  topic: string
  entries: Array<{
    source: string
    date: string
    value: string
  }>
  mostRecentSource: string
  mostRecentValue: string
  confidence: 'high' | 'medium' | 'low'
  recommendation: string
}

export type WriteBackType = 'linear_task' | 'slack_draft' | 'notion_update'

export interface ProposedAction {
  type: WriteBackType
  description: string
  previewText: string
  data: Record<string, unknown>
}

export interface FinalizeResponseArgs {
  confidence: 'high' | 'medium' | 'low'
  confidence_reason: string
  risks: Risk[]
  conflicts: Conflict[]
  proposed_actions: ProposedAction[]
  sources_consulted: string[]
}

// --- Runtime shapes ---

export interface ToolResult {
  toolName: string
  clientId: string
  data: unknown
  fetchedAt: string
}

export interface ChatRequestBody {
  messages: Array<{ role: string; content: string }>
  userId: string
  clientId: ClientId | 'all'
}
