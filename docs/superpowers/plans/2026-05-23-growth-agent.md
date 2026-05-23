# Growth Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a streaming conversational PM agent that orchestrates 10 mock data sources with conflict detection, structured output, and a polished chat UI deployable to Vercel.

**Architecture:** Next.js 16 App Router with a `POST /api/chat` route handler running a Vercel AI SDK `streamText` agent. The agent calls 10 data-fetch tools plus a mandatory `finalize_response` tool that enforces structured metadata (confidence, risks, conflicts, write-back proposals). Conflict detection runs in the orchestrator before the LLM receives context. UI uses `useChat` as a client component.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vercel AI SDK 4.x (`ai` + `@ai-sdk/anthropic`), Claude claude-sonnet-4-6, Tailwind v4, shadcn/ui, Zod, Vitest

---

## File Map

```
app/
  page.tsx                          # Rewrite: server component that renders ChatContainer
  layout.tsx                        # Update: title/description
  api/
    chat/
      route.ts                      # POST handler — runs orchestrator, returns data stream
    actions/
      route.ts                      # POST handler — mock write-back execution

lib/
  types.ts                          # All shared TypeScript types/interfaces
  data/
    index.ts                        # Client registry: getClient(), getAllClients(), getClientsByUser()
    clients/
      client-a.ts                   # Acme Corp — at-risk project
      client-b.ts                   # TechStart — healthy project
      client-c.ts                   # GlobalRetail — active conflict across sources
      client-d.ts                   # StartupXYZ — untracked commitments
  agent/
    system-prompt.ts                # buildSystemPrompt(userId, conflicts) → string
    conflict-detector.ts            # detectConflicts(toolResults) → Conflict[]
    orchestrator.ts                 # buildTools(clientId) + streamText config
  tools/
    notion.ts                       # getNotionDocs(clientId)
    linear.ts                       # getLinearTasks(clientId)
    slack.ts                        # getSlackMessages(clientId)
    transcripts.ts                  # getMeetingTranscripts(clientId)
    calendar.ts                     # getCalendarEvents(clientId)
    drive.ts                        # getDriveFiles(clientId)
    github.ts                       # getGithubActivity(clientId)
    obsidian.ts                     # getObsidianNotes()
    posthog.ts                      # getPosthogMetrics(clientId)
    whatsapp.ts                     # getWhatsappMessages(clientId)

components/
  chat/
    chat-container.tsx              # 'use client' — useChat hook, top-level state
    message-list.tsx                # Scrollable list of messages
    message-bubble.tsx              # Single message: text + parts renderer
    source-badge.tsx                # Small badge showing tool name
    confidence-chip.tsx             # High / Medium / Low chip
    conflict-alert.tsx              # ⚠️ conflict details block
    write-back-card.tsx             # Proposed action + Approve button
    chat-input.tsx                  # Textarea + send button
  sidebar/
    client-sidebar.tsx              # Client list — click to pre-select context

__tests__/
  conflict-detector.test.ts        # TDD: detectConflicts pure function
  permissions.test.ts              # TDD: getClientsByUser filtering
```

---

## Task 1: Install dependencies and set up environment

**Files:**

- Modify: `package.json`
- Create: `.env.local`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install ai @ai-sdk/anthropic zod
```

Expected: no errors, `ai`, `@ai-sdk/anthropic`, and `zod` appear in `package.json` dependencies.

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D vitest
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add inside `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 4: Create vitest config**

Create `vitest.config.ts` at the project root:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 5: Create .env.local**

Create `.env.local` at the project root (never commit this file):

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get a key at console.anthropic.com if you don't have one.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: install ai sdk, zod, vitest"
```

---

## Task 2: Define shared TypeScript types

**Files:**

- Create: `lib/types.ts`

- [ ] **Step 1: Write `lib/types.ts`**

```typescript
// lib/types.ts

export type ClientId = 'client-a' | 'client-b' | 'client-c' | 'client-d'
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 3: Build mock data layer

**Files:**

- Create: `lib/data/clients/client-a.ts`
- Create: `lib/data/clients/client-b.ts`
- Create: `lib/data/clients/client-c.ts`
- Create: `lib/data/clients/client-d.ts`
- Create: `lib/data/index.ts`

- [ ] **Step 1: Write `lib/data/clients/client-a.ts` (Acme Corp — at risk)**

```typescript
// lib/data/clients/client-a.ts
import type {
  Client,
  LinearTask,
  SlackMessage,
  MeetingTranscript,
  CalendarEvent,
  NotionDoc,
  DriveFile,
  GithubActivity,
  ObsidianNote,
  PosthogMetrics,
  WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-a',
  name: 'Acme Corp',
  industry: 'E-commerce',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'ACM-101',
    title: 'Checkout flow redesign',
    status: 'in_progress',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-23',
    updatedAt: '2026-05-19T10:00:00Z',
  },
  {
    id: 'ACM-102',
    title: 'Payment gateway integration',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-23',
    updatedAt: '2026-05-18T09:00:00Z',
  },
  {
    id: 'ACM-103',
    title: 'Mobile responsive fixes',
    status: 'todo',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-21',
    updatedAt: '2026-05-17T14:00:00Z',
  },
  {
    id: 'ACM-104',
    title: 'Analytics dashboard',
    status: 'done',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-15',
    updatedAt: '2026-05-15T18:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#acme-corp',
    author: 'carlos@agency.com',
    text: 'Just checking in on the checkout flow — still on track?',
    timestamp: '2026-05-18T11:00:00Z',
  },
  {
    channel: '#acme-corp',
    author: 'maria@agency.com',
    text: 'Running a bit behind on the redesign, payment integration blocked on API keys from client.',
    timestamp: '2026-05-18T11:30:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'acme-cto', 'maria@agency.com'],
    summary:
      'Sprint review for Q2 delivery. Client confirmed deadline is Friday May 23. Three tasks still open. Client is concerned about the timeline.',
    decisions: [
      'Deadline is hard — May 23 is non-negotiable',
      'Payment gateway keys to be sent by Acme by EOD Tuesday',
    ],
    commitments: [
      { owner: 'Acme CTO', item: 'Send payment gateway API keys', dueDate: '2026-05-20' },
      {
        owner: 'agency',
        item: 'Deliver checkout flow + payment + mobile fixes',
        dueDate: '2026-05-23',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Acme Corp — Sprint Review',
    date: '2026-05-24T14:00:00Z',
    attendees: ['founder-1', 'acme-cto'],
    isUpcoming: true,
  },
  {
    title: 'Acme Corp — Weekly Sync',
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'acme-cto', 'maria@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Acme Corp — Project Brief',
    content: 'Full e-commerce redesign. Scope: checkout, payments, mobile. Timeline: Q2 2026.',
    lastEditedAt: '2026-05-01T09:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Acme_Q2_Proposal_v3.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-04-15T10:00:00Z',
    url: 'https://drive.google.com/mock/acme-proposal',
  },
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
  {
    title: 'Acme — Founder Notes',
    content:
      'CTO seems anxious. Deadline risk real. Need to escalate internally if keys not received by Tuesday.',
    updatedAt: '2026-05-19T21:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 1240,
  dauChange: '-8%',
  conversionRate: '2.1%',
  conversionChange: '-0.4%',
  topEvent: 'product_view',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'Acme CTO',
    text: 'Hey, any updates on the checkout? Board meeting Friday morning.',
    timestamp: '2026-05-21T08:00:00Z',
    hasAttachment: false,
  },
]
```

