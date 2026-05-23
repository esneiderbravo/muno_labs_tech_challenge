// lib/data/clients/metrify.ts
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
  id: 'metrify',
  name: 'Metrify',
  industry: 'Analítica B2B para cadenas de retail',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'MF-501',
    title: 'Nuevo widget de comparativa entre tiendas',
    status: 'in_progress',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-28',
    updatedAt: '2026-05-19T11:00:00Z',
  },
  {
    id: 'MF-502',
    title: 'Exportación de informes en PDF y Excel',
    status: 'todo',
    assignee: 'ana@agency.com',
    dueDate: '2026-06-02',
    updatedAt: '2026-05-18T10:00:00Z',
  },
  {
    id: 'MF-503',
    title: 'Alertas automáticas por umbral de KPI',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-06-09',
    updatedAt: '2026-05-17T14:00:00Z',
  },
  {
    id: 'MF-504',
    title: 'Corrección de cálculo erróneo en margen bruto por categoría',
    status: 'done',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-14',
    updatedAt: '2026-05-14T16:00:00Z',
  },
  {
    id: 'MF-505',
    title: 'Mejora de rendimiento en dashboards con más de 50 tiendas',
    status: 'in_progress',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-20T09:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#metrify',
    author: 'account-lead-1',
    text: 'Metrify renueva contrato en julio. Hay que tener una conversación con el CPO sobre qué quieren para el siguiente año. Sugiero proactivamente preparar una propuesta renovada.',
    timestamp: '2026-05-19T10:00:00Z',
  },
  {
    channel: '#metrify',
    author: 'pedro@agency.com',
    text: 'El widget de comparativa entre tiendas avanza bien. El cliente había pedido que fuera drag & drop para reorganizar las métricas. Lo estoy implementando con react-dnd.',
    timestamp: '2026-05-19T11:30:00Z',
  },
  {
    channel: '#metrify',
    author: 'carlos@agency.com',
    text: 'El rendimiento en dashboards con muchas tiendas mejora bastante con virtualización de filas. Espero reducir el tiempo de carga de 4s a menos de 1s.',
    timestamp: '2026-05-20T10:00:00Z',
  },
  {
    channel: '#metrify',
    author: 'account-lead-1',
    text: 'El CPO me comentó que están evaluando otras herramientas de analítica. No es urgente pero hay que asegurarnos de que el producto siga siendo relevante para ellos. ¿Qué podemos ofrecerles de nuevo?',
    timestamp: '2026-05-20T15:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T12:00:00Z',
    attendees: ['account-lead-1', 'metrify-cpo', 'pedro@agency.com'],
    summary:
      'Revisión mensual de producto. El CPO presentó el feedback de 3 cadenas de retail que usan la plataforma. Los puntos positivos: fiabilidad de datos y facilidad de uso. Los puntos de mejora: falta la posibilidad de exportar informes y las alertas automáticas cuando un KPI cae por debajo de un umbral. También mencionó que evalúan otras herramientas de BI. La renovación de contrato es en julio y quieren ver progreso concreto antes de firmar.',
    decisions: [
      'Priorizar exportación de informes y alertas de KPI para el siguiente sprint',
      'Proponer sesión de discovery para entender mejor las necesidades de cara a la renovación',
    ],
    commitments: [
      {
        owner: 'agencia',
        item: 'Completar exportación de informes PDF/Excel',
        dueDate: '2026-06-02',
      },
      {
        owner: 'agencia',
        item: 'Prototipo de sistema de alertas por umbral de KPI',
        dueDate: '2026-06-09',
      },
      {
        owner: 'account-lead-1',
        item: 'Preparar propuesta de renovación con roadmap H2 2026',
        dueDate: '2026-06-15',
      },
    ],
  },
  {
    date: '2026-05-08T10:00:00Z',
    attendees: ['account-lead-1', 'metrify-cpo'],
    summary:
      'Check-in quincenal breve. El cliente confirmó que el bug de cálculo de margen bruto estaba afectando a 3 clientes de la plataforma. El fix fue bien recibido y se agradece la velocidad de respuesta. Se habló de la posibilidad de agregar un módulo de previsión de ventas basado en datos históricos como diferencial competitivo.',
    decisions: ['Explorar viabilidad técnica de módulo de previsión de ventas para H2'],
    commitments: [
      {
        owner: 'agencia',
        item: 'Estudio de viabilidad de módulo de previsión de ventas con IA',
        dueDate: '2026-05-30',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Metrify — Revisión pre-renovación de contrato',
    date: '2026-06-16T11:00:00Z',
    attendees: ['account-lead-1', 'founder-1', 'metrify-cpo'],
    isUpcoming: true,
  },
  {
    title: 'Metrify — Revisión mensual de producto',
    date: '2026-05-19T12:00:00Z',
    attendees: ['account-lead-1', 'metrify-cpo', 'pedro@agency.com'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Metrify — Especificación dashboard analítico retail',
    content:
      'Módulos: resumen ejecutivo, análisis por tienda, análisis por categoría, análisis de personal. Métricas clave: ventas brutas, margen bruto, ticket medio, unidades vendidas, tasa de devolución, rotación de stock. Visualizaciones: series temporales, rankings, comparativas entre tiendas. Acceso: roles diferenciados (gerente de área, director regional, C-level).',
    lastEditedAt: '2026-05-10T14:00:00Z',
  },
  {
    title: 'Metrify — Framework de KPIs para retail',
    content:
      'KPIs nivel tienda: ventas/m², conversión de tráfico, NPS cliente, cobertura de stock. KPIs nivel cadena: evolución vs. año anterior, ranking de tiendas, distribución geográfica de ventas. KPIs financieros: EBITDA estimado por tienda, coste operativo vs. ventas. Definición acordada con el equipo de finanzas de Metrify.',
    lastEditedAt: '2026-05-03T11:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Metrify_Propuesta_Renovacion_2026_borrador.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-20T16:00:00Z',
    url: 'https://drive.google.com/mock/metrify-propuesta-renovacion-2026',
  },
  {
    name: 'Metrify_Manual_Usuario_Dashboard_v3.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-04-20T10:00:00Z',
    url: 'https://drive.google.com/mock/metrify-manual-usuario-v3',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 3,
  mergedThisWeek: 1,
  openIssues: 7,
  lastCommitAt: '2026-05-20T10:30:00Z',
  recentPRs: [
    { title: 'feat: widget comparativa entre tiendas con drag & drop', state: 'open', author: 'pedro@agency.com' },
    { title: 'perf: virtualización de filas en dashboard multi-tienda', state: 'open', author: 'carlos@agency.com' },
    { title: 'feat: exportación de informes PDF/Excel WIP', state: 'open', author: 'ana@agency.com' },
    { title: 'fix: cálculo erróneo margen bruto por categoría', state: 'merged', author: 'pedro@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Metrify — Renovación en riesgo moderado',
    content:
      'El CPO mencionó que evalúan otras herramientas de BI. No es una amenaza directa pero es una señal. El crecimiento de 3% no es suficiente para justificar la renovación sin más. Tenemos que mostrar un roadmap ambicioso y demostrar que entendemos sus problemas mejor que cualquier herramienta genérica. La propuesta de renovación tiene que ser muy sólida. Plantear el módulo de previsión con IA como diferencial.',
    updatedAt: '2026-05-20T20:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 620,
  dauChange: '+3%',
  conversionRate: '1.8%',
  conversionChange: '+0.1%',
  topEvent: 'dashboard_view',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CPO Metrify',
    text: 'Hola, ¿alguna novedad con la exportación de informes? Varios clientes lo están pidiendo y me gustaría tener algo que enseñarles antes de fin de mes.',
    timestamp: '2026-05-20T09:30:00Z',
    hasAttachment: false,
  },
  {
    from: 'CPO Metrify',
    text: 'Mañana tengo reunión con el equipo de Cortefiel. ¿Podéis prepararme una captura del nuevo widget de comparativa de tiendas para que lo vean? Aunque sea un mockup.',
    timestamp: '2026-05-20T18:00:00Z',
    hasAttachment: false,
  },
]
