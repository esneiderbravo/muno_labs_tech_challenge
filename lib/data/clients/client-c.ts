// lib/data/clients/cornerstone.ts
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
  id: 'cornerstone',
  name: 'Cornerstone',
  industry: 'Retail enterprise con foco en catálogo, inventario y operaciones',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'CS-301',
    title: 'Integración de API — enfoque GraphQL',
    status: 'done',
    assignee: 'jorge@agency.com',
    dueDate: '2026-05-21',
    updatedAt: '2026-05-21T15:00:00Z',
  },
  {
    id: 'CS-302',
    title: 'Sincronización del catálogo de productos',
    status: 'in_progress',
    assignee: 'sofia@agency.com',
    dueDate: '2026-05-27',
    updatedAt: '2026-05-22T09:00:00Z',
  },
  {
    id: 'CS-303',
    title: 'Webhook de inventario',
    status: 'todo',
    assignee: 'jorge@agency.com',
    dueDate: '2026-05-29',
    updatedAt: '2026-05-20T11:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#cornerstone',
    author: 'jorge@agency.com',
    text: 'Aviso — tras analizar el volumen del catálogo, creo que deberíamos considerar un enfoque híbrido REST+GraphQL (Z) en lugar de GraphQL puro. Es más fácil de cachear y su CDN lo soporta mejor.',
    timestamp: '2026-05-22T10:00:00Z',
  },
  {
    channel: '#cornerstone',
    author: 'sofia@agency.com',
    text: 'De acuerdo con Jorge, el enfoque GraphQL está generando problemas N+1 con el tamaño del catálogo. El híbrido tiene más sentido.',
    timestamp: '2026-05-22T10:45:00Z',
  },
  {
    channel: '#cornerstone',
    author: 'account-lead-1@agency.com',
    text: 'Alineémonos en la próxima reunión antes de cambiar de dirección.',
    timestamp: '2026-05-22T11:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-20T09:00:00Z',
    attendees: ['account-lead-1', 'cornerstone-cto', 'jorge@agency.com'],
    summary:
      'Sesión de planificación de integración de API. Se evaluaron REST vs GraphQL. El CTO del cliente prefiere firmemente el enfoque REST por compatibilidad con su infraestructura existente.',
    decisions: [
      'Usar enfoque REST (enfoque X) para todas las integraciones de API',
      'Comenzar implementación esta semana',
    ],
    commitments: [
      { owner: 'agencia', item: 'Implementar integración de API REST', dueDate: '2026-05-21' },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Cornerstone — Revisión de API',
    date: '2026-05-26T10:00:00Z',
    attendees: ['account-lead-1', 'cornerstone-cto'],
    isUpcoming: true,
  },
  {
    title: 'Cornerstone — Planificación',
    date: '2026-05-20T09:00:00Z',
    attendees: ['account-lead-1', 'cornerstone-cto', 'jorge@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Cornerstone — Arquitectura Técnica',
    content:
      'Integración de API: enfoque REST (enfoque X). Todos los endpoints deben seguir convenciones RESTful. Ver documento de especificación de API de Cornerstone.',
    lastEditedAt: '2026-05-15T10:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Cornerstone_Especificacion_API_v1.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-15T10:00:00Z',
    url: 'https://drive.google.com/mock/cornerstone-spec',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 2,
  mergedThisWeek: 1,
  openIssues: 3,
  lastCommitAt: '2026-05-21T16:00:00Z',
  recentPRs: [
    { title: 'feat: integración api graphql', state: 'merged', author: 'jorge@agency.com' },
    {
      title: 'feat: sincronización catálogo de productos',
      state: 'open',
      author: 'sofia@agency.com',
    },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Cornerstone — Notas del Fundador',
    content:
      'El CTO es particular con REST. Hay que asegurarse de que el equipo esté alineado. Jorge tiende a sobreingeniear las soluciones.',
    updatedAt: '2026-05-20T22:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 3400,
  dauChange: '+2%',
  conversionRate: '1.8%',
  conversionChange: '-0.1%',
  topEvent: 'product_search',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CTO de Cornerstone',
    text: '¿Alguna novedad sobre la integración REST? Quiero compartir el progreso con nuestro equipo.',
    timestamp: '2026-05-22T14:00:00Z',
    hasAttachment: false,
  },
]
