# Muno Labs — Tech & Growth Agent (Technical Challenge)

Web prototype of a **virtual PM conversational agent** for an agency handling multiple B2B accounts.  
The goal is not generic chat, but to **consolidate fragmented signals**, detect risks/conflicts, and propose concrete actions with human approval.

## Challenge goal

Answer questions such as:
1. How is Client A doing this week?
2. What remained pending after the last meeting?
3. Which projects are at risk?
4. What did we promise vs. what has already been delivered?

## Stack

- **Next.js 16** + **React 19** + **TypeScript**
- **Vercel AI SDK** (streaming + tool calling)
- **OpenAI provider** (`@ai-sdk/openai`)
- Tailwind CSS v4 + UI components
- Vitest + ESLint + Prettier

## What this prototype implements (v1)

1. **Streaming web chat** with PM-oriented UX.
2. **Tool orchestration** based on query type (does not call all sources every time).
3. **10 mocked sources**: Notion, Linear, Slack, Transcripts, Calendar, Drive, GitHub, Obsidian, PostHog, WhatsApp.
4. **Semantic conflict detection across sources** (e.g., REST vs GraphQL vs hybrid).
5. **Role/account-based permissions** (founder vs account lead) with unauthorized access blocking.
6. **Human-in-the-loop write-back** (proposal + approval; mocked execution in v1).
7. **Local chat history persistence** per user/client in `.data/chat-history`.

## Architecture (summary)

1. `app/page.tsx` + `components/chat/*`: main interface.
2. `app/api/chat/route.ts`: conversation endpoint and scope control.
3. `lib/agent/orchestrator.ts`: model selection, tools, and response flow.
4. `lib/agent/conflict-detector.ts`: conflict detection via semantic discrepancies across sources.
5. `lib/tools/*`: tool layer (mock-backed in v1).
6. `app/api/actions/route.ts`: proposed action execution (mock in v1).
7. `app/api/chat/history/route.ts` + `lib/storage/chat-history.ts`: local history layer.

## Environment variables

Create `.env.local` with:

```bash
OPENAI_API_KEY=your_api_key
# Optional
OPENAI_MODEL=gpt-4o-mini
OPENAI_FALLBACK_MODELS=gpt-4.1-mini,gpt-4o-mini
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful scripts

```bash
npm run lint
npm run test
npm run build
```

## Product status (v1 scope)

- ✅ End-to-end query flow with structured responses.
- ✅ Explicit conflict detection and confidence signaling.
- ✅ Write-back action proposals with approval flow.
- ⚠️ Real integrations not connected yet (mock data).
- ⚠️ Production auth/deployment outside current scope.

## Supporting documents

- Technical specification: `docs/superpowers/specs/2026-05-23-growth-agent-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-23-growth-agent.md`
- Interview prep guide: `docs/munolabs-entrevista-preparacion.md`
