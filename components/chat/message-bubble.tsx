// components/chat/message-bubble.tsx
import ReactMarkdown from 'react-markdown'
import type { UIMessage } from 'ai'
import { SourceBadge } from './source-badge'
import { ConfidenceChip } from './confidence-chip'
import { ConflictAlert } from './conflict-alert'
import { WriteBackCard } from './write-back-card'
import type { FinalizeResponseArgs } from '@/lib/types'

interface MessageBubbleProps {
  message: UIMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // Extract tool names used (excluding finalize_response)
  const toolsUsed = (message.parts ?? [])
    .filter(p => p.type === 'dynamic-tool' && (p as { toolName: string }).toolName !== 'finalize_response')
    .map(p => (p as { toolName: string }).toolName)

  // Extract finalize_response output for structured metadata
  const finalizePart = (message.parts ?? []).find(
    p =>
      p.type === 'dynamic-tool' &&
      (p as { toolName: string }).toolName === 'finalize_response' &&
      (p as { state: string }).state === 'output-available',
  )
  const metadata = finalizePart
    ? (finalizePart as unknown as { output: FinalizeResponseArgs }).output
    : undefined

  // Extract text content from text parts
  const textContent = (message.parts ?? [])
    .filter(p => p.type === 'text')
    .map(p => (p as { text: string }).text)
    .join('')

  const displayText = textContent

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm text-white dark:text-zinc-900">
          {displayText}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-2">
        {/* Source badges */}
        {(toolsUsed.length > 0 || metadata) && (
          <div className="flex flex-wrap gap-1">
            {[...new Set(toolsUsed)].map(toolName => (
              <SourceBadge key={toolName} toolName={toolName} />
            ))}
            {metadata && (
              <ConfidenceChip level={metadata.confidence} reason={metadata.confidence_reason} />
            )}
          </div>
        )}

        {/* Main text */}
        {displayText && (
          <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
            <ReactMarkdown>{displayText}</ReactMarkdown>
          </div>
        )}

        {/* Conflicts */}
        {metadata?.conflicts && metadata.conflicts.length > 0 && (
          <ConflictAlert conflicts={metadata.conflicts} />
        )}

        {/* Write-back proposals */}
        {metadata?.proposed_actions?.map((action, i) => (
          <WriteBackCard key={i} action={action} />
        ))}
      </div>
    </div>
  )
}
