// app/api/chat/route.ts
import { convertToModelMessages } from 'ai'
import { createAgentStream } from '@/lib/agent/orchestrator'
import type { ChatRequestBody } from '@/lib/types'

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody
  const { messages, clientId } = body

  const result = createAgentStream(await convertToModelMessages(messages), clientId)

  return result.toUIMessageStreamResponse()
}