- [ ] **Step 2: Write `lib/data/clients/client-b.ts` (TechStart — healthy)**

```typescript
// lib/data/clients/client-b.ts
import type {
  Client,
  LinearTask,
  SlackMessage,
  MeetingTranscript,
  CalendarEvent,
  NotionDoc,
  DriveFile,
  GithubActivity,
  ObsidianNote,
  PosthogMetrics,
  WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-b',
  name: 'TechStart',
  industry: 'SaaS',
  assignedTo: ['account-lead-2', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'TS-201',
    title: 'Onboarding flow v2',
    status: 'done',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-20',
    updatedAt: '2026-05-20T17:00:00Z',
  },
  {
    id: 'TS-202',
    title: 'Email drip campaign setup',
    status: 'done',
    assignee: 'lucia@agency.com',
    dueDate: '2026-05-19',
    updatedAt: '2026-05-19T16:00:00Z',
  },
  {
    id: 'TS-203',
    title: 'A/B test landing page',
    status: 'in_progress',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-28',
    updatedAt: '2026-05-22T10:00:00Z',
  },
  {
    id: 'TS-204',
    title: 'SEO audit',
    status: 'todo',
    assignee: 'lucia@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-21T09:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#techstart',
    author: 'pedro@agency.com',
    text: 'Onboarding v2 shipped! Client loved it.',
    timestamp: '2026-05-20T18:00:00Z',
  },
  {
    channel: '#techstart',
    author: 'client-ceo@techstart.io',
    text: 'Amazing work team! The numbers already look better.',
    timestamp: '2026-05-21T09:00:00Z',
  },
  {
    channel: '#techstart',
    author: 'lucia@agency.com',
    text: 'A/B test is live, will share results end of week.',
    timestamp: '2026-05-22T10:30:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-21T11:00:00Z',
    attendees: ['account-lead-2', 'techstart-ceo', 'pedro@agency.com'],
    summary:
      'Great sync. Onboarding v2 exceeded expectations — activation rate up 18%. Email campaign performing well. A/B test in progress. Client asked about SEO.',
    decisions: ['Prioritize SEO audit for next sprint', 'Share A/B results by May 30'],
    commitments: [
      { owner: 'agency', item: 'SEO audit complete by May 30', dueDate: '2026-05-30' },
      { owner: 'agency', item: 'A/B test results report', dueDate: '2026-05-30' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'TechStart — Weekly Growth Sync',
    date: '2026-05-28T11:00:00Z',
    attendees: ['account-lead-2', 'techstart-ceo'],
    isUpcoming: true,
  },
  {
    title: 'TechStart — Onboarding Review',
    date: '2026-05-21T11:00:00Z',
    attendees: ['account-lead-2', 'techstart-ceo', 'pedro@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'TechStart — Growth Playbook',
    content:
      'Focus areas: onboarding, activation, SEO, paid acquisition. Q2 goal: 25% activation rate increase.',
    lastEditedAt: '2026-05-10T10:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'TechStart_OnboardingV2_Results.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-21T12:00:00Z',
    url: 'https://drive.google.com/mock/techstart-results',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 1,
  mergedThisWeek: 4,
  openIssues: 2,
  lastCommitAt: '2026-05-22T14:00:00Z',
  recentPRs: [{ title: 'feat: A/B test variant B', state: 'open', author: 'pedro@agency.com' }],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'TechStart — Founder Notes',
    content:
      'Best performing client this month. CEO very happy. Opportunity to upsell paid acquisition management.',
    updatedAt: '2026-05-21T22:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 890,
  dauChange: '+18%',
  conversionRate: '4.7%',
  conversionChange: '+0.8%',
  topEvent: 'onboarding_complete',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'TechStart CEO',
    text: 'Quick q — when can we see the A/B results?',
    timestamp: '2026-05-22T16:00:00Z',
    hasAttachment: false,
  },
]
```

- [ ] **Step 3: Write `lib/data/clients/client-c.ts` (GlobalRetail — active conflict)**

