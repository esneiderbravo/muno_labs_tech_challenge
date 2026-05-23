// app/api/actions/route.ts
import type { ProposedAction } from '@/lib/types'

export async function POST(req: Request) {
  const { action } = (await req.json()) as { action: ProposedAction }

  const mockResults: Record<string, string> = {
    linear_task: `Task "${action.previewText}" created in Linear.`,
    slack_draft: `Draft message saved in Slack: "${action.previewText}"`,
    notion_update: `Notion doc updated: "${action.previewText}"`,
  }

  return Response.json({
    success: true,
    message: mockResults[action.type] ?? 'Action executed.',
  })
}
