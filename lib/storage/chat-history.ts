import { randomUUID } from 'node:crypto'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { ChatThreadSummary, ClientId, UIMessage } from '@/lib/types'

const STORAGE_DIR = path.join(process.cwd(), '.data', 'chat-history')
const DEFAULT_CHAT_TITLE = 'Nueva conversación'

/**
 * Build file path for legacy single-thread chat history storage.
 *
 * @param userId - User identifier that owns the history.
 * @param clientId - Client scope for the history.
 * @returns Absolute path to legacy history file.
 */
function getLegacyHistoryFilePath(userId: string, clientId: ClientId | 'all'): string {
  const safeUserId = encodeURIComponent(userId)
  const safeClientId = encodeURIComponent(clientId)
  return path.join(STORAGE_DIR, `${safeUserId}__${safeClientId}.json`)
}

/**
 * Build file path for the chat thread index file.
 *
 * @param userId - User identifier that owns the history.
 * @param clientId - Client scope for the history.
 * @returns Absolute path to index file.
 */
function getChatIndexFilePath(userId: string, clientId: ClientId | 'all'): string {
  const safeUserId = encodeURIComponent(userId)
  const safeClientId = encodeURIComponent(clientId)
  return path.join(STORAGE_DIR, `${safeUserId}__${safeClientId}__index.json`)
}

/**
 * Build file path for a specific chat thread message file.
 *
 * @param userId - User identifier that owns the history.
 * @param clientId - Client scope for the history.
 * @param chatId - Chat thread identifier.
 * @returns Absolute path to chat message file.
 */
function getChatHistoryFilePath(userId: string, clientId: ClientId | 'all', chatId: string): string {
  const safeUserId = encodeURIComponent(userId)
  const safeClientId = encodeURIComponent(clientId)
  const safeChatId = encodeURIComponent(chatId)
  return path.join(STORAGE_DIR, `${safeUserId}__${safeClientId}__${safeChatId}.json`)
}

/**
 * Derive a chat title from the first user-authored text part.
 *
 * @param messages - Chat message list to inspect.
 * @returns Trimmed title candidate when available.
 */
function getFirstUserText(messages: UIMessage[]): string | null {
  const firstUserMessage = messages.find((message) => message.role === 'user')
  if (!firstUserMessage) return null

  for (const part of firstUserMessage.parts ?? []) {
    if (part.type === 'text' && typeof part.text === 'string' && part.text.trim().length > 0) {
      return part.text.trim().slice(0, 80)
    }
  }

  return null
}