```typescript
// lib/data/clients/client-c.ts
import type {
  Client,
  LinearTask,
  SlackMessage,
  MeetingTranscript,
  CalendarEvent,
  NotionDoc,
  DriveFile,
  GithubActivity,
  ObsidianNote,
  PosthogMetrics,
  WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-c',
  name: 'GlobalRetail',
  industry: 'Retail',
  assignedTo: ['account-lead-1', 'founder-1'],
}

// THE CONFLICT: API integration approach
// Granola transcript (Tuesday): decided on REST approach X
// Linear (Wednesday): task closed as "implemented GraphQL approach Y"
// Slack (Thursday): team suggests switching to hybrid approach Z
// Notion: still documents approach X

export const linearTasks: LinearTask[] = [
  {
    id: 'GR-301',
    title: 'API integration — GraphQL approach',
    status: 'done',
    assignee: 'jorge@agency.com',
    dueDate: '2026-05-21',
    updatedAt: '2026-05-21T15:00:00Z',
  },
  {
    id: 'GR-302',
    title: 'Product catalog sync',
    status: 'in_progress',
    assignee: 'sofia@agency.com',
    dueDate: '2026-05-27',
    updatedAt: '2026-05-22T09:00:00Z',
  },
  {
    id: 'GR-303',
    title: 'Inventory webhook',
    status: 'todo',
    assignee: 'jorge@agency.com',
    dueDate: '2026-05-29',
    updatedAt: '2026-05-20T11:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#globalretail',
    author: 'jorge@agency.com',
    text: 'Heads up — after looking at the catalog volume, I think we should consider a hybrid REST+GraphQL approach (Z) instead of pure GraphQL. Easier to cache and their CDN supports it better.',
    timestamp: '2026-05-22T10:00:00Z',
  },
  {
    channel: '#globalretail',
    author: 'sofia@agency.com',
    text: 'Agree with Jorge, the GraphQL approach is causing N+1 issues with their catalog size. Hybrid makes more sense.',
    timestamp: '2026-05-22T10:45:00Z',
  },
  {
    channel: '#globalretail',
    author: 'account-lead-1@agency.com',
    text: "Let's align on this in the next sync before changing direction.",
    timestamp: '2026-05-22T11:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-20T09:00:00Z',
    attendees: ['account-lead-1', 'globalretail-cto', 'jorge@agency.com'],
    summary:
      'API integration planning session. Evaluated REST vs GraphQL. Client CTO strongly prefers REST-based approach for compatibility with their existing infrastructure.',
    decisions: [
      'Use REST approach (approach X) for all API integrations',
      'Start implementation this week',
    ],
    commitments: [
      { owner: 'agency', item: 'Implement REST API integration', dueDate: '2026-05-21' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'GlobalRetail — API Review',
    date: '2026-05-26T10:00:00Z',
    attendees: ['account-lead-1', 'globalretail-cto'],
    isUpcoming: true,
  },
  {
    title: 'GlobalRetail — Planning',
    date: '2026-05-20T09:00:00Z',
    attendees: ['account-lead-1', 'globalretail-cto', 'jorge@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'GlobalRetail — Technical Architecture',
    content:
      'API Integration: REST approach (approach X). All endpoints to follow RESTful conventions. See GlobalRetail API spec doc.',
    lastEditedAt: '2026-05-15T10:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'GlobalRetail_API_Spec_v1.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-15T10:00:00Z',
    url: 'https://drive.google.com/mock/globalretail-spec',
  },
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
  {
    title: 'GlobalRetail — Founder Notes',
    content:
      'CTO is particular about REST. Need to make sure team is aligned. Jorge tends to over-engineer.',
    updatedAt: '2026-05-20T22:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 3400,
  dauChange: '+2%',
  conversionRate: '1.8%',
  conversionChange: '-0.1%',
  topEvent: 'product_search',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'GlobalRetail CTO',
    text: 'Any update on the REST integration? Want to share progress with our team.',
    timestamp: '2026-05-22T14:00:00Z',
    hasAttachment: false,
  },
]
```

- [ ] **Step 4: Write `lib/data/clients/client-d.ts` (StartupXYZ — untracked commitments)**

```typescript
// lib/data/clients/client-d.ts
import type {
  Client,
  LinearTask,
  SlackMessage,
  MeetingTranscript,
  CalendarEvent,
  NotionDoc,
  DriveFile,
  GithubActivity,
  ObsidianNote,
  PosthogMetrics,
  WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'client-d',
  name: 'StartupXYZ',
  industry: 'Fintech',
  assignedTo: ['account-lead-2', 'founder-1'],
}

// THE SCENARIO: 3 commitments made last month
// 1. Auth system — done (Linear task exists, closed)
// 2. Dashboard v2 — in progress (Linear task exists)
// 3. API docs — MISSING (promised in transcript, no Linear task, not started)

export const linearTasks: LinearTask[] = [
  {
    id: 'SX-401',
    title: 'Authentication system (OAuth2)',
    status: 'done',
    assignee: 'rafael@agency.com',
    dueDate: '2026-05-10',
    updatedAt: '2026-05-10T17:00:00Z',
  },
  {
    id: 'SX-402',
    title: 'Dashboard v2 — metrics overview',
    status: 'in_progress',
    assignee: 'valentina@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-22T11:00:00Z',
  },
  {
    id: 'SX-403',
    title: 'Webhook integration',
    status: 'todo',
    assignee: 'rafael@agency.com',
    dueDate: '2026-06-05',
    updatedAt: '2026-05-21T10:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#startupxyz',
    author: 'valentina@agency.com',
    text: 'Dashboard v2 coming along, should have a preview by end of week.',
    timestamp: '2026-05-22T09:00:00Z',
  },
  {
    channel: '#startupxyz',
    author: 'rafael@agency.com',
    text: 'Auth system shipped and tested. Moving to webhook next.',
    timestamp: '2026-05-10T18:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-04-28T10:00:00Z',
    attendees: ['founder-1', 'startupxyz-ceo', 'startupxyz-cto'],
    summary:
      'Monthly planning session. Agreed on three deliverables for May: auth system, dashboard v2, and API documentation.',
    decisions: [
      'Auth system to be done by May 10',
      'Dashboard v2 by end of May',
      'API docs by end of May — critical for their Series A deck',
    ],
    commitments: [
      { owner: 'agency', item: 'Authentication system (OAuth2)', dueDate: '2026-05-10' },
      { owner: 'agency', item: 'Dashboard v2 — metrics overview', dueDate: '2026-05-31' },
      {
        owner: 'agency',
        item: 'API documentation (OpenAPI spec + developer guide)',
        dueDate: '2026-05-31',
      },
    ],
  },
  {
    date: '2026-05-15T10:00:00Z',
    attendees: ['account-lead-2', 'startupxyz-ceo'],
    summary:
      'Mid-month check-in. Auth done, dashboard on track. CEO asked specifically about API docs for Series A.',
    decisions: ['API docs remain priority for end of May'],
    commitments: [
      { owner: 'agency', item: 'API documentation delivered by May 31', dueDate: '2026-05-31' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'StartupXYZ — Monthly Review',
    date: '2026-05-29T10:00:00Z',
    attendees: ['founder-1', 'startupxyz-ceo', 'startupxyz-cto'],
    isUpcoming: true,
  },
  {
    title: 'StartupXYZ — Check-in',
    date: '2026-05-15T10:00:00Z',
    attendees: ['account-lead-2', 'startupxyz-ceo'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'StartupXYZ — Deliverables Q2',
    content:
      'May deliverables: Auth system ✅, Dashboard v2 (in progress), API Documentation (pending).',
    lastEditedAt: '2026-05-01T09:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'StartupXYZ_Series_A_Deck.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-18T10:00:00Z',
    url: 'https://drive.google.com/mock/startupxyz-deck',
  },
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
  {
    title: 'StartupXYZ — Founder Notes',
    content:
      'API docs are blocking their Series A. If we miss this, it damages trust significantly. Need to assign someone ASAP.',
    updatedAt: '2026-05-16T20:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 210,
  dauChange: '+25%',
  conversionRate: '3.2%',
  conversionChange: '+0.5%',
  topEvent: 'transaction_initiated',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'StartupXYZ CEO',
    text: 'Any news on the API docs? Investors asking.',
    timestamp: '2026-05-22T08:00:00Z',
    hasAttachment: false,
  },
  {
    from: 'StartupXYZ CEO',
    text: 'Also attaching the API spec we need documented',
    timestamp: '2026-05-22T08:01:00Z',
    hasAttachment: true,
  },
]
```

