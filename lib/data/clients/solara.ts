// lib/data/clients/solara.ts
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
  id: 'solara',
  name: 'Solara',
  industry: 'Energía limpia / Marketplace solar',
  assignedTo: ['founder-1', 'account-lead-2'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'SL-301',
    title: 'Módulo de comparación de instaladores solares',
    status: 'in_progress',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-26',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'SL-302',
    title: 'Calculadora de ahorro energético personalizada',
    status: 'done',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-15',
    updatedAt: '2026-05-15T17:30:00Z',
  },
  {
    id: 'SL-303',
    title: 'Integración con API de tarifas eléctricas CNMC',
    status: 'in_progress',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-28',
    updatedAt: '2026-05-19T14:00:00Z',
  },
  {
    id: 'SL-304',
    title: 'Panel de seguimiento post-instalación para clientes',
    status: 'todo',
    assignee: 'ana@agency.com',
    dueDate: '2026-06-05',
    updatedAt: '2026-05-18T09:00:00Z',
  },
  {
    id: 'SL-305',
    title: 'Landing page para instaladores partners',
    status: 'done',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-10',
    updatedAt: '2026-05-10T16:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#solara',
    author: 'founder-1',
    text: '¡Solara tuvo su mejor semana hasta la fecha! 2.100 usuarios activos diarios y el 5,2% de conversión a solicitud de presupuesto. El producto está funcionando exactamente como lo imaginamos.',
    timestamp: '2026-05-19T09:00:00Z',
  },
  {
    channel: '#solara',
    author: 'maria@agency.com',
    text: 'El módulo de comparación de instaladores va muy bien. Los primeros tests de usuario muestran un NPS de 72. Creo que esto va a disparar aún más las conversiones.',
    timestamp: '2026-05-19T10:30:00Z',
  },
  {
    channel: '#solara',
    author: 'account-lead-2',
    text: 'He hablado con la CEO de Solara. Están muy satisfechos y mencionaron que quieren expandir el contrato para incluir una app móvil nativa. Oportunidad de upsell importante.',
    timestamp: '2026-05-20T11:00:00Z',
  },
  {
    channel: '#solara',
    author: 'pedro@agency.com',
    text: 'La integración con la API de tarifas de la CNMC es más compleja de lo esperado — hay dos versiones de la API activas. Necesito un día más para hacerlo bien. Sin impacto en el cliente por ahora.',
    timestamp: '2026-05-20T15:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T11:00:00Z',
    attendees: ['founder-1', 'solara-ceo', 'account-lead-2'],
    summary:
      'Revisión mensual con resultados muy positivos. La CEO de Solara presentó datos de crecimiento orgánico del marketplace: 47 instaladores activos en la plataforma, tasa de cierre del 31%. Se discutió la posibilidad de lanzar una app móvil para que los clientes finales puedan hacer seguimiento de su instalación y consumo en tiempo real. También se planteó una asociación estratégica con una empresa de financiación de instalaciones.',
    decisions: [
      'Se aprueba explorar la app móvil como extensión del contrato actual',
      'La agencia preparará una propuesta técnica y económica para la app nativa en iOS y Android',
      'Solara facilitará los datos de uso para definir el MVP de la app',
    ],
    commitments: [
      {
        owner: 'agencia',
        item: 'Preparar propuesta técnica y presupuesto para app móvil',
        dueDate: '2026-05-30',
      },
      {
        owner: 'CEO de Solara',
        item: 'Compartir datos de comportamiento de usuarios para definir MVP',
        dueDate: '2026-05-26',
      },
    ],
  },
  {
    date: '2026-05-12T10:00:00Z',
    attendees: ['account-lead-2', 'solara-cto'],
    summary:
      'Sesión técnica de seguimiento. Revisión del estado de las integraciones y performance del marketplace. La calculadora de ahorro ya está en producción y tiene muy buena acogida. Se identificó la oportunidad de integrar datos de tarifas eléctricas en tiempo real para mejorar la precisión de los cálculos.',
    decisions: ['Proceder con la integración de la API de tarifas de la CNMC'],
    commitments: [
      {
        owner: 'pedro@agency.com',
        item: 'Completar integración API tarifas CNMC',
        dueDate: '2026-05-28',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Solara — Revisión propuesta app móvil',
    date: '2026-06-02T11:00:00Z',
    attendees: ['founder-1', 'solara-ceo', 'account-lead-2'],
    isUpcoming: true,
  },
  {
    title: 'Solara — Revisión mensual de producto',
    date: '2026-05-19T11:00:00Z',
    attendees: ['founder-1', 'solara-ceo', 'account-lead-2'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Solara — Estrategia de expansión 2026',
    content:
      'Objetivo H2 2026: lanzar app móvil nativa y alcanzar 100 instaladores activos en el marketplace. Palancas de crecimiento: SEO posicionamiento "instalar placas solares", alianza con financiadora Greenfund, programa de referidos para instaladores. Métrica clave: coste de adquisición de instalador <€200.',
    lastEditedAt: '2026-05-19T12:00:00Z',
  },
  {
    title: 'Solara — Especificación módulo comparación instaladores',
    content:
      'Criterios de comparación: precio estimado, valoraciones de usuarios, distancia al domicilio, tiempo medio de instalación, garantía ofrecida. Filtros: tipo de instalación (residencial/industrial), potencia deseada, financiación disponible. Vista: tarjetas con puntuación agregada y botón de solicitud de visita.',
    lastEditedAt: '2026-05-17T15:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Solara_Catalogo_Paneles_Solares_2026.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-05T10:00:00Z',
    url: 'https://drive.google.com/mock/solara-catalogo-paneles-2026',
  },
  {
    name: 'Solara_Acuerdo_Partnership_Instaladores.docx',
    type: 'docx',
    lastModifiedAt: '2026-04-28T14:00:00Z',
    url: 'https://drive.google.com/mock/solara-acuerdo-partnership-instaladores',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 2,
  mergedThisWeek: 4,
  openIssues: 3,
  lastCommitAt: '2026-05-20T13:00:00Z',
  recentPRs: [
    { title: 'feat: módulo comparación de instaladores', state: 'open', author: 'maria@agency.com' },
    { title: 'feat: integración API tarifas CNMC v2', state: 'open', author: 'pedro@agency.com' },
    { title: 'feat: calculadora de ahorro personalizada', state: 'merged', author: 'carlos@agency.com' },
    { title: 'feat: landing page instaladores partners', state: 'merged', author: 'maria@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Solara — Oportunidad de upsell app móvil',
    content:
      'La CEO está muy entusiasmada con la app móvil. Esto podría ser un contrato de 6 meses adicionales. Tengo que hacer la propuesta atractiva pero realista — no prometer un MVP en menos de 3 meses. El punto fuerte es el panel de seguimiento post-instalación, eso es lo que quieren los usuarios finales. Posible precio: €18.000 para el MVP iOS + Android.',
    updatedAt: '2026-05-20T20:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 2100,
  dauChange: '+31%',
  conversionRate: '5.2%',
  conversionChange: '+1.1%',
  topEvent: 'quote_request',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO Solara',
    text: 'Buenos días! Los números de esta semana son increíbles 🚀 Estoy muy contenta con el trabajo del equipo. ¿Podemos hablar pronto sobre la app móvil? Creo que hay una oportunidad enorme ahí.',
    timestamp: '2026-05-19T08:30:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Solara',
    text: 'Te mando por aquí los datos de comportamiento de usuario que me pediste. Son los últimos 30 días filtrados por instalación completada.',
    timestamp: '2026-05-20T17:00:00Z',
    hasAttachment: true,
  },
]
