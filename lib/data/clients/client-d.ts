// lib/data/clients/client-d.ts
import type {
  Client, LinearTask, SlackMessage, MeetingTranscript,
  CalendarEvent, NotionDoc, DriveFile, GithubActivity,
  ObsidianNote, PosthogMetrics, WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-d',
  name: 'StartupXYZ',
  industry: 'Fintech',
  assignedTo: ['account-lead-2', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  { id: 'SX-401', title: 'Authentication system (OAuth2)', status: 'done', assignee: 'rafael@agency.com', dueDate: '2026-05-10', updatedAt: '2026-05-10T17:00:00Z' },
  { id: 'SX-402', title: 'Dashboard v2 — metrics overview', status: 'in_progress', assignee: 'valentina@agency.com', dueDate: '2026-05-30', updatedAt: '2026-05-22T11:00:00Z' },
  { id: 'SX-403', title: 'Webhook integration', status: 'todo', assignee: 'rafael@agency.com', dueDate: '2026-06-05', updatedAt: '2026-05-21T10:00:00Z' },
]

export const slackMessages: SlackMessage[] = [
  { channel: '#startupxyz', author: 'valentina@agency.com', text: 'Dashboard v2 coming along, should have a preview by end of week.', timestamp: '2026-05-22T09:00:00Z' },
  { channel: '#startupxyz', author: 'rafael@agency.com', text: 'Auth system shipped and tested. Moving to webhook next.', timestamp: '2026-05-10T18:00:00Z' },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-04-28T10:00:00Z',
    attendees: ['founder-1', 'startupxyz-ceo', 'startupxyz-cto'],
    summary: 'Monthly planning session. Agreed on three deliverables for May: auth system, dashboard v2, and API documentation.',
    decisions: ['Auth system to be done by May 10', 'Dashboard v2 by end of May', 'API docs by end of May — critical for their Series A deck'],
    commitments: [
      { owner: 'agency', item: 'Authentication system (OAuth2)', dueDate: '2026-05-10' },
      { owner: 'agency', item: 'Dashboard v2 — metrics overview', dueDate: '2026-05-31' },
      { owner: 'agency', item: 'API documentation (OpenAPI spec + developer guide)', dueDate: '2026-05-31' },
    ],
  },
  {
    date: '2026-05-15T10:00:00Z',
    attendees: ['account-lead-2', 'startupxyz-ceo'],
    summary: 'Mid-month check-in. Auth done, dashboard on track. CEO asked specifically about API docs for Series A.',
    decisions: ['API docs remain priority for end of May'],
    commitments: [
      { owner: 'agency', item: 'API documentation delivered by May 31', dueDate: '2026-05-31' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  { title: 'StartupXYZ — Monthly Review', date: '2026-05-29T10:00:00Z', attendees: ['founder-1', 'startupxyz-ceo', 'startupxyz-cto'], isUpcoming: true },
  { title: 'StartupXYZ — Check-in', date: '2026-05-15T10:00:00Z', attendees: ['account-lead-2', 'startupxyz-ceo'], isUpcoming: false },
]

export const notionDocs: NotionDoc[] = [
  { title: 'StartupXYZ — Deliverables Q2', content: 'May deliverables: Auth system ✅, Dashboard v2 (in progress), API Documentation (pending).', lastEditedAt: '2026-05-01T09:00:00Z' },
]

export const driveFiles: DriveFile[] = [
  { name: 'StartupXYZ_Series_A_Deck.pdf', type: 'pdf', lastModifiedAt: '2026-05-18T10:00:00Z', url: 'https://drive.google.com/mock/startupxyz-deck' },
]

export const githubActivity: GithubActivity = {
  openPRs: 2,
  mergedThisWeek: 3,
  openIssues: 4,
  lastCommitAt: '2026-05-22T13:00:00Z',
  recentPRs: [
    { title: 'feat: dashboard metrics v2', state: 'open', author: 'valentina@agency.com' },
    { title: 'feat: webhook integration', state: 'open', author: 'rafael@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  { title: 'StartupXYZ — Founder Notes', content: 'API docs are blocking their Series A. If we miss this, it damages trust significantly. Need to assign someone ASAP.', updatedAt: '2026-05-16T20:00:00Z' },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 210,
  dauChange: '+25%',
  conversionRate: '3.2%',
  conversionChange: '+0.5%',
  topEvent: 'transaction_initiated',
}

export const whatsappMessages: WhatsappMessage[] = [
  { from: 'StartupXYZ CEO', text: 'Any news on the API docs? Investors asking.', timestamp: '2026-05-22T08:00:00Z', hasAttachment: false },
  { from: 'StartupXYZ CEO', text: 'Also attaching the API spec we need documented', timestamp: '2026-05-22T08:01:00Z', hasAttachment: true },
]