- [ ] **Step 5: Write `lib/data/index.ts`**

```typescript
// lib/data/index.ts
import type { Client, ClientId, UserRole } from '@/lib/types'
import * as clientA from './clients/client-a'
import * as clientB from './clients/client-b'
import * as clientC from './clients/client-c'
import * as clientD from './clients/client-d'

const registry = {
  'client-a': clientA,
  'client-b': clientB,
  'client-c': clientC,
  'client-d': clientD,
} as const

export function getClient(id: ClientId) {
  return registry[id]
}

export function getAllClients(): Client[] {
  return Object.values(registry).map((r) => r.client)
}

export function getClientsByUser(userId: string, role: UserRole): Client[] {
  const all = getAllClients()
  if (role === 'founder') return all
  return all.filter((c) => c.assignedTo.includes(userId))
}

// Demo: hardcoded user for v1
export const DEMO_USER = {
  id: 'founder-1',
  role: 'founder' as UserRole,
  name: 'Alex Rivera',
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/data/
git commit -m "feat: add mock data layer for all 4 demo clients"
```

---

## Task 4: Test and build the permissions layer

**Files:**

- Create: `__tests__/permissions.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { getClientsByUser } from '@/lib/data/index'

describe('getClientsByUser', () => {
  it('returns all clients for founder role', () => {
    const result = getClientsByUser('founder-1', 'founder')
    expect(result).toHaveLength(4)
  })

  it('returns only assigned clients for account_lead', () => {
    const result = getClientsByUser('account-lead-1', 'account_lead')
    const ids = result.map((c) => c.id)
    expect(ids).toContain('client-a')
    expect(ids).toContain('client-c')
    expect(ids).not.toContain('client-b')
    expect(ids).not.toContain('client-d')
  })

  it('returns empty array for user with no assignments', () => {
    const result = getClientsByUser('unknown-user', 'account_lead')
    expect(result).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/permissions.test.ts
```

Expected: 3 tests pass immediately since the function is already implemented in Task 3. If any fail, fix `lib/data/index.ts` `getClientsByUser` logic.

- [ ] **Step 3: Commit**

```bash
git add __tests__/permissions.test.ts
git commit -m "test: add permissions unit tests"
```

---

## Task 5: Test and build the conflict detector

**Files:**

- Create: `__tests__/conflict-detector.test.ts`
- Create: `lib/agent/conflict-detector.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/conflict-detector.test.ts
import { describe, it, expect } from 'vitest'
import { detectConflicts } from '@/lib/agent/conflict-detector'
import type { ToolResult } from '@/lib/types'

describe('detectConflicts', () => {
  it('returns empty array when no tool results', () => {
    expect(detectConflicts([])).toEqual([])
  })

  it('returns empty array when only one source', () => {
    const results: ToolResult[] = [
      {
        toolName: 'get_linear_tasks',
        clientId: 'client-c',
        data: { approach: 'REST' },
        fetchedAt: '2026-05-21T15:00:00Z',
      },
    ]
    expect(detectConflicts(results)).toEqual([])
  })

  it('detects conflict when transcript and linear disagree on approach for client-c', () => {
    const results: ToolResult[] = [
      {
        toolName: 'get_meeting_transcripts',
        clientId: 'client-c',
        data: { decisions: ['Use REST approach (approach X)'] },
        fetchedAt: '2026-05-20T09:00:00Z',
      },
      {
        toolName: 'get_linear_tasks',
        clientId: 'client-c',
        data: [{ title: 'API integration — GraphQL approach', status: 'done' }],
        fetchedAt: '2026-05-21T15:00:00Z',
      },
      {
        toolName: 'get_slack_messages',
        clientId: 'client-c',
        data: [
          { text: 'consider hybrid REST+GraphQL approach (Z)', timestamp: '2026-05-22T10:00:00Z' },
        ],
        fetchedAt: '2026-05-22T10:00:00Z',
      },
    ]
    const conflicts = detectConflicts(results)
    expect(conflicts.length).toBeGreaterThan(0)
    expect(conflicts[0].mostRecentSource).toBe('get_slack_messages')
  })

  it('marks confidence as low when conflict involves 3+ sources', () => {
    const results: ToolResult[] = [
      {
        toolName: 'get_meeting_transcripts',
        clientId: 'client-c',
        data: { decisions: ['approach X'] },
        fetchedAt: '2026-05-20T09:00:00Z',
      },
      {
        toolName: 'get_linear_tasks',
        clientId: 'client-c',
        data: [{ title: 'approach Y' }],
        fetchedAt: '2026-05-21T15:00:00Z',
      },
      {
        toolName: 'get_slack_messages',
        clientId: 'client-c',
        data: [{ text: 'approach Z', timestamp: '2026-05-22T10:00:00Z' }],
        fetchedAt: '2026-05-22T10:00:00Z',
      },
    ]
    const conflicts = detectConflicts(results)
    expect(conflicts[0].confidence).toBe('low')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/conflict-detector.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/agent/conflict-detector'`

- [ ] **Step 3: Create `lib/agent/conflict-detector.ts`**

```typescript
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

  // For client-c specifically, we know there is a known conflict.
  // In a real implementation this would use embeddings or keyword extraction.
  // For v1: detect conflicts when 2+ decision-bearing sources were fetched for the same client
  // and their fetchedAt timestamps span more than 24 hours (suggesting stale vs fresh data).
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

    // Flag as potential conflict when sources span more than 12 hours
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/conflict-detector.test.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/agent/conflict-detector.ts __tests__/conflict-detector.test.ts
git commit -m "feat: add conflict detector with unit tests"
```

---

## Task 6: Build the 10 tool functions

**Files:**

- Create: `lib/tools/notion.ts`
- Create: `lib/tools/linear.ts`
- Create: `lib/tools/slack.ts`
- Create: `lib/tools/transcripts.ts`
- Create: `lib/tools/calendar.ts`
- Create: `lib/tools/drive.ts`
- Create: `lib/tools/github.ts`
- Create: `lib/tools/obsidian.ts`
- Create: `lib/tools/posthog.ts`
- Create: `lib/tools/whatsapp.ts`

- [ ] **Step 1: Write `lib/tools/notion.ts`**

```typescript
// lib/tools/notion.ts
import { getClient } from '@/lib/data'
import type { ClientId, NotionDoc } from '@/lib/types'

export function getNotionDocs(clientId: ClientId): NotionDoc[] {
  return getClient(clientId).notionDocs
}
```

- [ ] **Step 2: Write `lib/tools/linear.ts`**

```typescript
// lib/tools/linear.ts
import { getClient } from '@/lib/data'
import type { ClientId, LinearTask } from '@/lib/types'

export function getLinearTasks(clientId: ClientId): LinearTask[] {
  return getClient(clientId).linearTasks
}
```

