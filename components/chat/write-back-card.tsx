'use client'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ProposedAction } from '@/lib/types'

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  linear_task: { label: 'Create Linear task', emoji: '📋' },
  slack_draft: { label: 'Send Slack draft', emoji: '💬' },
  notion_update: { label: 'Update Notion doc', emoji: '📄' },
}

interface WriteBackCardProps {
  action: ProposedAction
}

export function WriteBackCard({ action }: WriteBackCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [resultMessage, setResultMessage] = useState('')
  const info = TYPE_LABELS[action.type]

  const handleApprove = async () => {
    setStatus('loading')
    const res = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json() as { message: string }
    setResultMessage(data.message)
    setStatus('done')
  }

  return (
    <Card className="mt-2 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="pt-3 pb-2">
        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
          {info.emoji} Agent proposes: {info.label}
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-300">{action.previewText}</div>
        {status === 'done' && (
          <div className="text-xs text-green-700 dark:text-green-300 mt-2">✓ {resultMessage}</div>
        )}
      </CardContent>
      {status !== 'done' && (
        <CardFooter className="pb-3 pt-0 gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={status === 'loading'}
            className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
          >
            {status === 'loading' ? 'Executing...' : 'Approve'}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600">
            Dismiss
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
