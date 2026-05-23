// components/chat/confidence-chip.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ConfidenceChipProps {
  level: 'high' | 'medium' | 'low'
  reason?: string
}

const CONFIG = {
  high: { label: 'High confidence', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  medium: { label: 'Medium confidence', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  low: { label: 'Low confidence', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' },
}

export function ConfidenceChip({ level, reason }: ConfidenceChipProps) {
  const config = CONFIG[level]
  return (
    <Badge className={cn('text-xs font-normal border-0', config.className)} title={reason}>
      {config.label}
    </Badge>
  )
}
