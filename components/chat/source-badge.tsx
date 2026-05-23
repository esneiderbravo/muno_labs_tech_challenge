// components/chat/source-badge.tsx
import { Badge } from '@/components/ui/badge'

const TOOL_LABELS: Record<string, { label: string; emoji: string }> = {
  get_notion_docs: { label: 'Notion', emoji: '📄' },
  get_linear_tasks: { label: 'Linear', emoji: '📋' },
  get_slack_messages: { label: 'Slack', emoji: '💬' },
  get_meeting_transcripts: { label: 'Transcript', emoji: '🎙' },
  get_calendar_events: { label: 'Calendar', emoji: '📅' },
  get_drive_files: { label: 'Drive', emoji: '📁' },
  get_github_activity: { label: 'GitHub', emoji: '⚙️' },
  get_obsidian_notes: { label: 'Obsidian', emoji: '🔒' },
  get_posthog_metrics: { label: 'PostHog', emoji: '📊' },
  get_whatsapp_messages: { label: 'WhatsApp', emoji: '📱' },
}

interface SourceBadgeProps {
  toolName: string
}

export function SourceBadge({ toolName }: SourceBadgeProps) {
  const info = TOOL_LABELS[toolName]
  if (!info) return null
  return (
    <Badge variant="secondary" className="text-xs gap-1 font-normal">
      <span>{info.emoji}</span>
      <span>{info.label}</span>
    </Badge>
  )
}
