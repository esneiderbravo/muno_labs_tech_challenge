// components/chat/conflict-alert.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Conflict } from '@/lib/types'

interface ConflictAlertProps {
  conflicts: Conflict[]
}

export function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null
  return (
    <div className="space-y-2 mt-3">
      {conflicts.map((conflict, i) => (
        <Alert key={i} className="border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
          <AlertTitle className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            ⚠️ Conflict detected
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300 text-xs mt-1 space-y-1">
            {conflict.entries.map((entry, j) => (
              <div key={j}>
                <span className="font-medium">{entry.source}</span>
                {' · '}
                <span className="opacity-70">{new Date(entry.date).toLocaleDateString()}</span>
                {': '}
                <span>{entry.value}</span>
              </div>
            ))}
            <div className="mt-2 font-medium">
              Most recent: {conflict.mostRecentSource} → {conflict.mostRecentValue}
            </div>
            <div className="opacity-80">{conflict.recommendation}</div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
