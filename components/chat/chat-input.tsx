'use client'
import { useRef, type KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="max-w-3xl mx-auto flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a client, project status, risks, or request a brief..."
          className="min-h-[44px] max-h-[200px] resize-none text-sm"
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !input.trim()}
          className="h-[44px] px-4 shrink-0"
        >
          {isLoading ? '...' : 'Send'}
        </Button>
      </div>
      <div className="max-w-3xl mx-auto mt-2 text-xs text-zinc-400 text-center">
        Enter to send · Shift+Enter for new line
      </div>
    </div>
  )
}
