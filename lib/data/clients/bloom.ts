// lib/data/clients/bloom.ts
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
  id: 'bloom',
  name: 'Bloom',
  industry: 'Marca D2C de bienestar y belleza',
  assignedTo: ['founder-1', 'account-lead-2'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'BL-601',
    title: 'Rediseño de página de producto con nuevo branding',
    status: 'in_progress',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-14',
    updatedAt: '2026-05-20T09:00:00Z',
  },
  {
    id: 'BL-602',
    title: 'Campaña de email marketing para lanzamiento de nueva línea',
    status: 'in_progress',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-12',
    updatedAt: '2026-05-20T10:30:00Z',
  },
  {
    id: 'BL-603',
    title: 'Integración de reviews de clientes en ficha de producto',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-25',
    updatedAt: '2026-05-18T14:00:00Z',
  },
  {
    id: 'BL-604',
    title: 'Optimización de checkout para reducir abandono',
    status: 'todo',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-17T11:00:00Z',
  },
  {
    id: 'BL-605',
    title: 'Banner y creatividades para campaña de mayo',
    status: 'cancelled',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-08',
    updatedAt: '2026-05-10T16:00:00Z',
  },
  {
    id: 'BL-606',
    title: 'Configuración de píxel de Meta Ads y eventos de conversión',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-27',
    updatedAt: '2026-05-19T09:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#bloom',
    author: 'account-lead-2',
    text: 'Bloom lleva dos semanas de retraso en la entrega del rediseño y la campaña de email. La CEO está muy frustrada. Necesitamos una reunión hoy o mañana para aclarar la situación y dar una fecha comprometida.',
    timestamp: '2026-05-20T08:30:00Z',
  },
  {
    channel: '#bloom',
    author: 'maria@agency.com',
    text: 'El rediseño va tarde porque el cliente no aprobó los primeros mockups y tardaron 6 días en darnos feedback. Pero reconozco que ya con el feedback en mano hemos tardado más de la cuenta. Lo tengo para el viernes.',
    timestamp: '2026-05-20T09:15:00Z',
  },
  {
    channel: '#bloom',
    author: 'ana@agency.com',
    text: 'La campaña de email está bloqueada porque necesito acceso al listado de clientes en Klaviyo y Bloom aún no me lo ha dado. Se lo pedí hace 10 días. Alguien tiene que escalar esto.',
    timestamp: '2026-05-20T09:45:00Z',
  },
  {
    channel: '#bloom',
    author: 'founder-1',
    text: 'Esta situación es grave. Tenemos que ser muy honestos con el cliente sobre qué está en nuestro control y qué no. Voy a llamar a la CEO ahora mismo. Necesito que todo el equipo tenga fechas realistas para hoy.',
    timestamp: '2026-05-20T10:00:00Z',
  },
  {
    channel: '#bloom',
    author: 'account-lead-2',
    text: 'He hablado con la CEO. Está muy enfadada, mencionó que si no hay entregables esta semana va a evaluar cambiar de agencia. Esto es urgente.',
    timestamp: '2026-05-20T14:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-20T16:00:00Z',
    attendees: ['founder-1', 'bloom-ceo', 'account-lead-2', 'maria@agency.com'],
    summary:
      'Reunión de crisis convocada por la CEO de Bloom tras dos semanas de retrasos acumulados. El tono fue tenso desde el inicio. La CEO expresó su frustración directamente: han perdido la ventana de campaña de mayo y el lanzamiento de la nueva línea de productos se ha retrasado. La agencia reconoció los retrasos y presentó un plan de recuperación con fechas concretas. La CEO aceptó darle una última oportunidad pero con seguimiento diario hasta que se entreguen los ítems pendientes.',
    decisions: [
      'La agencia entregará el rediseño de producto el viernes 22 de mayo sin excepciones',
      'El acceso a Klaviyo debe resolverse hoy — Bloom facilitará las credenciales antes de las 18h',
      'Se establece check-in diario por WhatsApp hasta que se normalice la situación',
    ],
    commitments: [
      {
        owner: 'maria@agency.com',
        item: 'Entrega del rediseño de página de producto aprobado',
        dueDate: '2026-05-22',
      },
      {
        owner: 'ana@agency.com',
        item: 'Campaña de email marketing configurada y lista para revisión',
        dueDate: '2026-05-25',
      },
      {
        owner: 'CEO de Bloom',
        item: 'Facilitar acceso a Klaviyo con listado de clientes segmentado',
        dueDate: '2026-05-20',
      },
    ],
  },
  {
    date: '2026-05-08T11:00:00Z',
    attendees: ['account-lead-2', 'bloom-ceo'],
    summary:
      'Primera señal de alerta. La CEO preguntó por el estado de las creatividades de mayo, que ya llevaban una semana de retraso. La agencia explicó que estaban pendientes de la aprobación de las guías de branding actualizadas. Se acordó un proceso de aprobación en 24h y se comprometieron fechas más ajustadas.',
    decisions: ['Establecer proceso de feedback con máximo 48h de respuesta por parte del cliente'],
    commitments: [
      {
        owner: 'bloom-ceo',
        item: 'Aprobar o rechazar mockups en máximo 48 horas',
        dueDate: null,
      },
      {
        owner: 'agencia',
        item: 'Entregar creatividades de campaña de mayo',
        dueDate: '2026-05-12',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Bloom — Entrega rediseño página de producto',
    date: '2026-05-22T18:00:00Z',
    attendees: ['founder-1', 'bloom-ceo', 'maria@agency.com'],
    isUpcoming: true,
  },
  {
    title: 'Bloom — Revisión campaña email marketing',
    date: '2026-05-25T16:00:00Z',
    attendees: ['account-lead-2', 'bloom-ceo', 'ana@agency.com'],
    isUpcoming: true,
  },
  {
    title: 'Bloom — Reunión de crisis',
    date: '2026-05-20T16:00:00Z',
    attendees: ['founder-1', 'bloom-ceo', 'account-lead-2', 'maria@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Bloom — Brief de campaña lanzamiento nueva línea',
    content:
      'Producto: línea "Bloom Naturals" — 6 SKUs de cuidado facial con ingredientes naturales certificados. Target: mujeres 25-40 años, conscientes de los ingredientes, dispuestas a pagar premium. Canales: email (Klaviyo), Instagram Ads, Google Shopping. Mensaje principal: "La naturaleza en su forma más pura". Tono: sofisticado, cercano, científicamente respaldado. Objetivo: 200 ventas primer mes.',
    lastEditedAt: '2026-05-01T10:00:00Z',
  },
  {
    title: 'Bloom — Guía de marca 2026',
    content:
      'Paleta de colores actualizada: verde salvia (#7D9B76), crema (#F5F0E8), terracota suave (#C97B5A). Tipografía: Playfair Display para títulos, Inter para cuerpo. Fotografía: fondos naturales, sin filtros artificiales, modelos diversas. Voz de marca: experta pero accesible, nunca condescendiente. Evitar: lenguaje técnico excesivo, modelos irreales, promesas exageradas.',
    lastEditedAt: '2026-05-05T14:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Bloom_Guia_de_Marca_2026.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-05T14:30:00Z',
    url: 'https://drive.google.com/mock/bloom-guia-marca-2026',
  },
  {
    name: 'Bloom_Brief_Campana_Naturals_Mayo2026.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-01T10:30:00Z',
    url: 'https://drive.google.com/mock/bloom-brief-campana-naturals',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 1,
  mergedThisWeek: 0,
  openIssues: 9,
  lastCommitAt: '2026-05-18T15:00:00Z',
  recentPRs: [
    { title: 'feat: rediseño página de producto con nuevo branding', state: 'open', author: 'maria@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Bloom — Riesgo real de perder el cliente',
    content:
      'La CEO de Bloom estaba al límite en la reunión de hoy. Esto no es un warning menor. Hay que ejecutar perfectamente esta semana. El rediseño tiene que ser impecable el viernes. Si fallamos de nuevo, nos van. Y honestamente, tendremos que aceptarlo — hemos fallado dos veces. Lo que más me preocupa es la falta de comunicación proactiva: no avisamos con tiempo cuando vimos que íbamos tarde.',
    updatedAt: '2026-05-20T22:00:00Z',
  },
  {
    title: 'Bloom — Lección aprendida sobre gestión de clientes',
    content:
      'Este caso es un ejemplo de qué pasa cuando no gestionamos las expectativas a tiempo. El problema del acceso a Klaviyo era conocido desde hace 10 días y no lo escalamos. La próxima vez que haya un bloqueador del cliente hay que comunicarlo en 24h, no esperar. Actualizar el proceso interno de gestión de proyectos.',
    updatedAt: '2026-05-20T23:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 380,
  dauChange: '-15%',
  conversionRate: '1.2%',
  conversionChange: '-0.9%',
  topEvent: 'product_view',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO Bloom',
    text: 'Llevo dos semanas esperando el rediseño y la campaña de email. Esto no puede seguir así. Necesito resultados concretos esta semana o tendré que buscar otras opciones. Estoy muy decepcionada.',
    timestamp: '2026-05-19T19:00:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Bloom',
    text: 'El viernes quiero ver el rediseño terminado. No borradores, no WIPs. Terminado y listo para publicar. Por favor confirma.',
    timestamp: '2026-05-20T21:00:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Bloom',
    text: 'Aquí van las credenciales de Klaviyo que me pedisteis. Por favor, confirmad cuando tengáis acceso.',
    timestamp: '2026-05-20T17:45:00Z',
    hasAttachment: true,
  },
]
