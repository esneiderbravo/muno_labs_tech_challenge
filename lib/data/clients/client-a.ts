// lib/data/clients/client-a.ts
import type {
  Client, LinearTask, SlackMessage, MeetingTranscript,
  CalendarEvent, NotionDoc, DriveFile, GithubActivity,
  ObsidianNote, PosthogMetrics, WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-a',
  name: 'Acme Corp',
  industry: 'E-commerce',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  { id: 'ACM-101', title: 'Checkout flow redesign', status: 'in_progress', assignee: 'maria@agency.com', dueDate: '2026-05-23', updatedAt: '2026-05-19T10:00:00Z' },
  { id: 'ACM-102', title: 'Payment gateway integration', status: 'todo', assignee: 'carlos@agency.com', dueDate: '2026-05-23', updatedAt: '2026-05-18T09:00:00Z' },
  { id: 'ACM-103', title: 'Mobile responsive fixes', status: 'todo', assignee: 'ana@agency.com', dueDate: '2026-05-21', updatedAt: '2026-05-17T14:00:00Z' },
  { id: 'ACM-104', title: 'Analytics dashboard', status: 'done', assignee: 'maria@agency.com', dueDate: '2026-05-15', updatedAt: '2026-05-15T18:00:00Z' },
]

export const slackMessages: SlackMessage[] = [
  { channel: '#acme-corp', author: 'carlos@agency.com', text: 'Just checking in on the checkout flow — still on track?', timestamp: '2026-05-18T11:00:00Z' },
  { channel: '#acme-corp', author: 'maria@agency.com', text: 'Running a bit behind on the redesign, payment integration blocked on API keys from client.', timestamp: '2026-05-18T11:30:00Z' },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'acme-cto', 'maria@agency.com'],
    summary: 'Sprint review for Q2 delivery. Client confirmed deadline is Friday May 23. Three tasks still open. Client is concerned about the timeline.',
    decisions: ['Deadline is hard — May 23 is non-negotiable', 'Payment gateway keys to be sent by Acme by EOD Tuesday'],
    commitments: [
      { owner: 'Acme CTO', item: 'Send payment gateway API keys', dueDate: '2026-05-20' },
      { owner: 'agency', item: 'Deliver checkout flow + payment + mobile fixes', dueDate: '2026-05-23' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  { title: 'Acme Corp — Sprint Review', date: '2026-05-24T14:00:00Z', attendees: ['founder-1', 'acme-cto'], isUpcoming: true },
  { title: 'Acme Corp — Weekly Sync', date: '2026-05-19T10:00:00Z', attendees: ['founder-1', 'acme-cto', 'maria@agency.com'], isUpcoming: false },
]

export const notionDocs: NotionDoc[] = [
  { title: 'Acme Corp — Project Brief', content: 'Full e-commerce redesign. Scope: checkout, payments, mobile. Timeline: Q2 2026.', lastEditedAt: '2026-05-01T09:00:00Z' },
]

export const driveFiles: DriveFile[] = [
  { name: 'Acme_Q2_Proposal_v3.pdf', type: 'pdf', lastModifiedAt: '2026-04-15T10:00:00Z', url: 'https://drive.google.com/mock/acme-proposal' },
]

export const githubActivity: GithubActivity = {
  openPRs: 3,
  mergedThisWeek: 0,
  openIssues: 5,
  lastCommitAt: '2026-05-19T08:00:00Z',
  recentPRs: [
    { title: 'feat: checkout redesign WIP', state: 'open', author: 'maria@agency.com' },
    { title: 'feat: payment gateway integration', state: 'open', author: 'carlos@agency.com' },
    { title: 'fix: mobile responsive', state: 'open', author: 'ana@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  { title: 'Acme — Founder Notes', content: 'CTO seems anxious. Deadline risk real. Need to escalate internally if keys not received by Tuesday.', updatedAt: '2026-05-19T21:00:00Z' },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 1240,
  dauChange: '-8%',
  conversionRate: '2.1%',
  conversionChange: '-0.4%',
  topEvent: 'product_view',
}

export const whatsappMessages: WhatsappMessage[] = [
  { from: 'Acme CTO', text: 'Hey, any updates on the checkout? Board meeting Friday morning.', timestamp: '2026-05-21T08:00:00Z', hasAttachment: false },
]
