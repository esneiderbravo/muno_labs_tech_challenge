import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/actions/route'

function createJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/actions', () => {
  it('returns linear task confirmation', async () => {
    const response = await POST(
      createJsonRequest({
        action: {
          type: 'linear_task',
          description: 'Create follow-up',
          previewText: 'Follow up with Clarix',
          data: {},
        },
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Task "Follow up with Clarix" created in Linear.',
    })
  })

  it('falls back to generic success message for unknown action type', async () => {
    const response = await POST(
      createJsonRequest({
        action: {
          type: 'unknown',
          description: 'Unsupported',
          previewText: 'noop',
          data: {},
        },
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Action executed.',
    })
  })
})

