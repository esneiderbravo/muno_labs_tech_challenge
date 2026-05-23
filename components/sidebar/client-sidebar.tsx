// components/sidebar/client-sidebar.tsx
'use client'
import { getAllClients } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { ClientId } from '@/lib/types'

interface ClientSidebarProps {
  selectedClientId: ClientId | 'all'
  onSelectClient: (id: ClientId | 'all') => void
}

const STATUS_CONFIG: Partial<
  Record<
  ClientId,
  { borderColor: string; dotColor: string; label: string; pulse?: boolean }
  >
> = {
  vivamart: {
    borderColor: 'border-l-[var(--status-risk)]',
    dotColor: 'bg-[var(--status-risk)]',
    label: 'En riesgo',
    pulse: true,
  },
  clarix: {
    borderColor: 'border-l-[var(--status-healthy)]',
    dotColor: 'bg-[var(--status-healthy)]',
    label: 'Saludable',
  },
  cornerstone: {
    borderColor: 'border-l-[var(--status-conflict)]',
    dotColor: 'bg-[var(--status-conflict)]',
    label: 'Conflicto',
  },
  paylane: {
    borderColor: 'border-l-[var(--status-pending)]',
    dotColor: 'bg-[var(--status-pending)]',
    label: 'Pendiente',
  },
  bloom: {
    borderColor: 'border-l-[var(--status-risk)]',
    dotColor: 'bg-[var(--status-risk)]',
    label: 'En riesgo',
    pulse: true,
  },
  draftly: {
    borderColor: 'border-l-[var(--status-healthy)]',
    dotColor: 'bg-[var(--status-healthy)]',
    label: 'Saludable',
  },
  metrify: {
    borderColor: 'border-l-[var(--status-pending)]',
    dotColor: 'bg-[var(--status-pending)]',
    label: 'Pendiente',
  },
  nexova: {
    borderColor: 'border-l-[var(--status-risk)]',
    dotColor: 'bg-[var(--status-risk)]',
    label: 'En riesgo',
    pulse: true,
  },
  solara: {
    borderColor: 'border-l-[var(--status-healthy)]',
    dotColor: 'bg-[var(--status-healthy)]',
    label: 'Saludable',
  },
  trackflow: {
    borderColor: 'border-l-[var(--status-pending)]',
    dotColor: 'bg-[var(--status-pending)]',
    label: 'Pendiente',
  },
}

const STATUS_LEGEND = [
  { dotColor: 'bg-[var(--status-risk)]', label: 'En riesgo' },
  { dotColor: 'bg-[var(--status-healthy)]', label: 'Saludable' },
  { dotColor: 'bg-[var(--status-conflict)]', label: 'Conflicto' },
  { dotColor: 'bg-[var(--status-pending)]', label: 'Pendiente' },
]

export function ClientSidebar({ selectedClientId, onSelectClient }: ClientSidebarProps) {
  const clients = getAllClients()

  return (
    <div className="border-border bg-sidebar fixed top-0 bottom-0 left-0 z-20 flex w-52 flex-col border-r">
      {/* Header */}
      <div className="border-border border-b px-4 py-5">
        <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
          Clientes
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <button
          onClick={() => onSelectClient('all')}
          className={cn(
            'w-full border-l-2 py-2.5 pr-3 pl-4 text-left text-sm transition-colors duration-150',
            selectedClientId === 'all'
              ? 'text-foreground border-l-[var(--accent-gold)] bg-[oklch(1_0_0_/_4%)]'
              : 'text-muted-foreground hover:text-foreground border-l-transparent hover:bg-[oklch(1_0_0_/_2%)]',
          )}
        >
          <span className={cn('font-medium', selectedClientId === 'all' ? '' : '')}>
            Todos los clientes
          </span>
        </button>

        <div className="border-border mx-4 my-2 border-t" />

        {clients.map((client) => {
          const status = STATUS_CONFIG[client.id]
          const isSelected = selectedClientId === client.id
          return (
            <button
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={cn(
                'group w-full border-l-2 py-2.5 pr-3 pl-4 text-left text-sm transition-colors duration-150',
                isSelected
                  ? cn(
                      'text-foreground bg-[oklch(1_0_0_/_4%)]',
                      status?.borderColor ?? 'border-l-[var(--accent-gold)]',
                    )
                  : 'text-muted-foreground hover:text-foreground border-l-transparent hover:bg-[oklch(1_0_0_/_2%)]',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">{client.name}</span>
                {status && (
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-sm transition-opacity',
                      status.dotColor,
                      !isSelected && 'opacity-50 group-hover:opacity-80',
                      status.pulse && 'animate-status-pulse',
                    )}
                    title={status.label}
                  />
                )}
              </div>
              <div className="text-muted-foreground/85 mt-0.5 truncate font-mono text-[10px]">
                {client.industry}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Status legend */}
      <div className="border-border border-t px-4 py-3">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {STATUS_LEGEND.map(({ dotColor, label }) => (
            <span
              key={label}
              className="text-muted-foreground/80 flex items-center gap-1.5 font-mono text-[9px] tracking-wider uppercase"
            >
              <span className={cn('h-1.5 w-1.5 shrink-0 rounded-sm', dotColor)} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
