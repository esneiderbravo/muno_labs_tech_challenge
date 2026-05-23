import { canUserAccessClient, getUserById } from '@/lib/data'
import {
  createUserChat,
  deleteUserChat,
  listUserChats,
  loadChatHistory,
  saveChatHistory,
} from '@/lib/storage/chat-history'
import type { ChatRequestBody, ClientId, UIMessage } from '@/lib/types'

function isValidClientScope(value: string): value is ClientId | 'all' {
  return [
    'all',
    'vivamart',
    'clarix',
    'cornerstone',
    'paylane',
    'bloom',
    'draftly',
    'metrify',
    'nexova',
    'solara',
    'trackflow',
  ].includes(value)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const clientId = searchParams.get('clientId')
  const chatId = searchParams.get('chatId') ?? undefined

  if (!userId || !clientId || !isValidClientScope(clientId)) {
    return Response.json({ error: 'Invalid history scope.' }, { status: 400 })
  }

  const user = getUserById(userId)
  if (!user || !canUserAccessClient(user.id, user.role, clientId)) {
    return Response.json({ error: 'No hay información disponible sobre ese cliente.' }, { status: 403 })
  }

  const history = await loadChatHistory(user.id, clientId, chatId)
  return Response.json(history)
}

export async function PUT(req: Request) {
  const body = (await req.json()) as {
    userId: string
    clientId: ChatRequestBody['clientId']
    chatId?: string
    messages: UIMessage[]
  }
  const { userId, clientId, chatId, messages } = body

  if (
    !userId ||
    !clientId ||
    !chatId ||
    !Array.isArray(messages) ||
    !isValidClientScope(clientId)
  ) {
    return Response.json({ error: 'Invalid history payload.' }, { status: 400 })
  }

  const user = getUserById(userId)
  if (!user || !canUserAccessClient(user.id, user.role, clientId)) {
    return Response.json({ error: 'No hay información disponible sobre ese cliente.' }, { status: 403 })
  }

  const chats = await saveChatHistory(user.id, clientId, chatId, messages)
  return Response.json({ success: true, chats })
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    userId: string
    clientId: ChatRequestBody['clientId']
    title?: string
  }
  const { userId, clientId, title } = body

  if (!userId || !clientId || !isValidClientScope(clientId)) {
    return Response.json({ error: 'Invalid history payload.' }, { status: 400 })
  }

  const user = getUserById(userId)
  if (!user || !canUserAccessClient(user.id, user.role, clientId)) {
    return Response.json({ error: 'No hay información disponible sobre ese cliente.' }, { status: 403 })
  }

  const chat = await createUserChat(user.id, clientId, title)
  const chats = await listUserChats(user.id, clientId)
  return Response.json({ chat, chats })
}

export async function DELETE(req: Request) {
  const body = (await req.json()) as {
    userId: string
    clientId: ChatRequestBody['clientId']
    chatId?: string
  }
  const { userId, clientId, chatId } = body

  if (!userId || !clientId || !chatId || !isValidClientScope(clientId)) {
    return Response.json({ error: 'Invalid history payload.' }, { status: 400 })
  }

  const user = getUserById(userId)
  if (!user || !canUserAccessClient(user.id, user.role, clientId)) {
    return Response.json({ error: 'No hay información disponible sobre ese cliente.' }, { status: 403 })
  }

  const result = await deleteUserChat(user.id, clientId, chatId)
  return Response.json(result)
}