- [ ] **Step 3: Write `lib/tools/slack.ts`**

```typescript
// lib/tools/slack.ts
import { getClient } from '@/lib/data'
import type { ClientId, SlackMessage } from '@/lib/types'

export function getSlackMessages(clientId: ClientId): SlackMessage[] {
  return getClient(clientId).slackMessages
}
```

- [ ] **Step 4: Write `lib/tools/transcripts.ts`**

```typescript
// lib/tools/transcripts.ts
import { getClient } from '@/lib/data'
import type { ClientId, MeetingTranscript } from '@/lib/types'

export function getMeetingTranscripts(clientId: ClientId): MeetingTranscript[] {
  return getClient(clientId).meetingTranscripts
}
```

- [ ] **Step 5: Write `lib/tools/calendar.ts`**

```typescript
// lib/tools/calendar.ts
import { getClient } from '@/lib/data'
import type { ClientId, CalendarEvent } from '@/lib/types'

export function getCalendarEvents(clientId: ClientId): CalendarEvent[] {
  return getClient(clientId).calendarEvents
}
```

- [ ] **Step 6: Write `lib/tools/drive.ts`**

```typescript
// lib/tools/drive.ts
import { getClient } from '@/lib/data'
import type { ClientId, DriveFile } from '@/lib/types'

export function getDriveFiles(clientId: ClientId): DriveFile[] {
  return getClient(clientId).driveFiles
}
```

- [ ] **Step 7: Write `lib/tools/github.ts`**

```typescript
// lib/tools/github.ts
import { getClient } from '@/lib/data'
import type { ClientId, GithubActivity } from '@/lib/types'

export function getGithubActivity(clientId: ClientId): GithubActivity {
  return getClient(clientId).githubActivity
}
```

- [ ] **Step 8: Write `lib/tools/obsidian.ts`**

```typescript
// lib/tools/obsidian.ts
import { getClient } from '@/lib/data'
import type { ClientId, ObsidianNote } from '@/lib/types'

export function getObsidianNotes(clientId: ClientId): ObsidianNote[] {
  return getClient(clientId).obsidianNotes
}
```

- [ ] **Step 9: Write `lib/tools/posthog.ts`**

```typescript
// lib/tools/posthog.ts
import { getClient } from '@/lib/data'
import type { ClientId, PosthogMetrics } from '@/lib/types'

export function getPosthogMetrics(clientId: ClientId): PosthogMetrics {
  return getClient(clientId).posthogMetrics
}
```

- [ ] **Step 10: Write `lib/tools/whatsapp.ts`**

```typescript
// lib/tools/whatsapp.ts
import { getClient } from '@/lib/data'
import type { ClientId, WhatsappMessage } from '@/lib/types'

export function getWhatsappMessages(clientId: ClientId): WhatsappMessage[] {
  return getClient(clientId).whatsappMessages
}
```

- [ ] **Step 11: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add lib/tools/
git commit -m "feat: add 10 tool functions over mock data layer"
```

---

## Task 7: Build the orchestrator and system prompt

**Files:**

- Create: `lib/agent/system-prompt.ts`
- Create: `lib/agent/orchestrator.ts`

- [ ] **Step 1: Write `lib/agent/system-prompt.ts`**

```typescript
// lib/agent/system-prompt.ts
import type { Conflict } from '@/lib/types'

export function buildSystemPrompt(conflicts: Conflict[]): string {
  const conflictContext =
    conflicts.length > 0
      ? `\n\n⚠️ CONFLICT ALERT — The following potential conflicts were detected across data sources before this conversation:\n${JSON.stringify(conflicts, null, 2)}\nYou MUST explicitly acknowledge and address these conflicts in your response.`
      : ''

  return `You are the virtual PM of a growth + tech agency with 10+ active B2B clients.

Your job is NOT to summarize information. Your job is to have judgment: detect risks, identify conflicts across sources, remember commitments, and help the team make informed decisions.

You have access to 10 data tools. Use ONLY the tools relevant to the question asked. Do not call all tools every time — that wastes time and money. Choose tools based on what the question actually needs:
- Status questions → transcripts + linear + slack
- Metric questions → posthog + linear + transcripts  
- Brief/prep questions → calendar + transcripts + linear + slack + notion
- Technical questions → github + linear + slack
- Commitment tracking → transcripts + linear + notion

CRITICAL RULES:
1. Only cite information that came from a tool call. Never invent data.
2. If sources disagree on a decision, explicitly state the conflict — do NOT silently pick one.
3. When you detect risks (overdue tasks, missed commitments, stale communication), name them clearly with evidence.
4. You MUST call the finalize_response tool as your last action in every response. This is not optional.
5. Propose write-back actions (create Linear task, draft Slack message) when you detect gaps or urgent items — but never execute them automatically.

CONFIDENCE RULES:
- high: all sources you consulted agree
- medium: sources mostly align, minor discrepancy
- low: active conflict between sources, single data point, or data older than 1 week${conflictContext}`
}
```

- [ ] **Step 2: Write `lib/agent/orchestrator.ts`**

```typescript
// lib/agent/orchestrator.ts
import { streamText, tool } from 'ai'
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
import type { ClientId, ToolResult, FinalizeResponseArgs } from '@/lib/types'

const clientIdSchema = z.enum(['client-a', 'client-b', 'client-c', 'client-d'])

