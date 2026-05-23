// components/chat/confidence-chip.tsx
import { cn } from '@/lib/utils'

interface ConfidenceChipProps {
  level: 'high' | 'medium' | 'low'
  reason?: string
}

const CONFIG = {
  high: {
    label: 'Alta',
    dotColor: 'bg-[var(--status-healthy)]',
    textColor: 'text-[var(--status-healthy)]',
  },
  medium: {
    label: 'Media',
    dotColor: 'bg-[var(--status-conflict)]',
    textColor: 'text-[var(--status-conflict)]',
  },
  low: {
    label: 'Baja',
    dotColor: 'bg-[var(--status-risk)]',
    textColor: 'text-[var(--status-risk)]',
  },
}

export function ConfidenceChip({ level, reason }: ConfidenceChipProps) {
  const config = CONFIG[level]
  return (
    <span
      className={cn(
        'border-border flex cursor-default items-center gap-1.5 border px-1.5 py-px font-mono text-[9px] tracking-[0.15em] uppercase',
        config.textColor,
      )}
      title={reason}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', config.dotColor)} />
      {config.label} conf.
    </span>
  )
}
