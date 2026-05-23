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

  const toolsUsed = (message.parts ?? [])
    .filter(
      (p) =>
        p.type === 'dynamic-tool' && (p as { toolName: string }).toolName !== 'finalize_response',
    )
    .map((p) => (p as { toolName: string }).toolName)

  const finalizePart = (message.parts ?? []).find(
    (p) =>
      p.type === 'dynamic-tool' &&
      (p as { toolName: string }).toolName === 'finalize_response' &&
      (p as { state: string }).state === 'output-available',
  )
  const metadata = finalizePart
    ? (finalizePart as unknown as { output: FinalizeResponseArgs }).output
    : undefined

  const textContent = (message.parts ?? [])
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
    .join('')

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="text-foreground/90 max-w-[72%] border border-[var(--accent-gold)]/18 bg-[oklch(1_0_0_/_4%)] px-4 py-2.5 text-sm leading-relaxed">
          {textContent}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="animate-fade-in-up max-w-[88%] space-y-2.5">
        {/* Source + confidence row */}
        {(toolsUsed.length > 0 || metadata) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {[...new Set(toolsUsed)].map((toolName) => (
              <SourceBadge key={toolName} toolName={toolName} />
            ))}
            {metadata && (
              <ConfidenceChip level={metadata.confidence} reason={metadata.confidence_reason} />
            )}
          </div>
        )}

        {/* Main response text */}
        {textContent && (
          <div className="text-foreground/90 [&_strong]:text-foreground [&_li]:text-foreground/85 [&_li::before]:text-muted-foreground/40 [&_blockquote]:text-muted-foreground [&_hr]:border-border text-sm leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--accent-gold)]/25 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-[oklch(1_0_0_/_4%)] [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.8em] [&_code]:text-[var(--accent-gold)] [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h1:first-child]:mt-0 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-medium [&_h3:first-child]:mt-0 [&_hr]:my-4 [&_li]:flex [&_li]:gap-2 [&_li::before]:shrink-0 [&_li::before]:content-['—'] [&_ol]:mb-3 [&_ol]:space-y-1 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:mb-3 [&_ul]:space-y-1 [&_ul]:pl-0 [&_ul>li]:pl-0">
            <ReactMarkdown>{textContent}</ReactMarkdown>
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
