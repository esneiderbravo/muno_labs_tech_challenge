// lib/data/clients/client-c.ts
import type {
  Client, LinearTask, SlackMessage, MeetingTranscript,
  CalendarEvent, NotionDoc, DriveFile, GithubActivity,
  ObsidianNote, PosthogMetrics, WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-c',
  name: 'GlobalRetail',
  industry: 'Retail',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  { id: 'GR-301', title: 'API integration — GraphQL approach', status: 'done', assignee: 'jorge@agency.com', dueDate: '2026-05-21', updatedAt: '2026-05-21T15:00:00Z' },
  { id: 'GR-302', title: 'Product catalog sync', status: 'in_progress', assignee: 'sofia@agency.com', dueDate: '2026-05-27', updatedAt: '2026-05-22T09:00:00Z' },
  { id: 'GR-303', title: 'Inventory webhook', status: 'todo', assignee: 'jorge@agency.com', dueDate: '2026-05-29', updatedAt: '2026-05-20T11:00:00Z' },
]

export const slackMessages: SlackMessage[] = [
  { channel: '#globalretail', author: 'jorge@agency.com', text: 'Heads up — after looking at the catalog volume, I think we should consider a hybrid REST+GraphQL approach (Z) instead of pure GraphQL. Easier to cache and their CDN supports it better.', timestamp: '2026-05-22T10:00:00Z' },
  { channel: '#globalretail', author: 'sofia@agency.com', text: 'Agree with Jorge, the GraphQL approach is causing N+1 issues with their catalog size. Hybrid makes more sense.', timestamp: '2026-05-22T10:45:00Z' },
  { channel: '#globalretail', author: 'account-lead-1@agency.com', text: "Let's align on this in the next sync before changing direction.", timestamp: '2026-05-22T11:00:00Z' },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-20T09:00:00Z',
    attendees: ['account-lead-1', 'globalretail-cto', 'jorge@agency.com'],
    summary: 'API integration planning session. Evaluated REST vs GraphQL. Client CTO strongly prefers REST-based approach for compatibility with their existing infrastructure.',
    decisions: ['Use REST approach (approach X) for all API integrations', 'Start implementation this week'],
    commitments: [
      { owner: 'agency', item: 'Implement REST API integration', dueDate: '2026-05-21' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  { title: 'GlobalRetail — API Review', date: '2026-05-26T10:00:00Z', attendees: ['account-lead-1', 'globalretail-cto'], isUpcoming: true },
  { title: 'GlobalRetail — Planning', date: '2026-05-20T09:00:00Z', attendees: ['account-lead-1', 'globalretail-cto', 'jorge@agency.com'], isUpcoming: false },
]

export const notionDocs: NotionDoc[] = [
  { title: 'GlobalRetail — Technical Architecture', content: 'API Integration: REST approach (approach X). All endpoints to follow RESTful conventions. See GlobalRetail API spec doc.', lastEditedAt: '2026-05-15T10:00:00Z' },
]

export const driveFiles: DriveFile[] = [
  { name: 'GlobalRetail_API_Spec_v1.pdf', type: 'pdf', lastModifiedAt: '2026-05-15T10:00:00Z', url: 'https://drive.google.com/mock/globalretail-spec' },
]

export const githubActivity: GithubActivity = {
  openPRs: 2,
  mergedThisWeek: 1,
  openIssues: 3,
  lastCommitAt: '2026-05-21T16:00:00Z',
  recentPRs: [
    { title: 'feat: graphql api integration', state: 'merged', author: 'jorge@agency.com' },
    { title: 'feat: product catalog sync', state: 'open', author: 'sofia@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  { title: 'GlobalRetail — Founder Notes', content: 'CTO is particular about REST. Need to make sure team is aligned. Jorge tends to over-engineer.', updatedAt: '2026-05-20T22:00:00Z' },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 3400,
  dauChange: '+2%',
  conversionRate: '1.8%',
  conversionChange: '-0.1%',
  topEvent: 'product_search',
}

export const whatsappMessages: WhatsappMessage[] = [
  { from: 'GlobalRetail CTO', text: 'Any update on the REST integration? Want to share progress with our team.', timestamp: '2026-05-22T14:00:00Z', hasAttachment: false },
]
