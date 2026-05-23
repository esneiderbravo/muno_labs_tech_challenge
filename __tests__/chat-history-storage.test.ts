import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import os from 'node:os'
import path from 'node:path'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import type { UIMessage } from '@/lib/types'

const originalCwd = process.cwd()

function userTextMessage(id: string, text: string): UIMessage {
  return {
    id,
    role: 'user',
    parts: [{ type: 'text', text }],
  }
}

async function importStorage() {
  vi.resetModules()
  return import('@/lib/storage/chat-history')
}

describe('chat-history storage', () => {
  let tempDir = ''

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'growth-agent-storage-'))
    process.chdir(tempDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('creates an initial empty chat when loading history without data', async () => {
    const storage = await importStorage()

    const history = await storage.loadChatHistory('founder-1', 'clarix')

    expect(history.chatId).toBeTruthy()
    expect(history.messages).toEqual([])
    expect(history.chats).toHaveLength(1)
    expect(history.chats[0].title).toBe('Nueva conversación')
  })

  it('saves messages and infers title from first user message', async () => {
    const storage = await importStorage()
    const chat = await storage.createUserChat('founder-1', 'clarix')

    const messages = [userTextMessage('u1', 'Follow up with Clarix growth blockers this week')]
    const chats = await storage.saveChatHistory('founder-1', 'clarix', chat.id, messages)

    expect(chats[0].id).toBe(chat.id)
    expect(chats[0].title).toContain('Follow up with Clarix growth blockers')

    const loaded = await storage.loadChatHistory('founder-1', 'clarix', chat.id)
    expect(loaded.messages).toEqual(messages)
  })

  it('creates a replacement chat when deleting the last chat', async () => {
    const storage = await importStorage()
    const chat = await storage.createUserChat('founder-1', 'clarix')

    const result = await storage.deleteUserChat('founder-1', 'clarix', chat.id)

    expect(result.chats).toHaveLength(1)
    expect(result.activeChatId).toBe(result.chats[0].id)
    expect(result.chats[0].title).toBe('Nueva conversación')
  })

  it('migrates legacy single-file history format into indexed chat files', async () => {
    const userId = 'founder-1'
    const clientId = 'clarix'
    const encodedUser = encodeURIComponent(userId)
    const encodedClient = encodeURIComponent(clientId)
    const storageDir = path.join(tempDir, '.data', 'chat-history')
    const legacyFile = path.join(storageDir, `${encodedUser}__${encodedClient}.json`)

    await mkdir(storageDir, { recursive: true })
    await writeFile(
      legacyFile,
      JSON.stringify([userTextMessage('u1', 'Legacy conversation title from first user message')]),
      'utf8',
    )

    const storage = await importStorage()
    const chats = await storage.listUserChats(userId, clientId)

    expect(chats).toHaveLength(1)
    expect(chats[0].title).toContain('Legacy conversation title')

    const loaded = await storage.loadChatHistory(userId, clientId, chats[0].id)
    expect(loaded.messages).toHaveLength(1)
    expect(loaded.messages[0].role).toBe('user')
  })
})

