// lib/data/clients/draftly.ts
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
  id: 'draftly',
  name: 'Draftly',
  industry: 'Plataforma de creación de contenido con IA',
  assignedTo: ['founder-1', 'account-lead-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'DR-401',
    title: 'Motor de generación de contenido con GPT-4o',
    status: 'in_progress',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-24',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'DR-402',
    title: 'Editor de contenido con historial de versiones',
    status: 'in_progress',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-27',
    updatedAt: '2026-05-20T11:30:00Z',
  },
  {
    id: 'DR-403',
    title: 'Biblioteca de templates de contenido por industria',
    status: 'in_progress',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-29',
    updatedAt: '2026-05-19T15:00:00Z',
  },
  {
    id: 'DR-404',
    title: 'Integración con Buffer y Hootsuite para publicación directa',
    status: 'todo',
    assignee: 'pedro@agency.com',
    dueDate: '2026-06-05',
    updatedAt: '2026-05-18T09:00:00Z',
  },
  {
    id: 'DR-405',
    title: 'Sistema de tono de marca personalizable por cliente',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-06-10',
    updatedAt: '2026-05-17T14:00:00Z',
  },
  {
    id: 'DR-406',
    title: 'Dashboard de analíticas de contenido generado',
    status: 'todo',
    assignee: 'maria@agency.com',
    dueDate: '2026-06-12',
    updatedAt: '2026-05-16T11:00:00Z',
  },
  {
    id: 'DR-407',
    title: 'Optimización de velocidad de generación (reducir latencia <2s)',
    status: 'done',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-14',
    updatedAt: '2026-05-14T18:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#draftly',
    author: 'founder-1',
    text: '¡Draftly está explotando! Un post sobre su herramienta se hizo viral en LinkedIn — 4.800 DAU hoy, crecimiento del 67% en el último mes. El CEO me acaba de escribir por WhatsApp. Esto es enorme.',
    timestamp: '2026-05-20T09:00:00Z',
  },
  {
    channel: '#draftly',
    author: 'account-lead-1',
    text: 'El CEO pregunta si podemos acelerar el desarrollo de las integraciones con Buffer y Hootsuite. Dice que muchos de los nuevos usuarios lo están pidiendo en el chat de soporte.',
    timestamp: '2026-05-20T09:45:00Z',
  },
  {
    channel: '#draftly',
    author: 'carlos@agency.com',
    text: 'El motor GPT-4o va muy bien. Los primeros tests con usuarios reales muestran que el 78% del contenido generado se publica sin modificaciones. Eso es un número brutal.',
    timestamp: '2026-05-20T10:30:00Z',
  },
  {
    channel: '#draftly',
    author: 'ana@agency.com',
    text: 'Tenemos solicitudes de templates para 12 industrias nuevas: inmobiliaria, salud, alimentación... La lista no para de crecer. ¿Definimos prioridades con el cliente esta semana?',
    timestamp: '2026-05-20T13:00:00Z',
  },
  {
    channel: '#draftly',
    author: 'maria@agency.com',
    text: 'El historial de versiones está casi listo. Una pregunta: ¿cuántas versiones guardamos por defecto? El cliente quiere ilimitadas pero eso va a disparar los costes de almacenamiento.',
    timestamp: '2026-05-20T15:30:00Z',
  },
  {
    channel: '#draftly',
    author: 'founder-1',
    text: 'Hay que hablar de escalar el contrato. Con este crecimiento, el CEO va a querer más capacidad y más features. Es el momento perfecto para proponer una ampliación. Reunión esta semana.',
    timestamp: '2026-05-20T17:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T16:00:00Z',
    attendees: ['founder-1', 'draftly-ceo', 'account-lead-1', 'carlos@agency.com'],
    summary:
      'El CEO de Draftly llegó a la reunión muy emocionado por el crecimiento viral de la semana. Se revisaron las métricas de la plataforma y se discutió el backlog priorizado. El CEO quiere acelerar el desarrollo de integraciones con herramientas de publicación social y un sistema de tono de marca, que es la feature más solicitada por los nuevos usuarios. Se planteó formalmente la posibilidad de ampliar el contrato para Q3.',
    decisions: [
      'Las integraciones con Buffer/Hootsuite suben en prioridad al sprint actual',
      'El sistema de tono de marca es la feature estrella para el lanzamiento del plan premium',
      'Historial de versiones: límite de 50 versiones en plan gratuito, ilimitado en premium',
    ],
    commitments: [
      {
        owner: 'agencia',
        item: 'Propuesta de ampliación de contrato para Q3 con roadmap detallado',
        dueDate: '2026-05-30',
      },
      {
        owner: 'agencia',
        item: 'Subir integración Buffer/Hootsuite a sprint actual',
        dueDate: '2026-06-05',
      },
      {
        owner: 'CEO de Draftly',
        item: 'Compartir top 20 solicitudes de features del chat de soporte',
        dueDate: '2026-05-22',
      },
    ],
  },
  {
    date: '2026-05-12T11:00:00Z',
    attendees: ['account-lead-1', 'draftly-cto'],
    summary:
      'Reunión técnica de seguimiento de sprint. Se presentó el resultado de la optimización de latencia del motor de generación, que ya responde en menos de 2 segundos. Se revisó la arquitectura de la biblioteca de templates y se definió el formato de datos para que el cliente pueda crear sus propios templates sin necesidad de soporte técnico.',
    decisions: [
      'Formato de templates: JSON con campos predefinidos, editable desde el panel de administración',
      'La latencia de generación ya está por debajo del umbral objetivo',
    ],
    commitments: [
      {
        owner: 'ana@agency.com',
        item: 'Completar biblioteca inicial con 50 templates en 10 industrias',
        dueDate: '2026-05-29',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Draftly — Revisión propuesta ampliación Q3',
    date: '2026-06-03T11:00:00Z',
    attendees: ['founder-1', 'draftly-ceo', 'account-lead-1'],
    isUpcoming: true,
  },
  {
    title: 'Draftly — Demo features premium (tono de marca)',
    date: '2026-05-27T16:00:00Z',
    attendees: ['founder-1', 'draftly-ceo', 'carlos@agency.com'],
    isUpcoming: true,
  },
  {
    title: 'Draftly — Sincronización semanal',
    date: '2026-05-19T16:00:00Z',
    attendees: ['founder-1', 'draftly-ceo', 'account-lead-1'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Draftly — Especificación motor IA de contenido',
    content:
      'Arquitectura: API Gateway → orquestador de prompts → GPT-4o → postprocesador de formato. Parámetros configurables por usuario: tono, longitud, idioma, formato de salida (blog, LinkedIn, email, tweet thread). Límites de plan: gratuito 10 generaciones/día, pro 200/día, enterprise ilimitado. Métricas de calidad: tasa de publicación sin edición (objetivo >70%).',
    lastEditedAt: '2026-05-18T14:00:00Z',
  },
  {
    title: 'Draftly — Catálogo de templates de contenido',
    content:
      'Estado actual: 32 templates en 8 industrias (SaaS, e-commerce, inmobiliaria, salud, educación, restauración, moda, fintech). En progreso: templates para redes sociales específicas (Threads, TikTok captions). Criterios de calidad por template: mínimo 3 ejemplos de output validados por un copywriter humano.',
    lastEditedAt: '2026-05-19T10:00:00Z',
  },
  {
    title: 'Draftly — Estrategia de crecimiento y plan premium',
    content:
      'Catalizador de crecimiento: viralidad orgánica en LinkedIn por el post del cofundador (mayo 2026). Plan de monetización: freemium → pro (€29/mes) → team (€79/mes, hasta 5 usuarios) → enterprise. Features del plan premium: tono de marca, integraciones de publicación, colaboración en tiempo real, analíticas de rendimiento. Objetivo: 15% de conversión freemium a pro en 90 días.',
    lastEditedAt: '2026-05-20T09:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Draftly_Propuesta_Ampliacion_Q3_borrador.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-20T18:00:00Z',
    url: 'https://drive.google.com/mock/draftly-propuesta-ampliacion-q3',
  },
  {
    name: 'Draftly_Guia_Templates_Contenido_v1.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-16T11:00:00Z',
    url: 'https://drive.google.com/mock/draftly-guia-templates-v1',
  },
  {
    name: 'Draftly_Metricas_Crecimiento_Mayo2026.xlsx',
    type: 'xlsx',
    lastModifiedAt: '2026-05-20T08:30:00Z',
    url: 'https://drive.google.com/mock/draftly-metricas-mayo2026',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 8,
  mergedThisWeek: 5,
  openIssues: 6,
  lastCommitAt: '2026-05-20T17:30:00Z',
  recentPRs: [
    { title: 'feat: motor de generación GPT-4o v2', state: 'open', author: 'carlos@agency.com' },
    { title: 'feat: editor con historial de versiones (50 límite)', state: 'open', author: 'maria@agency.com' },
    { title: 'feat: biblioteca templates por industria', state: 'open', author: 'ana@agency.com' },
    { title: 'feat: integración Buffer WIP', state: 'open', author: 'pedro@agency.com' },
    { title: 'feat: sistema tono de marca borrador', state: 'open', author: 'carlos@agency.com' },
    { title: 'fix: optimización latencia generación <2s', state: 'merged', author: 'carlos@agency.com' },
    { title: 'feat: panel de administración templates', state: 'merged', author: 'ana@agency.com' },
    { title: 'chore: actualización dependencias AI SDK', state: 'open', author: 'pedro@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Draftly — Momento para subir tarifas',
    content:
      'El crecimiento de Draftly es una oportunidad real para renegociar. Con 4.800 DAU y crecimiento del 67%, están en una posición muy diferente a cuando firmamos el contrato inicial. Hay que proponer una ampliación que refleje el valor que estamos aportando. Pensar en modelo de revenue share o tarifa plana más alta. No tener miedo de pedir lo que vale el trabajo.',
    updatedAt: '2026-05-20T22:30:00Z',
  },
  {
    title: 'Draftly — Notas post-reunión CEO',
    content:
      'El CEO tiene mucha energía ahora mismo. El crecimiento viral los ha puesto en el mapa. Quieren mover rápido. Hay que ser muy cuidadosos en no prometer demasiado — el equipo ya está a tope. Si ampliamos el contrato, tenemos que o contratar a alguien más o redistribuir trabajo. Hablar con el equipo antes de comprometer más capacidad.',
    updatedAt: '2026-05-19T21:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 4800,
  dauChange: '+67%',
  conversionRate: '7.1%',
  conversionChange: '+2.3%',
  topEvent: 'content_generated',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO Draftly',
    text: '¡Hola! ¿Has visto los números de hoy? 4.800 usuarios activos 🔥 Necesito que el equipo se ponga con las integraciones de publicación social lo antes posible, los usuarios no paran de pedirlo. ¿Cuándo podemos tenerlo?',
    timestamp: '2026-05-20T08:45:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Draftly',
    text: 'Acabo de hablar con un inversor que quiere conocer el producto. ¿Me puedes ayudar a preparar una demo para la semana que viene? Quiero que se vea el generador de contenido y los templates.',
    timestamp: '2026-05-20T14:00:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Draftly',
    text: 'Te mando el listado de las 20 features más pedidas por los usuarios en soporte. Hay algunas que sorprenden. Igual cambiamos prioridades en el roadmap 👀',
    timestamp: '2026-05-20T18:30:00Z',
    hasAttachment: true,
  },
]
