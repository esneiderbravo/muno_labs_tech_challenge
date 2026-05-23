'use client'
import { type KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  input: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function ChatInput({ input, isLoading, onChange, onSubmit }: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="border-border bg-background shrink-0 border-t px-6 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="border-border flex items-end gap-0 border bg-[oklch(1_0_0_/_2.5%)] transition-colors duration-200 focus-within:border-[var(--accent-gold)]/40">
          <Textarea
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre un cliente, estado de proyectos, riesgos o solicita un informe..."
            className="placeholder:text-muted-foreground/70 max-h-[180px] min-h-[40px] resize-none rounded-none border-0 bg-transparent px-4 py-2.5 text-sm shadow-none focus-visible:ring-0"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !input.trim()}
            className="h-[40px] shrink-0 bg-[var(--accent-gold)] px-5 font-mono text-[10px] tracking-[0.2em] text-[oklch(0.09_0.008_65)] uppercase transition-all duration-150 hover:bg-[oklch(0.73_0.095_65)] active:bg-[oklch(0.67_0.095_65)] disabled:cursor-not-allowed disabled:opacity-25"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-0.5">
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:130ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:260ms]" />
              </span>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
        <p className="text-muted-foreground/70 mt-2 text-center font-mono text-[9px] tracking-[0.2em] uppercase">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  )
}
