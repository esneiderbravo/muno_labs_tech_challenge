import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    getUserById: vi.fn(),
    canUserAccessClient: vi.fn(),
    loadChatHistory: vi.fn(),
    saveChatHistory: vi.fn(),
    createUserChat: vi.fn(),
    listUserChats: vi.fn(),
    deleteUserChat: vi.fn(),
  }
})

vi.mock('@/lib/data', () => ({
  getUserById: mocks.getUserById,
  canUserAccessClient: mocks.canUserAccessClient,
}))

vi.mock('@/lib/storage/chat-history', () => ({
  loadChatHistory: mocks.loadChatHistory,
  saveChatHistory: mocks.saveChatHistory,
  createUserChat: mocks.createUserChat,
  listUserChats: mocks.listUserChats,
  deleteUserChat: mocks.deleteUserChat,
}))

import { DELETE, GET, POST, PUT } from '@/app/api/chat/history/route'

function makeRequest(url: string, method: string, body?: unknown): Request {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('/api/chat/history route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUserById.mockReturnValue({
      id: 'founder-1',
      role: 'founder',
      name: 'Alex Rivera',
    })
    mocks.canUserAccessClient.mockReturnValue(true)
  })

  it('GET returns 400 for invalid scope', async () => {
    const res = await GET(new Request('http://localhost/api/chat/history?userId=founder-1'))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid history scope.' })
  })

  it('GET returns 403 for unauthorized user', async () => {
    mocks.canUserAccessClient.mockReturnValue(false)
    const res = await GET(
      new Request('http://localhost/api/chat/history?userId=founder-1&clientId=clarix'),
    )
    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({
      error: 'No hay información disponible sobre ese cliente.',
    })
  })

  it('GET returns chat history payload', async () => {
    mocks.loadChatHistory.mockResolvedValue({
      chatId: 'c1',
      chats: [{ id: 'c1', title: 'Chat', createdAt: '2026-01-01', updatedAt: '2026-01-01' }],
      messages: [{ id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'Hi' }] }],
    })

    const res = await GET(
      new Request('http://localhost/api/chat/history?userId=founder-1&clientId=clarix'),
    )

    expect(res.status).toBe(200)
    expect(mocks.loadChatHistory).toHaveBeenCalledWith('founder-1', 'clarix', undefined)
    await expect(res.json()).resolves.toEqual({
      chatId: 'c1',
      chats: [{ id: 'c1', title: 'Chat', createdAt: '2026-01-01', updatedAt: '2026-01-01' }],
      messages: [{ id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'Hi' }] }],
    })
  })

  it('PUT returns 400 for invalid payload', async () => {
    const res = await PUT(
      makeRequest('http://localhost/api/chat/history', 'PUT', {
        userId: 'founder-1',
        clientId: 'clarix',
        messages: [],
      }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid history payload.' })
  })

  it('PUT saves history and returns updated chats', async () => {
    mocks.saveChatHistory.mockResolvedValue([
      { id: 'c1', title: 'Chat 1', createdAt: '2026-01-01', updatedAt: '2026-01-02' },
    ])

    const res = await PUT(
      makeRequest('http://localhost/api/chat/history', 'PUT', {
        userId: 'founder-1',
        clientId: 'clarix',
        chatId: 'c1',
        messages: [{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hola' }] }],
      }),
    )

    expect(res.status).toBe(200)
    expect(mocks.saveChatHistory).toHaveBeenCalled()
    await expect(res.json()).resolves.toEqual({
      success: true,
      chats: [{ id: 'c1', title: 'Chat 1', createdAt: '2026-01-01', updatedAt: '2026-01-02' }],
    })
  })

  it('POST creates a chat and returns chat list', async () => {
    mocks.createUserChat.mockResolvedValue({
      id: 'c2',
      title: 'Nueva conversación',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    })
    mocks.listUserChats.mockResolvedValue([
      { id: 'c2', title: 'Nueva conversación', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
    ])

    const res = await POST(
      makeRequest('http://localhost/api/chat/history', 'POST', {
        userId: 'founder-1',
        clientId: 'clarix',
      }),
    )

    expect(res.status).toBe(200)
    expect(mocks.createUserChat).toHaveBeenCalledWith('founder-1', 'clarix', undefined)
    await expect(res.json()).resolves.toEqual({
      chat: {
        id: 'c2',
        title: 'Nueva conversación',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      chats: [
        { id: 'c2', title: 'Nueva conversación', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
      ],
    })
  })

  it('DELETE removes chat and returns new active chat id', async () => {
    mocks.deleteUserChat.mockResolvedValue({
      chats: [{ id: 'c3', title: 'Nuevo', createdAt: '2026-01-01', updatedAt: '2026-01-01' }],
      activeChatId: 'c3',
    })

    const res = await DELETE(
      makeRequest('http://localhost/api/chat/history', 'DELETE', {
        userId: 'founder-1',
        clientId: 'clarix',
        chatId: 'c2',
      }),
    )

    expect(res.status).toBe(200)
    expect(mocks.deleteUserChat).toHaveBeenCalledWith('founder-1', 'clarix', 'c2')
    await expect(res.json()).resolves.toEqual({
      chats: [{ id: 'c3', title: 'Nuevo', createdAt: '2026-01-01', updatedAt: '2026-01-01' }],
      activeChatId: 'c3',
    })
  })
})

