// components/chat/conflict-alert.tsx
import type { Conflict } from '@/lib/types'

interface ConflictAlertProps {
  conflicts: Conflict[]
}

export function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null
  return (
    <div className="mt-1 space-y-2">
      {conflicts.map((conflict, i) => (
        <div
          key={i}
          className="border border-[var(--status-conflict)]/25 bg-[var(--status-conflict)]/[0.04]"
        >
          {/* Header bar */}
          <div className="flex items-center gap-2.5 border-b border-[var(--status-conflict)]/15 px-4 py-2.5">
            <div className="h-3.5 w-0.5 shrink-0 bg-[var(--status-conflict)]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--status-conflict)] uppercase">
              Conflicto detectado
            </span>
          </div>

          {/* Entries */}
          <div className="space-y-1.5 px-4 py-3">
            {conflict.entries.map((entry, j) => (
              <div key={j} className="flex gap-3 text-xs">
                <span className="text-muted-foreground/45 shrink-0 pt-px font-mono text-[9px] tabular-nums">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-foreground/75">
                  <span className="text-foreground/85 font-medium">{entry.source}</span>
                  <span className="text-muted-foreground/50 mx-1.5">—</span>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>

          {/* Resolution */}
          <div className="flex flex-col gap-1 border-t border-[var(--status-conflict)]/15 px-4 py-2.5">
            <div className="flex items-baseline gap-2 text-xs">
              <span className="text-muted-foreground/40 shrink-0 font-mono text-[9px] tracking-wider uppercase">
                Más reciente
              </span>
              <span className="text-foreground/80">
                {conflict.mostRecentSource}: {conflict.mostRecentValue}
              </span>
            </div>
            {conflict.recommendation && (
              <p className="text-muted-foreground/55 text-xs italic">{conflict.recommendation}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
