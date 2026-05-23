'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ClientSidebar } from '@/components/sidebar/client-sidebar'
import { DEMO_USER, getAllClients, getAllDemoUsers, getClientsByUser, getUserById } from '@/lib/data'
import type { ChatThreadSummary, ClientId, UIMessage } from '@/lib/types'

const SUGGESTED_QUERIES = [
  '¿Cómo está Vivamart esta semana?',
  '¿Qué proyectos están en riesgo?',
  '¿Qué quedó pendiente con Cornerstone después de la última reunión?',
  'Prepara un resumen para mi reunión con Clarix mañana',
  '¿Qué le prometimos a Paylane el mes pasado y qué hemos entregado?',
]

export function ChatContainer() {
  const [selectedUserId, setSelectedUserId] = useState(DEMO_USER.id)
  const selectedUser = getUserById(selectedUserId) ?? DEMO_USER
  const demoUsers = getAllDemoUsers()
  const availableClients = useMemo(
    () => getClientsByUser(selectedUser.id, selectedUser.role),
    [selectedUser.id, selectedUser.role],
  )
  const canViewAll = availableClients.length > 0
  const allClients = useMemo(() => getAllClients(), [])
  const visibleClientIds = useMemo(
    () => new Set(availableClients.map((client) => client.id)),
    [availableClients],
  )

  const [selectedClientId, setSelectedClientId] = useState<ClientId | 'all'>(
    canViewAll ? 'all' : (availableClients[0]?.id ?? 'all'),
  )
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [chats, setChats] = useState<ChatThreadSummary[]>([])
  const [shouldCreateChatOnUserChange, setShouldCreateChatOnUserChange] = useState(false)
  const [openMenu, setOpenMenu] = useState<'user' | 'chat' | null>(null)
  const [input, setInput] = useState('')
  const lastLoadedHistoryKeyRef = useRef<string | null>(null)
  const bottomControlsRef = useRef<HTMLDivElement>(null)

  const createAssistantTextMessage = (text: string): UIMessage => ({
    id: crypto.randomUUID(),
    role: 'assistant',
    parts: [{ type: 'text', text }],
  })

  const persistHistory = async (nextMessages: UIMessage[]) => {
    if (!selectedChatId) return

    await fetch('/api/chat/history', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUser.id,
        clientId: effectiveSelectedClientId,
        chatId: selectedChatId,
        messages: nextMessages,
      }),
    })
  }

  const effectiveSelectedClientId =
    canViewAll
      ? selectedClientId === 'all' || availableClients.some((client) => client.id === selectedClientId)
        ? selectedClientId
        : 'all'
      : selectedClientId !== 'all' &&
          availableClients.some((client) => client.id === selectedClientId)
        ? selectedClientId
        : (availableClients[0]?.id ?? 'all')

  const { messages, sendMessage, setMessages, status, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { userId: selectedUser.id, clientId: effectiveSelectedClientId },
    }),
    onFinish: ({ messages: nextMessages }) => {
      void persistHistory(nextMessages)
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        createAssistantTextMessage('No hay información disponible sobre ese cliente.'),
      ])
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'
  const selectedClientLabel =
    effectiveSelectedClientId === 'all'
      ? 'Todos los clientes'
      : availableClients.find((client) => client.id === effectiveSelectedClientId)?.name ??
        effectiveSelectedClientId

  const normalizeForMatch = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const normalizedInput = normalizeForMatch(input)
    const unauthorizedMention = allClients.find((client) => {
      if (visibleClientIds.has(client.id)) return false
      const idMentioned = normalizedInput.includes(normalizeForMatch(client.id))
      const nameMentioned = normalizedInput.includes(normalizeForMatch(client.name))
      return idMentioned || nameMentioned
    })

    if (unauthorizedMention) {
      setInput('')
      setMessages((current) => {
        const nextMessages: UIMessage[] = [
          ...current,
          createAssistantTextMessage(
            `No hay información disponible sobre el cliente "${unauthorizedMention.name}".`,
          ),
        ]
        void persistHistory(nextMessages)
        return nextMessages
      })
      return
    }

    const text = input
    setInput('')
    await sendMessage({ text })
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  const handleUserChange = (nextUserId: string) => {
    stop()
    clearError()
    setMessages([])
    setInput('')
    setChats([])
    setSelectedChatId(null)
    setShouldCreateChatOnUserChange(true)
    setOpenMenu(null)
    lastLoadedHistoryKeyRef.current = null
    setSelectedClientId('all')
    setSelectedUserId(nextUserId)
  }

  const handleClientChange = (nextClientId: ClientId | 'all') => {
    stop()
    clearError()
    setMessages([])
    setInput('')
    setChats([])
    setSelectedChatId(null)
    lastLoadedHistoryKeyRef.current = null
    setSelectedClientId(nextClientId)
  }

  const handleChatChange = (nextChatId: string) => {
    if (!nextChatId || nextChatId === selectedChatId) return
    stop()
    clearError()
    setMessages([])
    setInput('')
    setSelectedChatId(nextChatId)
    setOpenMenu(null)
  }

  const handleNewChat = async () => {
    stop()
    clearError()
    setMessages([])
    setInput('')
    setOpenMenu(null)

    try {
      const response = await fetch('/api/chat/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          clientId: effectiveSelectedClientId,
        }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as {
        chat?: ChatThreadSummary
        chats?: ChatThreadSummary[]
      }

      if (Array.isArray(payload.chats)) setChats(payload.chats)
      if (payload.chat?.id) setSelectedChatId(payload.chat.id)
    } catch {
      setMessages((current) => [
        ...current,
        createAssistantTextMessage('No se pudo crear un nuevo chat.'),
      ])
    }
  }

  const handleDeleteChat = async (chatIdToDelete: string) => {
    if (!chatIdToDelete) return

    stop()
    clearError()
    setInput('')

    try {
      const response = await fetch('/api/chat/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          clientId: effectiveSelectedClientId,
          chatId: chatIdToDelete,
        }),
      })

      if (!response.ok) return

      const payload = (await response.json()) as {
        chats?: ChatThreadSummary[]
        activeChatId?: string
      }

      if (Array.isArray(payload.chats)) setChats(payload.chats)
      if (payload.activeChatId) {
        setMessages([])
        setSelectedChatId(payload.activeChatId)
      }
    } catch {
      setMessages((current) => [...current, createAssistantTextMessage('No se pudo borrar el chat.')])
    }
  }

  useEffect(() => {
    let cancelled = false
    const requestedChatId = selectedChatId ?? 'latest'
    const historyKey = `${selectedUser.id}::${effectiveSelectedClientId}::${requestedChatId}`

    if (lastLoadedHistoryKeyRef.current === historyKey) return
    lastLoadedHistoryKeyRef.current = historyKey

    const loadHistory = async () => {
      try {
        if (shouldCreateChatOnUserChange && !selectedChatId) {
          const createResponse = await fetch('/api/chat/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: selectedUser.id,
              clientId: effectiveSelectedClientId,
            }),
          })

          if (!createResponse.ok) {
            if (!cancelled) setMessages([])
            return
          }

          const createdPayload = (await createResponse.json()) as {
            chat?: ChatThreadSummary
            chats?: ChatThreadSummary[]
          }

          if (cancelled) return

          if (Array.isArray(createdPayload.chats)) setChats(createdPayload.chats)
          setMessages([])
          setShouldCreateChatOnUserChange(false)

          if (createdPayload.chat?.id) {
            lastLoadedHistoryKeyRef.current = `${selectedUser.id}::${effectiveSelectedClientId}::${createdPayload.chat.id}`
            setSelectedChatId(createdPayload.chat.id)
          }
          return
        }

        const response = await fetch(
          `/api/chat/history?userId=${encodeURIComponent(selectedUser.id)}&clientId=${encodeURIComponent(effectiveSelectedClientId)}${
            selectedChatId ? `&chatId=${encodeURIComponent(selectedChatId)}` : ''
          }`,
        )

        if (!response.ok) {
          if (!cancelled) setMessages([])
          return
        }

        const payload = (await response.json()) as {
          chatId?: string
          chats?: ChatThreadSummary[]
          messages?: UIMessage[]
        }

        if (cancelled) return

        if (Array.isArray(payload.chats)) setChats(payload.chats)
        setMessages(Array.isArray(payload.messages) ? payload.messages : [])
        setShouldCreateChatOnUserChange(false)

        if (payload.chatId && payload.chatId !== selectedChatId) {
          lastLoadedHistoryKeyRef.current = `${selectedUser.id}::${effectiveSelectedClientId}::${payload.chatId}`
          setSelectedChatId(payload.chatId)
        }
      } catch {
        if (!cancelled) {
          setMessages([])
          setShouldCreateChatOnUserChange(false)
        }
      }
    }

    void loadHistory()

    return () => {
      cancelled = true
    }
  }, [
    effectiveSelectedClientId,
    selectedChatId,
    selectedUser.id,
    setMessages,
    shouldCreateChatOnUserChange,
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!bottomControlsRef.current?.contains(target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-background isolate flex min-w-0 flex-1 flex-col pl-52">
      <ClientSidebar
        clients={availableClients}
        canViewAll={canViewAll}
        selectedClientId={effectiveSelectedClientId}
        onSelectClient={handleClientChange}
      />
      {/* Header */}
      <div className="border-border/80 bg-background/88 relative z-40 shrink-0 border-b px-8 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
          <div>
            <h1
              className="text-foreground text-[1.75rem] leading-none tracking-tight"
              style={{
                fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                fontWeight: 500,
              }}
            >
              Growth Agent
            </h1>
            <p className="text-muted-foreground/82 mt-1.5 font-mono text-[10px] tracking-[0.2em] uppercase">
              PM Virtual · {selectedUser.name}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              ref={bottomControlsRef}
              className="border-border/75 bg-card/78 relative flex items-center gap-1.5 rounded-xl border p-1 shadow-[0_8px_24px_oklch(0.18_0.01_70_/_0.08)]"
            >
              <div className="relative">
                <button
                  onClick={() => setOpenMenu((current) => (current === 'user' ? null : 'user'))}
                  className="border-border/70 text-foreground hover:border-[var(--accent-gold)]/45 hover:bg-[oklch(1_0_0_/_0.5)] flex h-10 items-center gap-2 rounded-lg border bg-[oklch(1_0_0_/_0.3)] px-3 transition-colors"
                >
                  <span className="text-foreground/80 inline-flex -translate-y-0.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M5.5 18.5a6.5 6.5 0 0 1 13 0" />
                    </svg>
                  </span>
                  <span className="max-w-[140px] truncate font-mono text-[10px] tracking-[0.08em] uppercase">
                    {selectedUser.name}
                  </span>
                </button>

                {openMenu === 'user' && (
                  <div className="border-border/85 bg-popover/95 absolute top-full left-0 z-50 mt-2 w-[260px] rounded-xl border p-1.5 shadow-[0_16px_40px_oklch(0.08_0.01_70_/_0.2)] backdrop-blur-sm">
                    {demoUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserChange(user.id)}
                        className="text-foreground hover:bg-[oklch(1_0_0_/_0.55)] flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left"
                      >
                        <span className="truncate text-sm">{user.name}</span>
                        <span className="text-muted-foreground font-mono text-[9px] uppercase">
                          {user.role === 'founder' ? 'Founder' : 'Lead'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenMenu((current) => (current === 'chat' ? null : 'chat'))}
                  className="border-border/70 text-foreground hover:border-[var(--accent-gold)]/45 hover:bg-[oklch(1_0_0_/_0.5)] flex h-10 items-center gap-2 rounded-lg border bg-[oklch(1_0_0_/_0.3)] px-3 transition-colors"
                >
                  <span className="text-foreground/80 inline-flex -translate-y-0.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 6.5h14v9H9l-4 3z" />
                    </svg>
                  </span>
                  <span className="max-w-[160px] truncate font-mono text-[10px] tracking-[0.08em] uppercase">
                    {chats.find((chat) => chat.id === selectedChatId)?.title ?? 'Cargando...'}
                  </span>
                </button>

                {openMenu === 'chat' && (
                  <div className="border-border/85 bg-popover/95 absolute top-full left-0 z-50 mt-2 w-[300px] rounded-xl border p-1.5 shadow-[0_16px_40px_oklch(0.08_0.01_70_/_0.2)] backdrop-blur-sm">
                    <button
                      onClick={handleNewChat}
                      className="border-border/80 text-foreground hover:border-[var(--accent-gold)]/48 hover:bg-[oklch(1_0_0_/_0.55)] mb-1.5 flex w-full items-center justify-center rounded-lg border bg-[oklch(1_0_0_/_0.35)] px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase"
                    >
                      + Nuevo chat
                    </button>
                    <div className="max-h-64 overflow-y-auto">
                      {chats.length === 0 ? (
                        <p className="text-muted-foreground px-2.5 py-2 text-xs">Cargando...</p>
                      ) : (
                        chats.map((chat) => (
                          <div key={chat.id} className="group flex items-center gap-1">
                            <button
                              onClick={() => handleChatChange(chat.id)}
                              className="text-foreground hover:bg-[oklch(1_0_0_/_0.55)] w-full truncate rounded-lg px-2.5 py-2 text-left text-sm"
                            >
                              {chat.title}
                            </button>
                            <button
                              onClick={() => handleDeleteChat(chat.id)}
                              className="text-muted-foreground hover:text-[var(--status-risk)] hover:bg-[oklch(1_0_0_/_0.55)] h-8 w-8 shrink-0 rounded-md text-xs transition-colors"
                              title="Borrar chat"
                              aria-label={`Borrar chat ${chat.title}`}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-border/60 bg-card/55 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-healthy)] opacity-40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--status-healthy)]" />
              </span>
              <span className="text-muted-foreground/82 font-mono text-[10px] tracking-[0.14em] uppercase">
                {selectedClientLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages or empty state */}
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-8">
          <div className="space-y-3 text-center">
            <p
              className="text-foreground/76 text-[2.35rem] leading-none"
              style={{
                fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              ¿Qué quieres saber?
            </p>
            <p className="text-muted-foreground/82 font-mono text-[10px] tracking-[0.24em] uppercase">
              Consulta clientes · Obtén informes · Detecta riesgos
            </p>
          </div>

          <div className="w-full max-w-2xl space-y-1.5">
            {SUGGESTED_QUERIES.map((q, i) => (
              <button
                key={q}
                onClick={() => handleSuggestedQuery(q)}
                className="border-border/75 text-foreground/88 hover:text-foreground group flex w-full items-center gap-4 rounded-lg border bg-[oklch(1_0_0_/_0.45)] px-4 py-3 text-left text-sm shadow-[0_3px_10px_oklch(0.2_0.01_70_/_0.04)] transition-all duration-150 hover:border-[var(--accent-gold)]/38 hover:bg-[oklch(1_0_0_/_0.78)] hover:shadow-[0_8px_20px_oklch(0.2_0.02_70_/_0.08)]"
              >
                <span className="text-muted-foreground/70 w-5 shrink-0 font-mono text-[10px] tabular-nums group-hover:text-[var(--accent-gold)]/70">
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
