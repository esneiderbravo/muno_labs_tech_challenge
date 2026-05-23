'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProposedAction } from '@/lib/types'

const TYPE_LABELS: Record<string, { label: string; abbr: string }> = {
  linear_task: { label: 'Crear tarea en Linear', abbr: 'LINEAR' },
  slack_draft: { label: 'Enviar mensaje por Slack', abbr: 'SLACK' },
  notion_update: { label: 'Actualizar documento en Notion', abbr: 'NOTION' },
}

interface WriteBackCardProps {
  action: ProposedAction
}

export function WriteBackCard({ action }: WriteBackCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [resultMessage, setResultMessage] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const info = TYPE_LABELS[action.type]

  const handleApprove = async () => {
    setStatus('loading')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new Error('No se pudo ejecutar la acción.')
      }

      const data = (await res.json()) as { message: string }
      setResultMessage(data.message)
      setStatus('done')
    } catch {
      setResultMessage('No se pudo ejecutar la acción. Intenta nuevamente.')
      setStatus('error')
    } finally {
      clearTimeout(timeoutId)
    }
  }

  if (dismissed) return null

  return (
    <div className="mt-1 border border-[var(--status-pending)]/22 bg-[var(--status-pending)]/[0.04]">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[var(--status-pending)]/15 px-4 py-2.5">
        <div className="h-3.5 w-0.5 shrink-0 bg-[var(--status-pending)]" />
        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--status-pending)] uppercase">
          {info?.abbr ?? action.type} — El agente propone una acción
        </span>
      </div>

      {/* Preview */}
      <div className="px-4 py-3">
        <p className="text-foreground/80 text-sm leading-relaxed">{action.previewText}</p>
        {status === 'done' && (
          <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-[var(--status-healthy)] uppercase">
            ✓ {resultMessage}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-[var(--status-risk)] uppercase">
            ⚠ {resultMessage}
          </p>
        )}
      </div>

      {/* Actions */}
      {status !== 'done' && (
        <div className="flex items-center gap-3 border-t border-[var(--status-pending)]/15 px-4 py-2.5">
          <button
            onClick={handleApprove}
            disabled={status === 'loading'}
            className={cn(
              'px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-150',
              'bg-[var(--status-pending)] text-[oklch(0.09_0.008_65)]',
              'hover:bg-[oklch(0.65_0.10_250)] active:bg-[oklch(0.58_0.10_250)]',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            {status === 'loading' ? 'Ejecutando...' : status === 'error' ? 'Reintentar' : 'Aprobar'}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            disabled={status === 'loading'}
            className="text-muted-foreground/50 hover:text-muted-foreground px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Descartar
          </button>
        </div>
      )}
    </div>
  )
}
