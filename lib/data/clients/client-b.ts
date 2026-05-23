// lib/data/clients/clarix.ts
import type {
  Client,
  LinearTask,
  SlackMessage,
  MeetingTranscript,
  CalendarEvent,
  NotionDoc,
  DriveFile,
  GithubActivity,
  ObsidianNote,
  PosthogMetrics,
  WhatsappMessage,
} from '@/lib/types'

export const client: Client = {
  id: 'clarix',
  name: 'Clarix',
  industry: 'SaaS',
  assignedTo: ['account-lead-2', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'CX-201',
    title: 'Flujo de onboarding v2',
    status: 'done',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-20',
    updatedAt: '2026-05-20T17:00:00Z',
  },
  {
    id: 'CX-202',
    title: 'Configuración de campaña de email secuencial',
    status: 'done',
    assignee: 'lucia@agency.com',
    dueDate: '2026-05-19',
    updatedAt: '2026-05-19T16:00:00Z',
  },
  {
    id: 'CX-203',
    title: 'Test A/B de landing page',
    status: 'in_progress',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-28',
    updatedAt: '2026-05-22T10:00:00Z',
  },
  {
    id: 'CX-204',
    title: 'Auditoría SEO',
    status: 'todo',
    assignee: 'lucia@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-21T09:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#clarix',
    author: 'pedro@agency.com',
    text: '¡Onboarding v2 lanzado! Al cliente le encantó.',
    timestamp: '2026-05-20T18:00:00Z',
  },
  {
    channel: '#clarix',
    author: 'ceo@clarix.io',
    text: '¡Excelente trabajo equipo! Los números ya se ven mejor.',
    timestamp: '2026-05-21T09:00:00Z',
  },
  {
    channel: '#clarix',
    author: 'lucia@agency.com',
    text: 'El test A/B está activo, compartiré resultados al final de la semana.',
    timestamp: '2026-05-22T10:30:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-21T11:00:00Z',
    attendees: ['account-lead-2', 'clarix-ceo', 'pedro@agency.com'],
    summary:
      'Sincronización positiva. El onboarding v2 superó las expectativas — tasa de activación subió un 18%. La campaña de email funciona bien. Test A/B en marcha. El cliente preguntó por SEO.',
    decisions: [
      'Priorizar la auditoría SEO para el próximo sprint',
      'Compartir resultados del A/B el 30 de mayo',
    ],
    commitments: [
      {
        owner: 'agencia',
        item: 'Auditoría SEO completa para el 30 de mayo',
        dueDate: '2026-05-30',
      },
      { owner: 'agencia', item: 'Informe de resultados del test A/B', dueDate: '2026-05-30' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Clarix — Sincronización Semanal de Crecimiento',
    date: '2026-05-28T11:00:00Z',
    attendees: ['account-lead-2', 'clarix-ceo'],
    isUpcoming: true,
  },
  {
    title: 'Clarix — Revisión de Onboarding',
    date: '2026-05-21T11:00:00Z',
    attendees: ['account-lead-2', 'clarix-ceo', 'pedro@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Clarix — Playbook de Crecimiento',
    content:
      'Áreas de enfoque: onboarding, activación, SEO, adquisición pagada. Meta Q2: aumentar tasa de activación un 25%.',
    lastEditedAt: '2026-05-10T10:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Clarix_Resultados_OnboardingV2.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-21T12:00:00Z',
    url: 'https://drive.google.com/mock/clarix-results',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 1,
  mergedThisWeek: 4,
  openIssues: 2,
  lastCommitAt: '2026-05-22T14:00:00Z',
  recentPRs: [{ title: 'feat: variante B test A/B', state: 'open', author: 'pedro@agency.com' }],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Clarix — Notas del Fundador',
    content:
      'Mejor cliente del mes. CEO muy contento. Oportunidad de upsell en gestión de adquisición pagada.',
    updatedAt: '2026-05-21T22:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 890,
  dauChange: '+18%',
  conversionRate: '4.7%',
  conversionChange: '+0.8%',
  topEvent: 'onboarding_complete',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO de Clarix',
    text: 'Pregunta rápida — ¿cuándo podemos ver los resultados del A/B?',
    timestamp: '2026-05-22T16:00:00Z',
    hasAttachment: false,
  },
]
