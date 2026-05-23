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

const DEFAULT_CHAT_TITLE = 'Nueva conversación'

type ClientScope = ClientId | 'all'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function getIndexKey(userId: string, clientId: ClientScope): string {
  return `growth-agent:chat-index:${userId}:${clientId}`
}

function getMessagesKey(userId: string, clientId: ClientScope, chatId: string): string {
  return `growth-agent:chat-messages:${userId}:${clientId}:${chatId}`
}

function readJson<T>(key: string, fallback: T): T {
  const storage = getStorage()
  if (!storage) return fallback
  const raw = storage.getItem(key)
  if (!raw) return fallback

  try {
    const parsed = JSON.parse(raw) as T
    return parsed
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(key, JSON.stringify(value))
}

function createChatId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getFirstUserText(messages: UIMessage[]): string | null {
  const firstUserMessage = messages.find((message) => message.role === 'user')
  if (!firstUserMessage) return null

  for (const part of firstUserMessage.parts ?? []) {
    if (part.type === 'text' && typeof part.text === 'string' && part.text.trim().length > 0) {
      return part.text.trim().slice(0, 80)
    }
  }

  return null
}

function listLocalChats(userId: string, clientId: ClientScope): ChatThreadSummary[] {
  const chats = readJson<ChatThreadSummary[]>(getIndexKey(userId, clientId), [])
  return [...chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

function createLocalChat(
  userId: string,
  clientId: ClientScope,
  title?: string,
): { chat: ChatThreadSummary; chats: ChatThreadSummary[] } {
  const chats = listLocalChats(userId, clientId)
  const now = new Date().toISOString()
  const chat: ChatThreadSummary = {
    id: createChatId(),
    title: title?.trim() || DEFAULT_CHAT_TITLE,
    createdAt: now,
    updatedAt: now,
  }

  writeJson(getMessagesKey(userId, clientId, chat.id), [])
  writeJson(getIndexKey(userId, clientId), [chat, ...chats])

  return { chat, chats: [chat, ...chats] }
}

function loadLocalChatHistory(
  userId: string,
  clientId: ClientScope,
  preferredChatId?: string,
): { chatId: string; chats: ChatThreadSummary[]; messages: UIMessage[] } {
  const chats = listLocalChats(userId, clientId)

  if (chats.length === 0) {
    const created = createLocalChat(userId, clientId)
    return { chatId: created.chat.id, chats: created.chats, messages: [] }
  }

  const selectedChat = preferredChatId
    ? chats.find((chat) => chat.id === preferredChatId) ?? chats[0]
    : chats[0]

  const messages = readJson<UIMessage[]>(getMessagesKey(userId, clientId, selectedChat.id), [])
  return { chatId: selectedChat.id, chats, messages }
}

function saveLocalChatHistory(
  userId: string,
  clientId: ClientScope,
  chatId: string,
  messages: UIMessage[],
): ChatThreadSummary[] {
  const chats = listLocalChats(userId, clientId)
  const now = new Date().toISOString()
  const inferredTitle = getFirstUserText(messages)
  const existing = chats.find((chat) => chat.id === chatId)

  const updatedChat: ChatThreadSummary = existing
    ? {
        ...existing,
        updatedAt: now,
        title:
          existing.title === DEFAULT_CHAT_TITLE && inferredTitle ? inferredTitle : existing.title,
      }
    : {
        id: chatId,
        title: inferredTitle ?? DEFAULT_CHAT_TITLE,
        createdAt: now,
        updatedAt: now,
      }

  const remaining = chats.filter((chat) => chat.id !== chatId)
  const nextChats = [updatedChat, ...remaining].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  writeJson(getMessagesKey(userId, clientId, chatId), messages)
  writeJson(getIndexKey(userId, clientId), nextChats)

  return nextChats
}

function deleteLocalChat(
  userId: string,
  clientId: ClientScope,
  chatId: string,
): { chats: ChatThreadSummary[]; activeChatId: string } {
  const storage = getStorage()
  const chats = listLocalChats(userId, clientId)
  const remaining = chats.filter((chat) => chat.id !== chatId)

  storage?.removeItem(getMessagesKey(userId, clientId, chatId))

  if (remaining.length === 0) {
    const created = createLocalChat(userId, clientId)
    return { chats: created.chats, activeChatId: created.chat.id }
  }

  const sorted = [...remaining].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  writeJson(getIndexKey(userId, clientId), sorted)
  return { chats: sorted, activeChatId: sorted[0].id }
}

export function ChatContainer() {
  const [liveToolStates, setLiveToolStates] = useState<Record<string, 'executing' | 'completed' | 'error'>>({})
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
  const [openMenu, setOpenMenu] = useState<'user' | 'chat' | null>(null)
  const [input, setInput] = useState('')
  const lastLoadedHistoryKeyRef = useRef<string | null>(null)
  const bottomControlsRef = useRef<HTMLDivElement>(null)

  const createAssistantTextMessage = (text: string): UIMessage => ({
    id: crypto.randomUUID(),
    role: 'assistant',
    parts: [{ type: 'text', text }],
  })

  const persistHistory = (nextMessages: UIMessage[]) => {
    if (!selectedChatId) return
    const nextChats = saveLocalChatHistory(
      selectedUser.id,
      effectiveSelectedClientId,
      selectedChatId,
      nextMessages,
    )
    setChats(nextChats)
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
    onToolCall: ({ toolCall }) => {
      const name = 'toolName' in toolCall ? toolCall.toolName : undefined
      if (!name || name === 'finalize_response') return
      setLiveToolStates((current) => ({ ...current, [name]: 'executing' }))
    },
    onFinish: ({ messages: nextMessages }) => {
      persistHistory(nextMessages)
      setLiveToolStates({})
    },
    onError: () => {
      setLiveToolStates({})
      setMessages((current) => [
        ...current,
        createAssistantTextMessage('No hay información disponible sobre ese cliente.'),
      ])
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'
  const liveTools = Object.entries(liveToolStates).map(([toolName, state]) => ({ toolName, state }))
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
        persistHistory(nextMessages)
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
    setLiveToolStates({})
    setMessages([])
    setInput('')
    setChats([])
    setSelectedChatId(null)
    setOpenMenu(null)
    lastLoadedHistoryKeyRef.current = null
    setSelectedClientId('all')
    setSelectedUserId(nextUserId)
  }

  const handleClientChange = (nextClientId: ClientId | 'all') => {
    stop()
    clearError()
    setLiveToolStates({})
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
    setLiveToolStates({})
    setMessages([])
    setInput('')
    setSelectedChatId(nextChatId)
    setOpenMenu(null)
  }

  const handleNewChat = () => {
    stop()
    clearError()
    setLiveToolStates({})
    setMessages([])
    setInput('')
    setOpenMenu(null)
    const created = createLocalChat(selectedUser.id, effectiveSelectedClientId)
    setChats(created.chats)
    setSelectedChatId(created.chat.id)
  }

  const handleDeleteChat = (chatIdToDelete: string) => {
    if (!chatIdToDelete) return

    stop()
    clearError()
    setLiveToolStates({})
    setInput('')

    const payload = deleteLocalChat(selectedUser.id, effectiveSelectedClientId, chatIdToDelete)
    setChats(payload.chats)
    setMessages([])
    setSelectedChatId(payload.activeChatId)
  }

  useEffect(() => {
    let cancelled = false
    const requestedChatId = selectedChatId ?? 'latest'
    const historyKey = `${selectedUser.id}::${effectiveSelectedClientId}::${requestedChatId}`

    if (lastLoadedHistoryKeyRef.current === historyKey) return
    lastLoadedHistoryKeyRef.current = historyKey

    const payload = loadLocalChatHistory(
      selectedUser.id,
      effectiveSelectedClientId,
      selectedChatId ?? undefined,
    )

    queueMicrotask(() => {
      if (cancelled) return

      if (Array.isArray(payload.chats)) setChats(payload.chats)
      setMessages(Array.isArray(payload.messages) ? payload.messages : [])

      if (payload.chatId && payload.chatId !== selectedChatId) {
        lastLoadedHistoryKeyRef.current = `${selectedUser.id}::${effectiveSelectedClientId}::${payload.chatId}`
        setSelectedChatId(payload.chatId)
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    effectiveSelectedClientId,
    selectedChatId,
    selectedUser.id,
    setMessages,
  ])

  useEffect(() => {
    if (!isLoading) {
      queueMicrotask(() => {
        setLiveToolStates((current) => (Object.keys(current).length > 0 ? {} : current))
      })
      return
    }

    const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
    if (!lastAssistant?.parts?.length) return

    const toolParts = lastAssistant.parts.filter((part) => part.type === 'dynamic-tool') as Array<{
      type: 'dynamic-tool'
      toolName: string
      state?: string
    }>
    if (toolParts.length === 0) return

    queueMicrotask(() => {
      setLiveToolStates((current) => {
        const next = { ...current }
        let changed = false

        for (const part of toolParts) {
          if (!part.toolName || part.toolName === 'finalize_response') continue

          const nextState =
            part.state === 'output-error'
              ? 'error'
              : part.state === 'output-available'
                ? 'completed'
                : 'executing'

          if (next[part.toolName] !== nextState) {
            next[part.toolName] = nextState
            changed = true
          }
        }

        return changed ? next : current
      })
    })
  }, [isLoading, messages])

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
        <MessageList messages={messages} isLoading={isLoading} liveTools={liveTools} />
      )}

      <ChatInput input={input} isLoading={isLoading} onChange={setInput} onSubmit={handleSubmit} />
    </div>
  )
}
