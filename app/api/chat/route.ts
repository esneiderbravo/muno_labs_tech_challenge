// app/api/chat/route.ts
import { convertToModelMessages } from 'ai'
import { createAgentStream } from '@/lib/agent/orchestrator'
import { canUserAccessClient, getAllClients, getClientsByUser, getUserById } from '@/lib/data'
import type { ChatRequestBody } from '@/lib/types'

/**
 * Normalize text for case-insensitive and accent-insensitive matching.
 *
 * @param value - Raw text input to normalize.
 * @returns Normalized text suitable for mention detection.
 */
function normalizeForMatch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Collect and normalize user-authored text from a chat request.
 *
 * @param messages - Conversation messages from the request body.
 * @returns Normalized concatenated user text.
 */
function getConversationUserText(messages: ChatRequestBody['messages']): string {
  const userMessages = messages.filter((message) => message.role === 'user')
  if (userMessages.length === 0) return ''

  const text = userMessages
    .map((message) => {
      if (!('parts' in message) || !Array.isArray(message.parts)) return ''
      return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ')
    })
    .join(' ')

  return normalizeForMatch(text)
}

/**
 * Handle chat requests, enforce client scope access, and stream agent output.
 *
 * @param req - Incoming request with chat messages and scope metadata.
 * @returns Streaming UI message response or access error response.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody
  const { messages, clientId, userId } = body

  const user = getUserById(userId)
  if (!user) {
    return Response.json(
      { error: 'No hay información disponible para este usuario.' },
      { status: 403 },
    )
  }

  if (!canUserAccessClient(user.id, user.role, clientId)) {
    return Response.json(
      { error: 'No hay información disponible sobre ese cliente.' },
      { status: 403 },
    )
  }

  const allowedClientIds = getClientsByUser(user.id, user.role).map((client) => client.id)
  const allowedClientIdsSet = new Set(allowedClientIds)
  const conversationUserText = getConversationUserText(messages)
  const allClients = getAllClients()

  const mentionedClient = allClients.find((client) => {
    const idMentioned = conversationUserText.includes(normalizeForMatch(client.id))
    const nameMentioned = conversationUserText.includes(normalizeForMatch(client.name))
    return idMentioned || nameMentioned
  })

  if (mentionedClient && !allowedClientIdsSet.has(mentionedClient.id)) {
    return Response.json(
      {
        error: `No hay información disponible sobre el cliente "${mentionedClient.name}".`,
      },
      { status: 403 },
    )
  }

  if (clientId !== 'all' && mentionedClient && mentionedClient.id !== clientId) {
    return Response.json(
      {
        error: 'No hay información disponible sobre ese cliente en el contexto seleccionado.',
      },
      { status: 403 },
    )
  }

  const result = createAgentStream(await convertToModelMessages(messages), {
    requestedClientId: clientId,
    allowedClientIds,
  })

  return result.toUIMessageStreamResponse()
}
