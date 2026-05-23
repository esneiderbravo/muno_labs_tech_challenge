import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    convertToModelMessages: vi.fn(),
    createAgentStream: vi.fn(),
    getUserById: vi.fn(),
    canUserAccessClient: vi.fn(),
    getClientsByUser: vi.fn(),
    getAllClients: vi.fn(),
  }
})

vi.mock('ai', () => ({
  convertToModelMessages: mocks.convertToModelMessages,
}))

vi.mock('@/lib/agent/orchestrator', () => ({
  createAgentStream: mocks.createAgentStream,
}))

vi.mock('@/lib/data', () => ({
  getUserById: mocks.getUserById,
  canUserAccessClient: mocks.canUserAccessClient,
  getClientsByUser: mocks.getClientsByUser,
  getAllClients: mocks.getAllClients,
}))

import { POST } from '@/app/api/chat/route'

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.convertToModelMessages.mockResolvedValue([{ role: 'user', content: 'normalized' }])
    mocks.createAgentStream.mockReturnValue({
      toUIMessageStreamResponse: () => Response.json({ ok: true }),
    })
    mocks.getUserById.mockReturnValue({
      id: 'founder-1',
      role: 'founder',
      name: 'Alex Rivera',
    })
    mocks.canUserAccessClient.mockReturnValue(true)
    mocks.getClientsByUser.mockReturnValue([{ id: 'clarix', name: 'Clarix' }])
    mocks.getAllClients.mockReturnValue([{ id: 'clarix', name: 'Clarix' }])
  })

  it('returns 403 when user does not exist', async () => {
    mocks.getUserById.mockReturnValue(undefined)

    const res = await POST(
      createRequest({
        userId: 'missing',
        clientId: 'clarix',
        messages: [],
      }),
    )

    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({
      error: 'No hay información disponible para este usuario.',
    })
  })

  it('returns 403 when user cannot access selected scope', async () => {
    mocks.canUserAccessClient.mockReturnValue(false)

    const res = await POST(
      createRequest({
        userId: 'account-lead-1',
        clientId: 'clarix',
        messages: [],
      }),
    )

    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({
      error: 'No hay información disponible sobre ese cliente.',
    })
  })

  it('returns 403 when conversation mentions unauthorized client', async () => {
    mocks.getClientsByUser.mockReturnValue([{ id: 'clarix', name: 'Clarix' }])
    mocks.getAllClients.mockReturnValue([
      { id: 'clarix', name: 'Clarix' },
      { id: 'paylane', name: 'Paylane' },
    ])

    const res = await POST(
      createRequest({
        userId: 'account-lead-1',
        clientId: 'all',
        messages: [
          { id: '1', role: 'user', parts: [{ type: 'text', text: 'Necesito update de Paylane' }] },
        ],
      }),
    )

    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({
      error: 'No hay información disponible sobre el cliente "Paylane".',
    })
  })

  it('returns 403 when mentioned client is outside currently selected scope', async () => {
    mocks.getClientsByUser.mockReturnValue([
      { id: 'clarix', name: 'Clarix' },
      { id: 'trackflow', name: 'Trackflow' },
    ])
    mocks.getAllClients.mockReturnValue([
      { id: 'clarix', name: 'Clarix' },
      { id: 'trackflow', name: 'Trackflow' },
    ])

    const res = await POST(
      createRequest({
        userId: 'founder-1',
        clientId: 'clarix',
        messages: [
          { id: '1', role: 'user', parts: [{ type: 'text', text: 'Quiero estado de Trackflow' }] },
        ],
      }),
    )

    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({
      error: 'No hay información disponible sobre ese cliente en el contexto seleccionado.',
    })
  })

  it('streams response when request is valid and passes scope to orchestrator', async () => {
    mocks.getClientsByUser.mockReturnValue([
      { id: 'clarix', name: 'Clarix' },
      { id: 'trackflow', name: 'Trackflow' },
    ])
    mocks.getAllClients.mockReturnValue([{ id: 'clarix', name: 'Clarix' }])

    const reqBody = {
      userId: 'founder-1',
      clientId: 'clarix',
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: '¿Cómo va Clarix?' }] },
      ],
    }

    const res = await POST(createRequest(reqBody))

    expect(res.status).toBe(200)
    expect(mocks.convertToModelMessages).toHaveBeenCalledWith(reqBody.messages)
    expect(mocks.createAgentStream).toHaveBeenCalledWith(
      [{ role: 'user', content: 'normalized' }],
      {
        requestedClientId: 'clarix',
        allowedClientIds: ['clarix', 'trackflow'],
      },
    )
    await expect(res.json()).resolves.toEqual({ ok: true })
  })
})
