# Growth Agent — Design Spec

**Date:** 2026-05-23  
**Challenge:** MunoLabs Caso Tech & Growth Agent  
**Stack:** Next.js 16 + TypeScript + Vercel AI SDK + Claude claude-sonnet-4-6 + Vercel

---

## 1. WAYRTTD — What Are We Really Trying To Do

**Not:** Answer questions about projects.

**It is:** Convert fragmented knowledge from multiple tools into actionable organizational memory. Eliminate project state living only in people's heads.

The agent is a **virtual PM with memory + context + judgment** — not a RAG chatbot.

---

## 2. The Real Problem

An agency with 10+ active B2B clients has its project state scattered across 10 different tools. Getting a clear update on all projects takes a founder half a day. The agent solves this by being the single interface that orchestrates all sources with judgment.

---

## 3. General Architecture

```
Browser (Next.js App Router)
    └─ Chat UI
         – Streaming responses
         – Source badges per tool consulted
         – Confidence indicator (High/Medium/Low)
         – Conflict alert when sources disagree
         – Write-back card: "Agent proposes X → [Approve]"
         – Client sidebar
         │
         ▼
    /api/chat  (Next.js Route Handler)
         │
         ▼
    Orchestrator Agent
         – Vercel AI SDK streamText + tool calling
         – Claude claude-sonnet-4-6
         – Tool call loop until sufficient context gathered
         – detectConflicts() before passing to LLM
         – Always structured output
         │
    ┌────┴──────────────────────────────────┐
    │           Tool Registry (10 tools)    │
    └───────────────────────────────────────┘
         │
    Memory Layer (in-memory per session)
         – Caches tool results to avoid re-fetching
         – Records which tools were called and when
         │
         ▼
    Mock Data Layer
         – TypeScript modules with interface identical to real APIs
         – 4 fictional clients with scenarios designed for the demo
         – Swap to real: only change each function body, not the architecture
```

---

## 4. Tool Registry — All 10 Tools

The agent decides which tools to call based on the question type. It does not call all tools every time.

| Tool                                   | Mock data                                  | Mode                 | Simulated freshness  |
| -------------------------------------- | ------------------------------------------ | -------------------- | -------------------- |
| `get_notion_docs(client)`              | Wikis, proposals, clean meeting notes      | Read                 | Days–weeks           |
| `get_linear_tasks(client)`             | Tasks, bugs, milestones, cycles            | Read + Write         | Hours–days           |
| `get_slack_messages(client, channel?)` | Client threads, quick decisions            | Read + Write (draft) | Minutes              |
| `get_meeting_transcripts(client)`      | Transcripts + Granola/Circleback summaries | Read                 | Minutes post-meeting |
| `get_calendar_events(client)`          | Past/future meetings, attendees            | Read                 | Variable             |
| `get_drive_files(client)`              | Decks, proposals, assets, exports          | Read                 | Weeks                |
| `get_github_activity(client)`          | PRs, issues, recent commits                | Read                 | Hours                |
| `get_obsidian_notes(founder?)`         | Founder private notes                      | Read                 | Days                 |
| `get_posthog_metrics(client)`          | Real-time product metrics                  | Read                 | Real-time            |
| `get_whatsapp_messages(client)`        | Recent client channel messages             | Read                 | Minutes              |

### Intelligent selection by query type

```
"How is Client A doing this week?"
→ transcripts + linear + slack
→ NOT: drive, obsidian, posthog

"What are Client B's metrics?"
→ posthog + linear + transcripts
→ NOT: drive, github, calendar

"Prepare a brief for my meeting with Client C tomorrow"
→ calendar + transcripts + linear + slack + notion
→ NOT: posthog, obsidian (unless founder requests it)

"Is there anything urgent in Client D's repo?"
→ github + linear + slack
→ NOT: calendar, drive, whatsapp
```

The intelligence is visible in the demo: the user sees in real time which tools the agent consulted and why.

---

