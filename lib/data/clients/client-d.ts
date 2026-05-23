// lib/data/clients/paylane.ts
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
  id: 'paylane',
  name: 'Paylane',
  industry: 'Fintech de pagos B2B con foco en APIs y compliance',
  assignedTo: ['account-lead-2', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'PL-401',
    title: 'Sistema de autenticación (OAuth2)',
    status: 'done',
    assignee: 'rafael@agency.com',
    dueDate: '2026-05-10',
    updatedAt: '2026-05-10T17:00:00Z',
  },
  {
    id: 'PL-402',
    title: 'Dashboard v2 — resumen de métricas',
    status: 'in_progress',
    assignee: 'valentina@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-22T11:00:00Z',
  },
  {
    id: 'PL-403',
    title: 'Integración de webhook',
    status: 'todo',
    assignee: 'rafael@agency.com',
    dueDate: '2026-06-05',
    updatedAt: '2026-05-21T10:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#paylane',
    author: 'valentina@agency.com',
    text: 'El dashboard v2 avanza bien, deberíamos tener una vista previa para el final de la semana.',
    timestamp: '2026-05-22T09:00:00Z',
  },
  {
    channel: '#paylane',
    author: 'rafael@agency.com',
    text: 'Sistema de auth lanzado y probado. Próximo paso: webhook.',
    timestamp: '2026-05-10T18:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-04-28T10:00:00Z',
    attendees: ['founder-1', 'paylane-ceo', 'paylane-cto'],
    summary:
      'Sesión de planificación mensual. Se acordaron tres entregables para mayo: sistema de autenticación, dashboard v2 y documentación de la API.',
    decisions: [
      'Sistema de auth para el 10 de mayo',
      'Dashboard v2 para fin de mayo',
      'Documentación de API para fin de mayo — crítica para su pitch de Serie A',
    ],
    commitments: [
      { owner: 'agencia', item: 'Sistema de autenticación (OAuth2)', dueDate: '2026-05-10' },
      { owner: 'agencia', item: 'Dashboard v2 — resumen de métricas', dueDate: '2026-05-31' },
      {
        owner: 'agencia',
        item: 'Documentación de API (spec OpenAPI + guía para desarrolladores)',
        dueDate: '2026-05-31',
      },
    ],
  },
  {
    date: '2026-05-15T10:00:00Z',
    attendees: ['account-lead-2', 'paylane-ceo'],
    summary:
      'Seguimiento de mitad de mes. Auth listo, dashboard en camino. El CEO preguntó específicamente por la documentación de la API para la Serie A.',
    decisions: ['La documentación de API sigue siendo prioridad para fin de mayo'],
    commitments: [
      {
        owner: 'agencia',
        item: 'Documentación de API entregada antes del 31 de mayo',
        dueDate: '2026-05-31',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Paylane — Revisión Mensual',
    date: '2026-05-29T10:00:00Z',
    attendees: ['founder-1', 'paylane-ceo', 'paylane-cto'],
    isUpcoming: true,
  },
  {
    title: 'Paylane — Seguimiento',
    date: '2026-05-15T10:00:00Z',
    attendees: ['account-lead-2', 'paylane-ceo'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Paylane — Entregables Q2',
    content:
      'Entregables de mayo: Sistema de auth ✅, Dashboard v2 (en progreso), Documentación de API (pendiente).',
    lastEditedAt: '2026-05-01T09:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Paylane_Deck_Serie_A.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-18T10:00:00Z',
    url: 'https://drive.google.com/mock/paylane-deck',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 2,
  mergedThisWeek: 3,
  openIssues: 4,
  lastCommitAt: '2026-05-22T13:00:00Z',
  recentPRs: [
    { title: 'feat: métricas dashboard v2', state: 'open', author: 'valentina@agency.com' },
    { title: 'feat: integración webhook', state: 'open', author: 'rafael@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Paylane — Notas del Fundador',
    content:
      'La documentación de API está bloqueando su Serie A. Si nos retrasamos, dañará significativamente la confianza. Hay que asignar a alguien lo antes posible.',
    updatedAt: '2026-05-16T20:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 210,
  dauChange: '+25%',
  conversionRate: '3.2%',
  conversionChange: '+0.5%',
  topEvent: 'transaction_initiated',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO de Paylane',
    text: '¿Alguna novedad sobre la documentación de la API? Los inversores están preguntando.',
    timestamp: '2026-05-22T08:00:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO de Paylane',
    text: 'También adjunto la spec de API que necesitamos documentar',
    timestamp: '2026-05-22T08:01:00Z',
    hasAttachment: true,
  },
]