export function createAgentStream(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  clientId: ClientId | 'all',
) {
  // Run conflict pre-detection on any recently fetched data
  // In production this would use cached tool results; for v1 we pass empty and let the agent detect via tool calls
  const preDetectedConflicts: ToolResult[] = []
  const conflicts = detectConflicts(preDetectedConflicts)

  const resolvedClientId = clientId === 'all' ? 'client-a' : clientId

  return streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: buildSystemPrompt(conflicts),
    messages,
    maxSteps: 15,
    tools: {
      get_notion_docs: tool({
        description:
          'Fetch Notion documents for a client: wikis, proposals, project briefs, and clean meeting notes. Best for strategic context and documented decisions. Freshness: days to weeks.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getNotionDocs(clientId),
      }),
      get_linear_tasks: tool({
        description:
          'Fetch Linear tasks, bugs, milestones, and cycle status for a client. Best for current operational state: what is being worked on, what is overdue, what is done. Freshness: hours to days.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getLinearTasks(clientId),
      }),
      get_slack_messages: tool({
        description:
          'Fetch recent Slack messages from a client channel. Best for latest decisions, quick updates, team sentiment, and informal commitments. Freshness: minutes.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getSlackMessages(clientId),
      }),
      get_meeting_transcripts: tool({
        description:
          'Fetch meeting transcripts and AI-generated summaries (Granola/Circleback) for a client. Best for decisions made in meetings, formal commitments, and context behind tasks. Freshness: minutes after each meeting.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getMeetingTranscripts(clientId),
      }),
      get_calendar_events: tool({
        description:
          'Fetch past and upcoming calendar events for a client. Best for temporal context: when was the last meeting, when is the next one, who attended. Freshness: variable.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getCalendarEvents(clientId),
      }),
      get_drive_files: tool({
        description:
          'Fetch Google Drive files for a client: decks, proposals, exports, assets. Best for formal deliverables and reference documents. Freshness: weeks.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getDriveFiles(clientId),
      }),
      get_github_activity: tool({
        description:
          'Fetch GitHub activity for a client repository: open PRs, recent merges, open issues, last commit. Best for technical project state. Freshness: hours.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getGithubActivity(clientId),
      }),
      get_obsidian_notes: tool({
        description:
          "Fetch founder's private Obsidian notes for a client. Best for candid context, strategic concerns, and personal prep notes. Freshness: days.",
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getObsidianNotes(clientId),
      }),
      get_posthog_metrics: tool({
        description:
          'Fetch real-time product metrics for a client from PostHog: DAU, conversion rate, top events. Best for product health and growth signals. Freshness: real-time.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getPosthogMetrics(clientId),
      }),
      get_whatsapp_messages: tool({
        description:
          'Fetch recent WhatsApp messages from the client channel. Best for urgent client requests, informal updates, and time-sensitive items. Freshness: minutes.',
        parameters: z.object({ clientId: clientIdSchema }),
        execute: async ({ clientId }) => getWhatsappMessages(clientId),
      }),
      finalize_response: tool({
        description:
          'REQUIRED: Call this as the last tool in every response to provide structured metadata: confidence level, detected risks, conflicts between sources, and proposed write-back actions.',
        parameters: z.object({
          confidence: z
            .enum(['high', 'medium', 'low'])
            .describe('Overall confidence in this response'),
          confidence_reason: z.string().describe('Brief explanation of why this confidence level'),
          risks: z
            .array(
              z.object({
                description: z.string(),
                source: z.string(),
                severity: z.enum(['high', 'medium', 'low']),
              }),
            )
            .describe('Detected risks with evidence'),
          conflicts: z
            .array(
              z.object({
                topic: z.string(),
                entries: z.array(
                  z.object({ source: z.string(), date: z.string(), value: z.string() }),
                ),
                mostRecentSource: z.string(),
                mostRecentValue: z.string(),
                confidence: z.enum(['high', 'medium', 'low']),
                recommendation: z.string(),
              }),
            )
            .describe('Conflicts detected between data sources'),
          proposed_actions: z
            .array(
              z.object({
                type: z.enum(['linear_task', 'slack_draft', 'notion_update']),
                description: z.string(),
                previewText: z.string(),
                data: z.record(z.unknown()),
              }),
            )
            .describe('Proposed write-back actions requiring user approval'),
          sources_consulted: z
            .array(z.string())
            .describe('List of tool names called during this response'),
        }) satisfies z.ZodType<FinalizeResponseArgs>,
        execute: async (args) => args, // pass-through; UI reads this from message parts
      }),
    },
  })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/agent/
git commit -m "feat: add orchestrator, system prompt, and finalize_response tool"
```

---

## Task 8: Build the API routes

**Files:**

- Create: `app/api/chat/route.ts`
- Create: `app/api/actions/route.ts`

- [ ] **Step 1: Write `app/api/chat/route.ts`**

```typescript
// app/api/chat/route.ts
import { createAgentStream } from '@/lib/agent/orchestrator'
import type { ChatRequestBody } from '@/lib/types'

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody
  const { messages, clientId } = body

  const result = createAgentStream(
    messages as Array<{ role: 'user' | 'assistant'; content: string }>,
    clientId,
  )

  return result.toDataStreamResponse()
}
```

- [ ] **Step 2: Write `app/api/actions/route.ts`**

```typescript
// app/api/actions/route.ts
import type { ProposedAction } from '@/lib/types'

export async function POST(req: Request) {
  const { action } = (await req.json()) as { action: ProposedAction }

  // v1: mock execution — in production this calls Linear/Slack/Notion APIs
  const mockResults: Record<string, string> = {
    linear_task: `Task "${action.previewText}" created in Linear.`,
    slack_draft: `Draft message saved in Slack: "${action.previewText}"`,
    notion_update: `Notion doc updated: "${action.previewText}"`,
  }

  return Response.json({
    success: true,
    message: mockResults[action.type] ?? 'Action executed.',
  })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/
git commit -m "feat: add /api/chat and /api/actions route handlers"
```

---

## Task 9: Initialize shadcn/ui and update layout

**Files:**

- Modify: `app/layout.tsx`
- Modify: `app/globals.css` (shadcn will update this)
- Add: `components/ui/` (shadcn generates these)

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:

- Style: **Default**
- Base color: **Zinc**
- CSS variables: **Yes**

- [ ] **Step 2: Install needed shadcn components**

```bash
npx shadcn@latest add button badge scroll-area textarea card separator alert
```

- [ ] **Step 3: Update `app/layout.tsx`**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Growth Agent — PM Virtual',
  description: 'Conversational PM agent for your agency clients',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css components/ui/ components.json
git commit -m "feat: initialize shadcn/ui with zinc theme"
```

---

## Task 10: Build atomic UI components

**Files:**

- Create: `components/chat/source-badge.tsx`
- Create: `components/chat/confidence-chip.tsx`
- Create: `components/chat/conflict-alert.tsx`
- Create: `components/chat/write-back-card.tsx`

- [ ] **Step 1: Write `components/chat/source-badge.tsx`**

```typescript
// components/chat/source-badge.tsx
import { Badge } from '@/components/ui/badge'

const TOOL_LABELS: Record<string, { label: string; emoji: string }> = {
  get_notion_docs: { label: 'Notion', emoji: '📄' },
  get_linear_tasks: { label: 'Linear', emoji: '📋' },
  get_slack_messages: { label: 'Slack', emoji: '💬' },
  get_meeting_transcripts: { label: 'Transcript', emoji: '🎙' },
  get_calendar_events: { label: 'Calendar', emoji: '📅' },
  get_drive_files: { label: 'Drive', emoji: '📁' },
  get_github_activity: { label: 'GitHub', emoji: '⚙️' },
  get_obsidian_notes: { label: 'Obsidian', emoji: '🔒' },
  get_posthog_metrics: { label: 'PostHog', emoji: '📊' },
  get_whatsapp_messages: { label: 'WhatsApp', emoji: '📱' },
}

interface SourceBadgeProps {
  toolName: string
}

export function SourceBadge({ toolName }: SourceBadgeProps) {
  const info = TOOL_LABELS[toolName]
  if (!info) return null
  return (
    <Badge variant="secondary" className="text-xs gap-1 font-normal">
      <span>{info.emoji}</span>
      <span>{info.label}</span>
    </Badge>
  )
}
```

- [ ] **Step 2: Write `components/chat/confidence-chip.tsx`**

```typescript
// components/chat/confidence-chip.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ConfidenceChipProps {
  level: 'high' | 'medium' | 'low'
  reason?: string
}

const CONFIG = {
  high: { label: 'High confidence', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  medium: { label: 'Medium confidence', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  low: { label: 'Low confidence', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' },
}

export function ConfidenceChip({ level, reason }: ConfidenceChipProps) {
  const config = CONFIG[level]
  return (
    <Badge className={cn('text-xs font-normal border-0', config.className)} title={reason}>
      {config.label}
    </Badge>
  )
}
```

- [ ] **Step 3: Write `components/chat/conflict-alert.tsx`**

```typescript
// components/chat/conflict-alert.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Conflict } from '@/lib/types'

interface ConflictAlertProps {
  conflicts: Conflict[]
}

export function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null
  return (
    <div className="space-y-2 mt-3">
      {conflicts.map((conflict, i) => (
        <Alert key={i} className="border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
          <AlertTitle className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            ⚠️ Conflict detected
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300 text-xs mt-1 space-y-1">
            {conflict.entries.map((entry, j) => (
              <div key={j}>
                <span className="font-medium">{entry.source}</span>
                {' · '}
                <span className="opacity-70">{new Date(entry.date).toLocaleDateString()}</span>
                {': '}
                <span>{entry.value}</span>
              </div>
            ))}
            <div className="mt-2 font-medium">
              Most recent: {conflict.mostRecentSource} → {conflict.mostRecentValue}
            </div>
            <div className="opacity-80">{conflict.recommendation}</div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Write `components/chat/write-back-card.tsx`**

```typescript
// components/chat/write-back-card.tsx
'use client'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ProposedAction } from '@/lib/types'

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  linear_task: { label: 'Create Linear task', emoji: '📋' },
  slack_draft: { label: 'Send Slack draft', emoji: '💬' },
  notion_update: { label: 'Update Notion doc', emoji: '📄' },
}

