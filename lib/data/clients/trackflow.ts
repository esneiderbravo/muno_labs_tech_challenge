// lib/data/clients/trackflow.ts
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
  id: 'trackflow',
  name: 'Trackflow',
  industry: 'Logística y optimización de cadena de suministro SaaS',
  assignedTo: ['account-lead-1', 'founder-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'TF-701',
    title: 'Documentación técnica de API REST para deal enterprise',
    status: 'in_progress',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-24',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'TF-702',
    title: 'Portal de onboarding enterprise con guías de integración',
    status: 'in_progress',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-28',
    updatedAt: '2026-05-19T14:00:00Z',
  },
  {
    id: 'TF-703',
    title: 'Especificación del SLA y acuerdo de nivel de servicio',
    status: 'todo',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-26',
    updatedAt: '2026-05-18T11:00:00Z',
  },
  {
    id: 'TF-704',
    title: 'Módulo de tracking en tiempo real con WebSockets',
    status: 'done',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-12',
    updatedAt: '2026-05-12T17:00:00Z',
  },
  {
    id: 'TF-705',
    title: 'Integración con ERP SAP B1 para sincronización de órdenes',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-06-08',
    updatedAt: '2026-05-17T09:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#trackflow',
    author: 'account-lead-1',
    text: 'El deal enterprise con Grupo Logístico del Norte está muy avanzado. La firma está condicionada a que entreguemos la documentación técnica completa y el portal de onboarding. Es la prioridad de este sprint.',
    timestamp: '2026-05-19T09:30:00Z',
  },
  {
    channel: '#trackflow',
    author: 'carlos@agency.com',
    text: 'La documentación de la API va bien. Estoy usando OpenAPI 3.1 con ejemplos de requests reales. Creo que quedará muy profesional para los ingenieros del cliente enterprise.',
    timestamp: '2026-05-19T11:00:00Z',
  },
  {
    channel: '#trackflow',
    author: 'ana@agency.com',
    text: 'El portal de onboarding tendrá 5 secciones: credenciales de acceso, guías de integración, sandbox de pruebas, soporte técnico y changelog. ¿Lo construimos en Docusaurus o preferimos algo más customizado?',
    timestamp: '2026-05-20T10:00:00Z',
  },
  {
    channel: '#trackflow',
    author: 'account-lead-1',
    text: 'Docusaurus está perfecto para esto. Rápido de implementar y ya lo conoce el equipo. El cliente enterprise quiere algo funcional antes de firmar, no necesitan algo fancy.',
    timestamp: '2026-05-20T10:30:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'trackflow-ceo', 'account-lead-1'],
    summary:
      'Actualización del estado del deal enterprise con Grupo Logístico del Norte. El CTO del potencial cliente ha solicitado documentación técnica detallada de la API y un SLA formal antes de dar luz verde a la firma. El CEO de Trackflow está muy optimista — es el contrato más grande de su historia (€120.000 anuales). Se revisó el timeline y se acordó que la documentación debe estar lista el 24 de mayo para una demo técnica el 27.',
    decisions: [
      'La documentación API en OpenAPI 3.1 es prioritaria y debe entregarse el 24 de mayo',
      'El SLA ofrecerá uptime 99,9% con penalizaciones definidas',
      'La demo técnica del 27 incluirá sandbox en vivo',
    ],
    commitments: [
      {
        owner: 'carlos@agency.com',
        item: 'Documentación completa API REST en OpenAPI 3.1 con ejemplos',
        dueDate: '2026-05-24',
      },
      {
        owner: 'pedro@agency.com',
        item: 'Borrador de SLA con métricas de uptime y penalizaciones',
        dueDate: '2026-05-26',
      },
      {
        owner: 'CEO de Trackflow',
        item: 'Confirmar asistentes de la demo técnica del 27 de mayo',
        dueDate: '2026-05-23',
      },
    ],
  },
  {
    date: '2026-05-12T11:00:00Z',
    attendees: ['account-lead-1', 'trackflow-cto'],
    summary:
      'Revisión técnica del módulo de tracking en tiempo real. El módulo de WebSockets está en producción y funcionando correctamente. El CTO de Trackflow tiene muy buena impresión del rendimiento — el tiempo de actualización es de menos de 500ms. Se habló de la próxima integración con SAP B1 y la complejidad que implica.',
    decisions: ['La integración SAP B1 requerirá un análisis técnico previo con el equipo IT del cliente'],
    commitments: [
      {
        owner: 'agencia',
        item: 'Análisis técnico de integración SAP B1 con estimación de horas',
        dueDate: '2026-05-30',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Trackflow — Demo técnica enterprise (Grupo Logístico del Norte)',
    date: '2026-05-27T10:00:00Z',
    attendees: ['founder-1', 'trackflow-ceo', 'trackflow-cto', 'account-lead-1'],
    isUpcoming: true,
  },
  {
    title: 'Trackflow — Revisión estado del deal enterprise',
    date: '2026-05-19T10:00:00Z',
    attendees: ['founder-1', 'trackflow-ceo', 'account-lead-1'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Trackflow — Documentación API REST v2',
    content:
      'Endpoints principales: POST /shipments (crear envío), GET /shipments/{id}/tracking (estado en tiempo real), POST /routes/optimize (optimización de rutas), GET /analytics/performance (métricas de rendimiento). Autenticación: OAuth 2.0 con tokens de larga duración para integraciones enterprise. Límites: 1.000 requests/min plan standard, 10.000 requests/min plan enterprise. Webhooks disponibles para eventos de estado.',
    lastEditedAt: '2026-05-20T11:00:00Z',
  },
  {
    title: 'Trackflow — Guía de onboarding enterprise',
    content:
      'Fase 1 (semana 1): provisioning de credenciales, acceso a sandbox, configuración de webhooks. Fase 2 (semana 2): integración con sistema interno del cliente, tests de carga. Fase 3 (semana 3): migración de datos históricos, configuración de alertas. Fase 4 (semana 4): go-live supervisado, formación del equipo operativo. Soporte dedicado durante 60 días post go-live.',
    lastEditedAt: '2026-05-19T15:00:00Z',
  },
  {
    title: 'Trackflow — Especificación SLA enterprise',
    content:
      'Uptime garantizado: 99,9% mensual (máximo 43,8 min de downtime/mes). Tiempo de respuesta API: P95 < 200ms, P99 < 500ms. Soporte: P1 (crítico) respuesta en 1h, P2 (alto) 4h, P3 (normal) 24h. Penalizaciones por incumplimiento: crédito del 10% de la cuota mensual por cada 0,1% por debajo del SLA. Exclusiones: mantenimiento programado comunicado con 48h de antelación.',
    lastEditedAt: '2026-05-18T14:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Trackflow_API_Reference_v2.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-20T11:30:00Z',
    url: 'https://drive.google.com/mock/trackflow-api-reference-v2',
  },
  {
    name: 'Trackflow_Propuesta_Enterprise_GrupoLogistico.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-15T09:00:00Z',
    url: 'https://drive.google.com/mock/trackflow-propuesta-enterprise-grupologistico',
  },
  {
    name: 'Trackflow_SLA_Enterprise_borrador.docx',
    type: 'docx',
    lastModifiedAt: '2026-05-18T14:30:00Z',
    url: 'https://drive.google.com/mock/trackflow-sla-enterprise-borrador',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 4,
  mergedThisWeek: 3,
  openIssues: 5,
  lastCommitAt: '2026-05-20T12:00:00Z',
  recentPRs: [
    { title: 'docs: documentación API REST OpenAPI 3.1', state: 'open', author: 'carlos@agency.com' },
    { title: 'feat: portal de onboarding enterprise en Docusaurus', state: 'open', author: 'ana@agency.com' },
    { title: 'feat: sandbox de pruebas con datos ficticios', state: 'open', author: 'pedro@agency.com' },
    { title: 'feat: módulo tracking en tiempo real con WebSockets', state: 'merged', author: 'carlos@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Trackflow — Deal enterprise, momento decisivo',
    content:
      'El deal con Grupo Logístico del Norte puede ser transformador para Trackflow. €120.000 anuales y si lo ejecutamos bien, habrá 2-3 clientes enterprise más en pipeline. La documentación técnica tiene que ser impecable — el CTO del cliente va a revisarla en detalle. Tenemos que asegurarnos de que Carlos dedique tiempo suficiente esta semana. La demo del 27 es el momento de la verdad.',
    updatedAt: '2026-05-20T21:00:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 1450,
  dauChange: '+8%',
  conversionRate: '2.9%',
  conversionChange: '+0.3%',
  topEvent: 'shipment_tracked',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO Trackflow',
    text: 'Hola, ¿cómo va la documentación de la API? El CTO de Grupo Logístico me preguntó hoy si ya la tenemos lista para enviarle. Muy importante tenerla el jueves como acordamos.',
    timestamp: '2026-05-20T09:00:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Trackflow',
    text: 'Confirmado: para la demo del 27 vendrán el CTO, el Director de Operaciones y el CIO. Son 3 personas muy técnicas. Aseguraos de que el sandbox funcione perfectamente.',
    timestamp: '2026-05-20T16:30:00Z',
    hasAttachment: false,
  },
]
