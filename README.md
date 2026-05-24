# 🚀 Growth Agent for B2B Agencies

> **Turn scattered information into clear decisions in seconds.**

This project showcases a virtual PM-style conversational agent that unifies signals from multiple tools, detects risks/conflicts, and proposes concrete actions with human approval.

## 🎯 Demo

- **🌐 App:** https://muno-labs-tech-challenge.vercel.app
- **📊 Sales deck:** `growth-agent-presentation.pptx`

## 💬 One-line sales pitch

If you currently need to check Slack, Linear, notes, emails, and chats to understand one account, this agent gives you an **executive-ready answer with evidence and next steps** from a single query.

## 💼 Business value

1. **⚡ Immediate executive visibility:** client status, blockers, and risks in plain language.
2. **⏱️ Lower operational overhead:** avoids manual cross-checking across tools per client.
3. **🛡️ Safer decisions:** surfaces cross-source conflicts and includes confidence levels.
4. **✅ Action, not just summaries:** proposes tasks/messages/docs with a human approval flow.

## 🌟 Key differentiators

- **🧠 Not a generic chatbot:** this is actionable organizational memory.
- **🎛️ Intelligent source orchestration:** calls only the relevant tools for each query.
- **📐 Always structured output:** consistent responses with risks, evidence, and actions.
- **🔒 Control and trust:** role/account permissions + human-in-the-loop write-back.

## 🧩 Functional scope (v1)

- 💬 Streaming web chat with an agency-operations-focused UX.
- 🛠️ Tool orchestration by query type.
- 🔗 10 mocked sources: Notion, Linear, Slack, Transcripts, Calendar, Drive, GitHub, Obsidian, PostHog, and WhatsApp.
- ⚠️ Semantic conflict detection across sources.
- 👥 Role-based permissions (founder/account lead) with unauthorized-access blocking.
- ✍️ Human-approved write-back proposals (mock execution).
- 🗂️ Local user/client chat history in `.data/chat-history`.

## 🏗️ Architecture (technical summary)

1. `app/page.tsx` + `components/chat/*`: main interface.
2. `app/api/chat/route.ts`: conversation endpoint and scope control.
3. `lib/agent/orchestrator.ts`: model selection, tools, and response flow.
4. `lib/agent/conflict-detector.ts`: cross-source discrepancy detection.
5. `lib/tools/*`: tool layer (mock-backed in v1).
6. `app/api/actions/route.ts`: proposed action execution (mock in v1).
7. `app/api/chat/history/route.ts` + `lib/storage/chat-history.ts`: history persistence.

## 🧱 Stack

- **Next.js 16** + **React 19** + **TypeScript**
- **Vercel AI SDK** (streaming + tool calling)
- **OpenAI provider** (`@ai-sdk/openai`)
- Tailwind CSS v4 + UI components
- Vitest + ESLint + Prettier

## 🔧 Environment variables

Create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key
# Optional
OPENAI_MODEL=gpt-4o-mini
OPENAI_FALLBACK_MODELS=gpt-4.1-mini,gpt-4o-mini
```

## ▶️ Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 🧪 Useful scripts

```bash
npm run lint
npm run test
npm run build
```

## 📌 Product status (v1)

- ✅ End-to-end flow with structured responses.
- ✅ Explicit conflict detection + confidence signaling.
- ✅ Action proposals with approval.
- ⚠️ Real integrations are not connected yet (mock data).
- ⚠️ Production auth/deployment is outside this challenge scope.

## 📚 Supporting documentation

- Technical spec: `docs/superpowers/specs/2026-05-23-growth-agent-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-23-growth-agent.md`