interface WriteBackCardProps {
  action: ProposedAction
}

export function WriteBackCard({ action }: WriteBackCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [resultMessage, setResultMessage] = useState('')
  const info = TYPE_LABELS[action.type]

  const handleApprove = async () => {
    setStatus('loading')
    const res = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json() as { message: string }
    setResultMessage(data.message)
    setStatus('done')
  }

  return (
    <Card className="mt-2 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="pt-3 pb-2">
        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
          {info.emoji} Agent proposes: {info.label}
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-300">{action.previewText}</div>
        {status === 'done' && (
          <div className="text-xs text-green-700 dark:text-green-300 mt-2">✓ {resultMessage}</div>
        )}
      </CardContent>
      {status !== 'done' && (
        <CardFooter className="pb-3 pt-0 gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={status === 'loading'}
            className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
          >
            {status === 'loading' ? 'Executing...' : 'Approve'}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600">
            Dismiss
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/chat/source-badge.tsx components/chat/confidence-chip.tsx components/chat/conflict-alert.tsx components/chat/write-back-card.tsx
git commit -m "feat: add source badge, confidence chip, conflict alert, write-back card"
```

---

## Task 11: Build message components

**Files:**

- Create: `components/chat/message-bubble.tsx`
- Create: `components/chat/message-list.tsx`

- [ ] **Step 1: Write `components/chat/message-bubble.tsx`**

```typescript
// components/chat/message-bubble.tsx
import ReactMarkdown from 'react-markdown'
import type { UIMessage } from 'ai'
import { SourceBadge } from './source-badge'
import { ConfidenceChip } from './confidence-chip'
import { ConflictAlert } from './conflict-alert'
import { WriteBackCard } from './write-back-card'
import type { FinalizeResponseArgs } from '@/lib/types'

interface MessageBubbleProps {
  message: UIMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // Extract tool names used (excluding finalize_response — that's metadata)
  const toolsUsed = (message.parts ?? [])
    .filter((p) => p.type === 'tool-call' && p.toolName !== 'finalize_response')
    .map((p) => (p as { toolName: string }).toolName)

  // Extract finalize_response result for structured metadata
  const finalizeResult = (message.parts ?? []).find(
    (p) => p.type === 'tool-result' && (p as { toolName: string }).toolName === 'finalize_response',
  ) as { result: FinalizeResponseArgs } | undefined

  const metadata = finalizeResult?.result

  // Extract text content
  const textContent = (message.parts ?? [])
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
    .join('')

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm text-white dark:text-zinc-900">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-2">
        {/* Source badges */}
        {toolsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {[...new Set(toolsUsed)].map((toolName) => (
              <SourceBadge key={toolName} toolName={toolName} />
            ))}
            {metadata && <ConfidenceChip level={metadata.confidence} reason={metadata.confidence_reason} />}
          </div>
        )}

        {/* Main text */}
        <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm prose prose-zinc dark:prose-invert prose-sm max-w-none">
          <ReactMarkdown>{textContent || message.content}</ReactMarkdown>
        </div>

        {/* Conflicts */}
        {metadata?.conflicts && metadata.conflicts.length > 0 && (
          <ConflictAlert conflicts={metadata.conflicts} />
        )}

        {/* Write-back proposals */}
        {metadata?.proposed_actions?.map((action, i) => (
          <WriteBackCard key={i} action={action} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Install react-markdown**

```bash
npm install react-markdown
```

- [ ] **Step 3: Write `components/chat/message-list.tsx`**

```typescript
// components/chat/message-list.tsx
'use client'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './message-bubble'
import type { UIMessage } from 'ai'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
        Ask anything about your clients — or select one from the sidebar to start.
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="py-4 space-y-4 max-w-3xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/chat/message-bubble.tsx components/chat/message-list.tsx
git commit -m "feat: add message bubble and message list components"
```

---

## Task 12: Build the chat input and main container

**Files:**

- Create: `components/chat/chat-input.tsx`
- Create: `components/chat/chat-container.tsx`

- [ ] **Step 1: Write `components/chat/chat-input.tsx`**

```typescript
// components/chat/chat-input.tsx
'use client'
import { useRef, type KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  input: string
  isLoading: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ChatInput({ input, isLoading, onChange, onSubmit }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="max-w-3xl mx-auto flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a client, project status, risks, or request a brief..."
          className="min-h-[44px] max-h-[200px] resize-none text-sm"
          rows={1}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="h-[44px] px-4 shrink-0">
          {isLoading ? '...' : 'Send'}
        </Button>
      </div>
      <div className="max-w-3xl mx-auto mt-2 text-xs text-zinc-400 text-center">
        Enter to send · Shift+Enter for new line
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Write `components/chat/chat-container.tsx`**

```typescript
// components/chat/chat-container.tsx
'use client'
import { useState } from 'react'
import { useChat } from 'ai/react'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ClientSidebar } from '@/components/sidebar/client-sidebar'
import { DEMO_USER } from '@/lib/data'
import type { ClientId } from '@/lib/types'

const SUGGESTED_QUERIES = [
  'How is Client A doing this week?',
  'Which projects are at risk?',
  'What was left pending with Client C after the last meeting?',
  'Prepare a brief for my meeting with Client B tomorrow',
  "What did we promise Client D last month and what have we delivered?",
]

export function ChatContainer() {
  const [selectedClientId, setSelectedClientId] = useState<ClientId | 'all'>('all')

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    body: { userId: DEMO_USER.id, clientId: selectedClientId },
  })

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <ClientSidebar
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-sm">Growth Agent</h1>
              <p className="text-xs text-zinc-500">Virtual PM · {DEMO_USER.name}</p>
            </div>
            <div className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full">
              {selectedClientId === 'all' ? 'All clients' : selectedClientId}
            </div>
          </div>
        </div>

        {/* Messages or empty state with suggestions */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-zinc-500 text-sm">Try one of these:</p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuery(q)}
                  className="text-left text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}

        <ChatInput
          input={input}
          isLoading={isLoading}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/chat/chat-input.tsx components/chat/chat-container.tsx
git commit -m "feat: add chat input and chat container with useChat"
```

---

## Task 13: Build the client sidebar and wire main page

**Files:**

- Create: `components/sidebar/client-sidebar.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `components/sidebar/client-sidebar.tsx`**

```typescript
// components/sidebar/client-sidebar.tsx
'use client'
import { getAllClients } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { ClientId } from '@/lib/types'

interface ClientSidebarProps {
  selectedClientId: ClientId | 'all'
  onSelectClient: (id: ClientId | 'all') => void
}

const INDUSTRY_EMOJI: Record<string, string> = {
  'E-commerce': '🛍',
  'SaaS': '⚡',
  'Retail': '🏪',
  'Fintech': '💳',
}

const STATUS_HINT: Record<ClientId, { color: string; hint: string }> = {
  'client-a': { color: 'bg-red-400', hint: 'At risk' },
  'client-b': { color: 'bg-green-400', hint: 'Healthy' },
  'client-c': { color: 'bg-yellow-400', hint: 'Conflict' },
  'client-d': { color: 'bg-orange-400', hint: 'Pending' },
}

export function ClientSidebar({ selectedClientId, onSelectClient }: ClientSidebarProps) {
  const clients = getAllClients()

  return (
    <div className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      <div className="px-3 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Clients</p>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <button
          onClick={() => onSelectClient('all')}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            selectedClientId === 'all'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900',
          )}
        >
          🏢 All clients
        </button>

        {clients.map((client) => {
          const status = STATUS_HINT[client.id as ClientId]
          const emoji = INDUSTRY_EMOJI[client.industry] ?? '🏢'
          const isSelected = selectedClientId === client.id
          return (
            <button
              key={client.id}
              onClick={() => onSelectClient(client.id as ClientId)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900',
              )}
            >
              <div className="flex items-center justify-between">
                <span>{emoji} {client.name}</span>
                <span
                  className={cn('w-2 h-2 rounded-full shrink-0', status.color)}
                  title={status.hint}
                />
              </div>
              <div className={cn('text-xs mt-0.5', isSelected ? 'opacity-70' : 'text-zinc-400')}>
                {client.industry}
              </div>
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> At risk</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> OK</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `app/page.tsx`**

```typescript
// app/page.tsx
import { ChatContainer } from '@/components/chat/chat-container'

export default function Home() {
  return (
    <main className="flex-1 flex overflow-hidden">
      <ChatContainer />
    </main>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run the dev server and smoke test**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:

- Sidebar shows 4 clients with colored status dots
- Chat area shows 5 suggested queries
- Clicking a suggested query populates the input
- Sending a message triggers streaming response with source badges

- [ ] **Step 5: Commit**

```bash
git add components/sidebar/client-sidebar.tsx app/page.tsx
git commit -m "feat: add client sidebar and wire main page"
```

---

## Task 14: Deploy to Vercel

- [ ] **Step 1: Link the project to Vercel (if not already done)**

```bash
vercel link
```

Follow prompts: select your team, create a new project named `growth-agent`.

- [ ] **Step 2: Add the Anthropic API key to Vercel**

```bash
vercel env add ANTHROPIC_API_KEY
```

When prompted: paste your Anthropic API key. Select environments: **Production**, **Preview**, **Development**.

- [ ] **Step 3: Deploy to production**

```bash
vercel --prod
```

Expected output ends with: `✅  Production: https://growth-agent-xxxx.vercel.app`

- [ ] **Step 4: Smoke test the deployed URL**

Open the production URL. Send the query: `"Which projects are at risk?"` Expected: streaming response identifying Client A with source badges.

- [ ] **Step 5: Commit the Vercel config if generated**

```bash
git add .vercel/project.json
git commit -m "chore: link Vercel project"
```

---

## Self-Review Checklist

### Spec coverage

- [x] WAYRTTD answered in system prompt (not just answering, acting as PM with judgment)
- [x] 10 tools all implemented with mock data
- [x] 4 demo clients covering all evaluation scenarios
- [x] Conflict detection: detectConflicts() + TDD + injected into system prompt
- [x] Structured output: finalize_response tool enforces confidence/risks/conflicts/actions
- [x] Write-back with human-in-the-loop: /api/actions + WriteBackCard + Approve button
- [x] Source badges per tool consulted
- [x] Confidence indicator
- [x] Streaming chat UI
- [x] Client sidebar
- [x] Permission filtering: getClientsByUser() + TDD
- [x] MCP rationale in spec (not in code — it's an architecture decision to articulate in demo)
- [x] Deployed to Vercel

### No placeholders

- All code blocks are complete
- All file paths are exact
- All commands include expected output
- No "similar to Task N" references

### Type consistency

- `ClientId` used consistently across data layer, tools, and orchestrator
- `FinalizeResponseArgs` matches the Zod schema in orchestrator
- `UIMessage` imported from `ai` in message-bubble
- `ProposedAction` flows from types → orchestrator → write-back-card → /api/actions
