// components/chat/message-list.tsx
'use client'
import { useEffect, useRef } from 'react'
import { MessageBubble } from './message-bubble'
import { TOOL_LABELS } from './source-badge'
import type { UIMessage } from 'ai'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
  liveTools?: Array<{ toolName: string; state: string }>
}

type DynamicToolPart = {
  type: 'dynamic-tool'
  toolName: string
  state?: string
}

function getLiveToolStates(messages: UIMessage[]): Array<{ toolName: string; state: string }> {
  const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
  if (!lastAssistant?.parts?.length) return []

  const parts = lastAssistant.parts.filter((part) => part.type === 'dynamic-tool') as DynamicToolPart[]
  if (parts.length === 0) return []

  const byTool = new Map<string, string>()
  for (const part of parts) {
    if (!part.toolName || part.toolName === 'finalize_response') continue
    byTool.set(part.toolName, part.state ?? 'input-available')
  }

  return [...byTool.entries()].map(([toolName, state]) => ({ toolName, state }))
}

function getToolExecutionLabel(state: string): string {
  if (state === 'output-available') return 'Completada'
  if (state === 'output-error') return 'Error'
  return 'Ejecutando'
}

export function MessageList({ messages, isLoading, liveTools: liveToolsFromChat = [] }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const liveToolsFromMessages = getLiveToolStates(messages)
  const mergedLiveTools = (() => {
    const merged = new Map<string, string>()
    for (const item of liveToolsFromMessages) merged.set(item.toolName, item.state)
    for (const item of liveToolsFromChat) merged.set(item.toolName, item.state)
    return [...merged.entries()].map(([toolName, state]) => ({ toolName, state }))
  })()

  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    shouldAutoScrollRef.current = distanceToBottom < 80
  }

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="text-muted-foreground/70 flex flex-1 items-center justify-center font-mono text-[10px] tracking-[0.2em] uppercase">
        Pregunta cualquier cosa sobre tus clientes
      </div>
    )
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto px-6">
      <div className="mx-auto max-w-3xl space-y-6 py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="space-y-2 px-1 py-2">
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--accent-gold)] opacity-60 [animation-delay:0ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--accent-gold)] opacity-60 [animation-delay:130ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--accent-gold)] opacity-60 [animation-delay:260ms]" />
                <span className="text-muted-foreground/70 ml-1 font-mono text-[9px] tracking-[0.2em] uppercase">
                  Analizando
                </span>
              </div>

              {mergedLiveTools.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {mergedLiveTools.map(({ toolName, state }) => {
                    const info = TOOL_LABELS[toolName]
                    if (!info) return null

                    return (
                      <span
                        key={`${toolName}:${state}`}
                        className="border-border text-muted-foreground/65 inline-flex items-center gap-1.5 border px-1.5 py-px font-mono text-[9px] tracking-[0.12em] uppercase"
                        title={info.label}
                      >
                        <span>{info.label}</span>
                        <span className="text-muted-foreground/45">•</span>
                        <span>{getToolExecutionLabel(state)}</span>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
