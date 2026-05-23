// lib/data/clients/vivamart.ts
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
  id: 'vivamart',
  name: 'Vivamart',
  industry: 'E-commerce omnicanal para retail de consumo masivo',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'VM-101',
    title: 'Rediseño del flujo de pago',
    status: 'in_progress',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-23',
    updatedAt: '2026-05-19T10:00:00Z',
  },
  {
    id: 'VM-102',
    title: 'Integración de pasarela de pagos',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-23',
    updatedAt: '2026-05-18T09:00:00Z',
  },
  {
    id: 'VM-103',
    title: 'Correcciones de diseño responsive móvil',
    status: 'todo',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-21',
    updatedAt: '2026-05-17T14:00:00Z',
  },
  {
    id: 'VM-104',
    title: 'Panel de analíticas',
    status: 'done',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-15',
    updatedAt: '2026-05-15T18:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#vivamart',
    author: 'carlos@agency.com',
    text: '¿Cómo vamos con el flujo de pago, sigue en tiempo?',
    timestamp: '2026-05-18T11:00:00Z',
  },
  {
    channel: '#vivamart',
    author: 'maria@agency.com',
    text: 'Vamos un poco atrasados con el rediseño, la integración de pagos está bloqueada esperando las API keys del cliente.',
    timestamp: '2026-05-18T11:30:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'vivamart-cto', 'maria@agency.com'],
    summary:
      'Revisión de sprint para la entrega de Q2. El cliente confirmó que la fecha límite es el viernes 23 de mayo. Tres tareas siguen abiertas. El cliente está preocupado por el cronograma.',
    decisions: [
      'La fecha límite es inamovible — el 23 de mayo no es negociable',
      'Vivamart enviará las API keys de la pasarela de pagos antes del martes al cierre del día',
    ],
    commitments: [
      {
        owner: 'CTO de Vivamart',
        item: 'Enviar API keys de la pasarela de pagos',
        dueDate: '2026-05-20',
      },
      {
        owner: 'agencia',
        item: 'Entregar flujo de pago + integración de pagos + correcciones móvil',
        dueDate: '2026-05-23',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Vivamart — Revisión de Sprint',
    date: '2026-05-24T14:00:00Z',
    attendees: ['founder-1', 'vivamart-cto'],
    isUpcoming: true,
  },
  {
    title: 'Vivamart — Sincronización Semanal',
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'vivamart-cto', 'maria@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Vivamart — Brief del Proyecto',
    content:
      'Rediseño completo de e-commerce. Alcance: proceso de pago, pagos, móvil. Cronograma: Q2 2026.',
    lastEditedAt: '2026-05-01T09:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Vivamart_Propuesta_Q2_v3.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-04-15T10:00:00Z',
    url: 'https://drive.google.com/mock/vivamart-proposal',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 3,
  mergedThisWeek: 0,
  openIssues: 5,
  lastCommitAt: '2026-05-19T08:00:00Z',
  recentPRs: [
    { title: 'feat: rediseño checkout WIP', state: 'open', author: 'maria@agency.com' },
    { title: 'feat: integración pasarela de pagos', state: 'open', author: 'carlos@agency.com' },
    { title: 'fix: responsive móvil', state: 'open', author: 'ana@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Vivamart — Notas del Fundador',
    content:
      'El CTO parece ansioso. El riesgo de incumplir la fecha es real. Hay que escalar internamente si no recibimos las keys el martes.',
    updatedAt: '2026-05-19T21:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 1240,
  dauChange: '-8%',
  conversionRate: '2.1%',
  conversionChange: '-0.4%',
  topEvent: 'product_view',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CTO de Vivamart',
    text: 'Hola, ¿alguna novedad sobre el proceso de pago? Tenemos reunión de directivos el viernes por la mañana.',
    timestamp: '2026-05-21T08:00:00Z',
    hasAttachment: false,
  },
]