## 5. Mock Data — 4 Clients Designed for the Demo

| Client       | Scenario                                                                              | Demonstrates                              |
| ------------ | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Client A** | At-risk project: deadline this week, 3 overdue tasks, no Slack update in 5 days       | Risk detection, prioritization            |
| **Client B** | Healthy state, recent meeting, positive PostHog metrics                               | Normal structured response                |
| **Client C** | Active conflict: Granola(Tuesday)=X, Linear(Wednesday)=Y, Slack(Thursday)=Z, Notion=X | Conflict resolution with confidence score |
| **Client D** | Promises from last month in transcripts, some closed in Linear, others with no task   | Commitment cross-reference                |

---

## 6. Conflict Resolution

Logic in the orchestrator (before the LLM — more predictable):

```typescript
function detectConflicts(toolResults: ToolResult[]): Conflict[] {
  // Compare key fields across sources per client
  // Priority criterion: most recent timestamp wins
  // If conflict found: do NOT silence it — pass to LLM with explicit context
}
```

**Response format when a conflict is detected:**

```
⚠️ Conflict detected across sources:
  - Granola (Tuesday 05/20): Decision was to proceed with design X
  - Linear (Wednesday 05/21): Task closed as Y
  - Slack (Thursday 05/22): Thread suggests switching to Z

Most recent source: Slack / Z
Confidence: Medium (70%)
Recommendation: Confirm with the team before proceeding.
```

---

## 7. Always Structured Output

The LLM never responds with free text. The system prompt enforces this format:

```typescript
interface AgentResponse {
  summary: string // 2–3 executive lines
  risks: Risk[] // With evidence and source
  next_steps: string[] // Concrete and actionable
  confidence: 'high' | 'medium' | 'low'
  confidence_reason: string
  sources_consulted: string[]
  conflicts?: Conflict[] // Only if detected
  proposed_actions?: ProposedAction[] // Write-back pending approval
}
```

**Confidence rules:**

- `high`: all consulted sources agree
- `medium`: sources mostly aligned, minor discrepancy
- `low`: active conflict, single source, or stale data

---

## 8. Write-back with Human-in-the-Loop

The agent can propose write actions, never execute them alone:

| Action        | Tool   | Flow                                     |
| ------------- | ------ | ---------------------------------------- |
| Create task   | Linear | Agent proposes → user approves → created |
| Update doc    | Notion | Agent proposes → user approves → updated |
| Message draft | Slack  | Agent drafts → user reviews/sends        |

**Autonomy in v1: draft mode only.** The agent never acts on its own.

---

## 9. Guardrails

| Risk                    | Guardrail                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| Data hallucination      | The LLM can only cite data that came from a tool call. The prompt explicitly forbids inventing information. |
| Silenced conflict       | If `detectConflicts()` returns results, the prompt forces the LLM to mention them.                          |
| Overconfidence          | Confidence "High" only when all sources agree. Single source = "Low".                                       |
| Unauthorized write-back | Every write action requires explicit user confirmation (Approve button).                                    |
| Account permissions     | Every query includes `userId`. The mock data layer filters by accounts assigned to that user.               |
| Agent scope creep       | The system prompt explicitly defines what the agent can and cannot do.                                      |

---

## 10. MCP vs Direct API vs Scrape

### Scrape — Rejected

Brittle, violates ToS on most tools, high maintenance cost. Only viable for tools with no API (WhatsApp edge case). Not used in this project.

### Direct API — Strategy for v2

The right choice for a web app where the agent runs on our Next.js server:

| Tool                  | API                            | Notes                                    |
| --------------------- | ------------------------------ | ---------------------------------------- |
| Linear                | GraphQL API                    | Excellent docs, official SDK             |
| Slack                 | Web API                        | Official Node.js SDK, well-defined OAuth |
| GitHub                | REST + GraphQL                 | No auth needed for public repos          |
| Notion                | REST API                       | Official SDK, predictable structure      |
| Google Calendar/Drive | Google APIs                    | Standard OAuth2, mature SDKs             |
| PostHog               | REST API                       | Designed for programmatic consumption    |
| Granola/Circleback    | REST (if available) or webhook | Depends on plan/tier                     |
| WhatsApp              | Mock in v1                     | No official API without Meta Business    |
| Obsidian              | Local plugin or vault sync     | No native cloud API                      |

