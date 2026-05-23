// components/sidebar/client-sidebar.tsx
'use client'
import { getAllClients } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { ClientId } from '@/lib/types'

interface ClientSidebarProps {
  selectedClientId: ClientId | 'all'
  onSelectClient: (id: ClientId | 'all') => void
}

const INDUSTRY_EMOJI: Record<string, string> = {
  'E-commerce': '🛍',
  'SaaS': '⚡',
  'Retail': '🏪',
  'Fintech': '💳',
}

const STATUS_HINT: Record<ClientId, { color: string; hint: string }> = {
  'client-a': { color: 'bg-red-400', hint: 'At risk' },
  'client-b': { color: 'bg-green-400', hint: 'Healthy' },
  'client-c': { color: 'bg-yellow-400', hint: 'Conflict' },
  'client-d': { color: 'bg-orange-400', hint: 'Pending commitment' },
}

export function ClientSidebar({ selectedClientId, onSelectClient }: ClientSidebarProps) {
  const clients = getAllClients()

  return (
    <div className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      <div className="px-3 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Clients</p>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <button
          onClick={() => onSelectClient('all')}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            selectedClientId === 'all'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900',
          )}
        >
          🏢 All clients
        </button>

        {clients.map(client => {
          const status = STATUS_HINT[client.id as ClientId]
          const emoji = INDUSTRY_EMOJI[client.industry] ?? '🏢'
          const isSelected = selectedClientId === client.id
          return (
            <button
              key={client.id}
              onClick={() => onSelectClient(client.id as ClientId)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900',
              )}
            >
              <div className="flex items-center justify-between">
                <span>{emoji} {client.name}</span>
                <span
                  className={cn('w-2 h-2 rounded-full shrink-0', status.color)}
                  title={status.hint}
                />
              </div>
              <div className={cn('text-xs mt-0.5', isSelected ? 'opacity-70' : 'text-zinc-400')}>
                {client.industry}
              </div>
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> At risk
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> OK
          </span>
        </div>
      </div>
    </div>
  )
}
