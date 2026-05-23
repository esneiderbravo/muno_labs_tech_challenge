// lib/data/clients/client-b.ts
import type {
  Client, LinearTask, SlackMessage, MeetingTranscript,
  CalendarEvent, NotionDoc, DriveFile, GithubActivity,
  ObsidianNote, PosthogMetrics, WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-b',
  name: 'TechStart',
  industry: 'SaaS',
  assignedTo: ['account-lead-2', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  { id: 'TS-201', title: 'Onboarding flow v2', status: 'done', assignee: 'pedro@agency.com', dueDate: '2026-05-20', updatedAt: '2026-05-20T17:00:00Z' },
  { id: 'TS-202', title: 'Email drip campaign setup', status: 'done', assignee: 'lucia@agency.com', dueDate: '2026-05-19', updatedAt: '2026-05-19T16:00:00Z' },
  { id: 'TS-203', title: 'A/B test landing page', status: 'in_progress', assignee: 'pedro@agency.com', dueDate: '2026-05-28', updatedAt: '2026-05-22T10:00:00Z' },
  { id: 'TS-204', title: 'SEO audit', status: 'todo', assignee: 'lucia@agency.com', dueDate: '2026-05-30', updatedAt: '2026-05-21T09:00:00Z' },
]

export const slackMessages: SlackMessage[] = [
  { channel: '#techstart', author: 'pedro@agency.com', text: 'Onboarding v2 shipped! Client loved it.', timestamp: '2026-05-20T18:00:00Z' },
  { channel: '#techstart', author: 'client-ceo@techstart.io', text: 'Amazing work team! The numbers already look better.', timestamp: '2026-05-21T09:00:00Z' },
  { channel: '#techstart', author: 'lucia@agency.com', text: 'A/B test is live, will share results end of week.', timestamp: '2026-05-22T10:30:00Z' },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-21T11:00:00Z',
    attendees: ['account-lead-2', 'techstart-ceo', 'pedro@agency.com'],
    summary: 'Great sync. Onboarding v2 exceeded expectations — activation rate up 18%. Email campaign performing well. A/B test in progress. Client asked about SEO.',
    decisions: ['Prioritize SEO audit for next sprint', 'Share A/B results by May 30'],
    commitments: [
      { owner: 'agency', item: 'SEO audit complete by May 30', dueDate: '2026-05-30' },
      { owner: 'agency', item: 'A/B test results report', dueDate: '2026-05-30' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  { title: 'TechStart — Weekly Growth Sync', date: '2026-05-28T11:00:00Z', attendees: ['account-lead-2', 'techstart-ceo'], isUpcoming: true },
  { title: 'TechStart — Onboarding Review', date: '2026-05-21T11:00:00Z', attendees: ['account-lead-2', 'techstart-ceo', 'pedro@agency.com'], isUpcoming: false },
]

export const notionDocs: NotionDoc[] = [
  { title: 'TechStart — Growth Playbook', content: 'Focus areas: onboarding, activation, SEO, paid acquisition. Q2 goal: 25% activation rate increase.', lastEditedAt: '2026-05-10T10:00:00Z' },
]

export const driveFiles: DriveFile[] = [
  { name: 'TechStart_OnboardingV2_Results.pdf', type: 'pdf', lastModifiedAt: '2026-05-21T12:00:00Z', url: 'https://drive.google.com/mock/techstart-results' },
]

export const githubActivity: GithubActivity = {
  openPRs: 1,
  mergedThisWeek: 4,
  openIssues: 2,
  lastCommitAt: '2026-05-22T14:00:00Z',
  recentPRs: [
    { title: 'feat: A/B test variant B', state: 'open', author: 'pedro@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  { title: 'TechStart — Founder Notes', content: 'Best performing client this month. CEO very happy. Opportunity to upsell paid acquisition management.', updatedAt: '2026-05-21T22:00:00Z' },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 890,
  dauChange: '+18%',
  conversionRate: '4.7%',
  conversionChange: '+0.8%',
  topEvent: 'onboarding_complete',
}

export const whatsappMessages: WhatsappMessage[] = [
  { from: 'TechStart CEO', text: 'Quick q — when can we see the A/B results?', timestamp: '2026-05-22T16:00:00Z', hasAttachment: false },
]