### MCP — The Strategic Play

MCP (Model Context Protocol) applies in two distinct ways:

**Consuming external MCP servers** (Linear MCP, GitHub MCP, Slack MCP): only makes sense if the agent runs _inside_ an MCP client like Claude Code or Cursor. In our Next.js web app with Vercel AI SDK, the agent lives on our server — external MCP servers do not apply directly in v1.

**Exposing this agent as an MCP server (v2+):** This is the real play. Turning the agent into an MCP server means founders can query it from Claude Code, Cursor, or any AI tool they already use, without opening another app. This turns the agent from a standalone product into the agency's AI infrastructure layer.

### Decision for v1

Mock modules with the same interface the real APIs would have. The agent does not know the difference. The swap to production is changing each function body, not the architecture.

---

## 11. Permission Model

```
userId → role (founder | account_lead)
         ↓
    data layer filters by assigned clients

founder     → sees all clients
account_lead → sees only their assigned accounts
```

In v1: hardcoded userId (explicitly called out in the demo as a conscious decision).  
In v2: Auth with NextAuth or Clerk, permissions inherited from the querying user.

---

## 12. Tech Stack

| Layer     | Technology                         | Rationale                                               |
| --------- | ---------------------------------- | ------------------------------------------------------- |
| Framework | Next.js 16 App Router + TypeScript | Already scaffolded, App Router for native streaming     |
| AI SDK    | Vercel AI SDK 4.x                  | `streamText` + tool calling, trivial streaming to UI    |
| LLM       | Claude claude-sonnet-4-6           | Best reasoning, aligned with JD (Claude Code = plus)    |
| UI        | Tailwind v4 + shadcn/ui            | Already configured, fast clean components               |
| Data      | TypeScript mock modules            | Identical interface to real APIs, swap without refactor |
| Deploy    | Vercel                             | Linked to repo, auto-deploy on push, 2 minutes          |
| Auth      | None in v1                         | Hardcoded userId for the demo                           |

---

## 13. Demo Script (Live Session)

5 queries that cover all evaluated scenarios:

1. `"How is Client A doing this week?"` → structured response, shows source badges
2. `"Which projects are at risk?"` → detects Client A, explains evidence
3. `"What was left pending with Client C after the last meeting?"` → triggers conflict scenario with confidence score
4. `"Prepare a brief for my meeting with Client B tomorrow"` → Calendar + Transcripts + Linear
5. `"What did we promise Client D last month and what have we delivered?"` → cross-reference transcripts vs Linear, proposes creating pending task

---

## 14. Implementation Estimate

| Task                                              | Time          |
| ------------------------------------------------- | ------------- |
| Setup + shadcn + base structure                   | 20 min        |
| Mock data layer (4 clients, 10 sources)           | 40 min        |
| Tool registry + orchestrator + conflict detection | 60 min        |
| System prompt + structured output                 | 30 min        |
| Chat UI with streaming + source badges            | 45 min        |
| Confidence indicator + conflict alert UI          | 20 min        |
| Write-back card (propose + approve)               | 20 min        |
| Vercel deploy + smoke test                        | 15 min        |
| Buffer                                            | 10 min        |
| **Total**                                         | **~3h 40min** |

---

## 15. What We Don't Do in v1 (and Why)

- **Real auth**: no time and not what they're evaluating
- **Conversation persistence**: in-memory is sufficient for the demo
- **Rate limiting / costs**: mentioned in the presentation as v2
- **MCP consumers**: our agent does not run inside an MCP client
- **Real APIs**: the mock layer demonstrates the same architecture without credential risk