async function readChatIndex(userId: string, clientId: ClientId | 'all'): Promise<ChatThreadSummary[]> {
  try {
    const content = await readFile(getChatIndexFilePath(userId, clientId), 'utf8')
    const parsed = JSON.parse(content) as ChatThreadSummary[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeChatIndex(
  userId: string,
  clientId: ClientId | 'all',
  chats: ChatThreadSummary[],
): Promise<void> {
  await mkdir(STORAGE_DIR, { recursive: true })
  await writeFile(getChatIndexFilePath(userId, clientId), JSON.stringify(chats), 'utf8')
}

async function readChatMessages(
  userId: string,
  clientId: ClientId | 'all',
  chatId: string,
): Promise<UIMessage[]> {
  try {
    const content = await readFile(getChatHistoryFilePath(userId, clientId, chatId), 'utf8')
    const parsed = JSON.parse(content) as UIMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function migrateLegacyHistoryIfNeeded(
  userId: string,
  clientId: ClientId | 'all',
): Promise<ChatThreadSummary[]> {
  const chats = await readChatIndex(userId, clientId)
  if (chats.length > 0) return chats

  try {
    const content = await readFile(getLegacyHistoryFilePath(userId, clientId), 'utf8')
    const parsed = JSON.parse(content) as UIMessage[]
    if (!Array.isArray(parsed)) return []

    const now = new Date().toISOString()
    const migratedChat: ChatThreadSummary = {
      id: randomUUID(),
      title: getFirstUserText(parsed) ?? DEFAULT_CHAT_TITLE,
      createdAt: now,
      updatedAt: now,
    }

    await mkdir(STORAGE_DIR, { recursive: true })
    await writeFile(getChatHistoryFilePath(userId, clientId, migratedChat.id), JSON.stringify(parsed), 'utf8')
    await writeChatIndex(userId, clientId, [migratedChat])
    return [migratedChat]
  } catch {
    return []
  }
}

/**
 * Read and sort all chat threads available for a user and client scope.
 *
 * @param userId - User identifier that owns the chats.
 * @param clientId - Client scope for the chats.
 * @returns Chat summaries ordered by most recently updated.
 */
export async function listUserChats(
  userId: string,
  clientId: ClientId | 'all',
): Promise<ChatThreadSummary[]> {
  const chats = await migrateLegacyHistoryIfNeeded(userId, clientId)
  return chats.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/**
 * Create a new empty chat thread for a user and client scope.
 *
 * @param userId - User identifier that owns the chat.
 * @param clientId - Client scope for the chat.
 * @param title - Optional explicit title for the new chat.
 * @returns Newly created chat summary.
 */
export async function createUserChat(
  userId: string,
  clientId: ClientId | 'all',
  title?: string,
): Promise<ChatThreadSummary> {
  const chats = await listUserChats(userId, clientId)
  const now = new Date().toISOString()
  const chat: ChatThreadSummary = {
    id: randomUUID(),
    title: title?.trim() || DEFAULT_CHAT_TITLE,
    createdAt: now,
    updatedAt: now,
  }

  await mkdir(STORAGE_DIR, { recursive: true })
  await writeFile(getChatHistoryFilePath(userId, clientId, chat.id), JSON.stringify([]), 'utf8')
  await writeChatIndex(userId, clientId, [chat, ...chats])
  return chat
}

/**
 * Load chats and messages for the selected thread, creating one when needed.
 *
 * @param userId - User identifier that owns the chats.
 * @param clientId - Client scope for the chats.
 * @param preferredChatId - Preferred chat identifier to load.
 * @returns Active chat id, available chats, and loaded messages.
 */
export async function loadChatHistory(
  userId: string,
  clientId: ClientId | 'all',
  preferredChatId?: string,
): Promise<{ chatId: string; chats: ChatThreadSummary[]; messages: UIMessage[] }> {
  const chats = await listUserChats(userId, clientId)
  const selectedChat = preferredChatId
    ? chats.find((chat) => chat.id === preferredChatId) ?? chats[0]
    : chats[0]

  if (!selectedChat) {
    const newChat = await createUserChat(userId, clientId)
    return { chatId: newChat.id, chats: [newChat], messages: [] }
  }

  const messages = await readChatMessages(userId, clientId, selectedChat.id)
  return { chatId: selectedChat.id, chats, messages }
}

/**
 * Persist chat messages and update metadata for the active thread.
 *
 * @param userId - User identifier that owns the chat.
 * @param clientId - Client scope for the chat.
 * @param chatId - Chat identifier being updated.
 * @param messages - Full message list to persist.
 * @returns Updated chat summaries ordered by recency.
 */
export async function saveChatHistory(
  userId: string,
  clientId: ClientId | 'all',
  chatId: string,
  messages: UIMessage[],
): Promise<ChatThreadSummary[]> {
  const chats = await listUserChats(userId, clientId)
  const now = new Date().toISOString()
  const inferredTitle = getFirstUserText(messages)
  const existing = chats.find((chat) => chat.id === chatId)

  const nextChat: ChatThreadSummary = existing
    ? {
        ...existing,
        updatedAt: now,
        title:
          existing.title === DEFAULT_CHAT_TITLE && inferredTitle ? inferredTitle : existing.title,
      }
    : {
        id: chatId,
        title: inferredTitle ?? DEFAULT_CHAT_TITLE,
        createdAt: now,
        updatedAt: now,
      }

  const remaining = chats.filter((chat) => chat.id !== chatId)
  const nextChats = [nextChat, ...remaining].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  await mkdir(STORAGE_DIR, { recursive: true })
  await writeFile(getChatHistoryFilePath(userId, clientId, chatId), JSON.stringify(messages), 'utf8')
  await writeChatIndex(userId, clientId, nextChats)
  return nextChats
}

/**
 * Delete a chat thread and resolve the next active thread selection.
 *
 * @param userId - User identifier that owns the chat.
 * @param clientId - Client scope for the chat.
 * @param chatId - Chat identifier to delete.
 * @returns Remaining chats and the active chat id after deletion.
 */
export async function deleteUserChat(
  userId: string,
  clientId: ClientId | 'all',
  chatId: string,
): Promise<{ chats: ChatThreadSummary[]; activeChatId: string }> {
  const chats = await listUserChats(userId, clientId)
  const remaining = chats.filter((chat) => chat.id !== chatId)

  try {
    await unlink(getChatHistoryFilePath(userId, clientId, chatId))
  } catch {
    // File may already be missing; keep index consistent anyway.
  }

  if (remaining.length === 0) {
    const now = new Date().toISOString()
    const newChat: ChatThreadSummary = {
      id: randomUUID(),
      title: DEFAULT_CHAT_TITLE,
      createdAt: now,
      updatedAt: now,
    }

    await mkdir(STORAGE_DIR, { recursive: true })
    await writeFile(getChatHistoryFilePath(userId, clientId, newChat.id), JSON.stringify([]), 'utf8')
    await writeChatIndex(userId, clientId, [newChat])
    return { chats: [newChat], activeChatId: newChat.id }
  }

  const sortedChats = remaining.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  await writeChatIndex(userId, clientId, sortedChats)
  return { chats: sortedChats, activeChatId: sortedChats[0].id }
}
