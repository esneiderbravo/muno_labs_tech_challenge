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
  'How is Client A doing this week?',
  'Which projects are at risk?',
  'What was left pending with Client C after the last meeting?',
  'Prepare a brief for my meeting with Client B tomorrow',
  'What did we promise Client D last month and what have we delivered?',
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
    <div className="flex h-full">
      <ClientSidebar
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-sm">Growth Agent</h1>
              <p className="text-xs text-zinc-500">Virtual PM · {DEMO_USER.name}</p>
            </div>
            <div className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full">
              {selectedClientId === 'all' ? 'All clients' : selectedClientId}
            </div>
          </div>
        </div>

        {/* Messages or empty state */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
            <p className="text-zinc-500 text-sm">Try one of these:</p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
              {SUGGESTED_QUERIES.map(q => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuery(q)}
                  className="text-left text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}

        <ChatInput
          input={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
