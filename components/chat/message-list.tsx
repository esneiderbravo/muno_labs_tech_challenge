// components/chat/message-list.tsx
'use client'
import { useEffect, useRef } from 'react'
import { MessageBubble } from './message-bubble'
import type { UIMessage } from 'ai'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)

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
            <div className="flex items-center gap-2 px-1 py-2">
              <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--accent-gold)] opacity-60 [animation-delay:0ms]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--accent-gold)] opacity-60 [animation-delay:130ms]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--accent-gold)] opacity-60 [animation-delay:260ms]" />
              <span className="text-muted-foreground/70 ml-1 font-mono text-[9px] tracking-[0.2em] uppercase">
                Analizando
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
