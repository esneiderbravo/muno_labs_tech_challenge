// components/chat/source-badge.tsx

const TOOL_LABELS: Record<string, { label: string; abbr: string }> = {
  get_notion_docs: { label: 'Notion', abbr: 'NOT' },
  get_linear_tasks: { label: 'Linear', abbr: 'LIN' },
  get_slack_messages: { label: 'Slack', abbr: 'SLK' },
  get_meeting_transcripts: { label: 'Transcript', abbr: 'TRX' },
  get_calendar_events: { label: 'Calendar', abbr: 'CAL' },
  get_drive_files: { label: 'Drive', abbr: 'DRV' },
  get_github_activity: { label: 'GitHub', abbr: 'GHB' },
  get_obsidian_notes: { label: 'Obsidian', abbr: 'OBS' },
  get_posthog_metrics: { label: 'PostHog', abbr: 'PHG' },
  get_whatsapp_messages: { label: 'WhatsApp', abbr: 'WAP' },
}

interface SourceBadgeProps {
  toolName: string
}

export function SourceBadge({ toolName }: SourceBadgeProps) {
  const info = TOOL_LABELS[toolName]
  if (!info) return null
  return (
    <span
      className="border-border text-muted-foreground/60 hover:text-muted-foreground cursor-default border px-1.5 py-px font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-150 hover:border-[var(--accent-gold)]/35"
      title={info.label}
    >
      {info.abbr}
    </span>
  )
}
