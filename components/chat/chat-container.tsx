'use client'
import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ClientSidebar } from '@/components/sidebar/client-sidebar'
import { DEMO_USER } from '@/lib/data'
import type { ClientId } from '@/lib/types'

const SUGGESTED_QUERIES = [
  '¿Cómo está Vivamart esta semana?',
  '¿Qué proyectos están en riesgo?',
  '¿Qué quedó pendiente con Cornerstone después de la última reunión?',
  'Prepara un resumen para mi reunión con Clarix mañana',
  '¿Qué le prometimos a Paylane el mes pasado y qué hemos entregado?',
]

export function ChatContainer() {
  const [selectedClientId, setSelectedClientId] = useState<ClientId | 'all'>('all')
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { userId: DEMO_USER.id, clientId: selectedClientId },
    }),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return
    const text = input
    setInput('')
    await sendMessage({ text })
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <div className="bg-background flex min-w-0 flex-1 flex-col pl-52">
      <ClientSidebar selectedClientId={selectedClientId} onSelectClient={setSelectedClientId} />
      {/* Header */}
      <div className="border-border bg-background shrink-0 border-b px-8 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1
              className="text-foreground text-[1.625rem] leading-none tracking-tight"
              style={{
                fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                fontWeight: 500,
              }}
            >
              Agente de Crecimiento
            </h1>
            <p className="text-muted-foreground mt-1.5 font-mono text-[10px] tracking-[0.18em] uppercase">
              PM Virtual · {DEMO_USER.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-healthy)] opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--status-healthy)]" />
            </span>
            <span className="text-muted-foreground font-mono text-[10px] tracking-[0.15em] uppercase">
              {selectedClientId === 'all' ? 'Todos los clientes' : selectedClientId}
            </span>
          </div>
        </div>
      </div>

      {/* Messages or empty state */}
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-8">
          <div className="space-y-3 text-center">
            <p
              className="text-foreground/20 text-[2rem] leading-none"
              style={{
                fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              ¿Qué quieres saber?
            </p>
            <p className="text-muted-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
              Consulta clientes · Obtén informes · Detecta riesgos
            </p>
          </div>

          <div className="w-full max-w-2xl space-y-px">
            {SUGGESTED_QUERIES.map((q, i) => (
              <button
                key={q}
                onClick={() => handleSuggestedQuery(q)}
                className="border-border text-muted-foreground hover:text-foreground group flex w-full items-center gap-4 border px-4 py-2.5 text-left text-sm transition-all duration-150 hover:border-[var(--accent-gold)]/35 hover:bg-[oklch(1_0_0_/_2%)]"
              >
                <span className="text-muted-foreground/30 w-5 shrink-0 font-mono text-[10px] tabular-nums group-hover:text-[var(--accent-gold)]/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-snug">{q}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <MessageList messages={messages} isLoading={isLoading} />
      )}

      <ChatInput input={input} isLoading={isLoading} onChange={setInput} onSubmit={handleSubmit} />
    </div>
  )
}
