// lib/data/clients/nexova.ts
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
  id: 'nexova',
  name: 'Nexova',
  industry: 'HR Tech SaaS',
  assignedTo: ['founder-1', 'account-lead-1'],
}

export const linearTasks: LinearTask[] = [
  {
    id: 'NX-201',
    title: 'Corregir bug crítico en flujo de onboarding (paso 3)',
    status: 'in_progress',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-21',
    updatedAt: '2026-05-20T09:30:00Z',
  },
  {
    id: 'NX-202',
    title: 'Preparar entorno de demo para inversores',
    status: 'in_progress',
    assignee: 'maria@agency.com',
    dueDate: '2026-05-22',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'NX-203',
    title: 'Actualizar deck de inversores con métricas de mayo',
    status: 'todo',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-22',
    updatedAt: '2026-05-19T16:00:00Z',
  },
  {
    id: 'NX-204',
    title: 'Integración SSO con Google Workspace',
    status: 'todo',
    assignee: 'carlos@agency.com',
    dueDate: '2026-05-28',
    updatedAt: '2026-05-18T11:00:00Z',
  },
  {
    id: 'NX-205',
    title: 'Optimizar tiempos de carga del dashboard principal',
    status: 'todo',
    assignee: 'pedro@agency.com',
    dueDate: '2026-05-30',
    updatedAt: '2026-05-17T14:00:00Z',
  },
  {
    id: 'NX-206',
    title: 'Documentar API de integraciones para partners',
    status: 'done',
    assignee: 'ana@agency.com',
    dueDate: '2026-05-16',
    updatedAt: '2026-05-16T17:00:00Z',
  },
]

export const slackMessages: SlackMessage[] = [
  {
    channel: '#nexova',
    author: 'founder-1',
    text: 'Equipo, la demo con los inversores es el jueves 28. El bug del onboarding TIENE que estar resuelto antes. Esto no puede fallar.',
    timestamp: '2026-05-20T08:15:00Z',
  },
  {
    channel: '#nexova',
    author: 'carlos@agency.com',
    text: 'Localicé el problema — hay una race condition en el paso 3 del onboarding cuando el usuario invita a su primer colaborador. Estoy en ello.',
    timestamp: '2026-05-20T09:45:00Z',
  },
  {
    channel: '#nexova',
    author: 'maria@agency.com',
    text: 'El entorno de staging de demo está casi listo. Solo falta poblar con datos de empresa ficticios realistas. ¿Alguien tiene el template de datos de prueba?',
    timestamp: '2026-05-20T11:00:00Z',
  },
  {
    channel: '#nexova',
    author: 'ana@agency.com',
    text: 'Voy a actualizar las métricas del deck esta tarde. ¿Confirmamos que el DAU actual es 890 con crecimiento del 22%?',
    timestamp: '2026-05-20T13:30:00Z',
  },
  {
    channel: '#nexova',
    author: 'carlos@agency.com',
    text: 'Fix deployado en staging. Por favor alguien valide el flujo completo de onboarding antes de las 18h. Necesito confirmación.',
    timestamp: '2026-05-20T16:00:00Z',
  },
]

export const meetingTranscripts: MeetingTranscript[] = [
  {
    date: '2026-05-19T15:00:00Z',
    attendees: ['founder-1', 'nexova-ceo', 'carlos@agency.com', 'maria@agency.com'],
    summary:
      'Reunión de emergencia convocada por el CEO de Nexova ante el descubrimiento del bug crítico en el onboarding. Se revisó el alcance del problema: afecta al 40% de los nuevos registros en empresas con más de 5 empleados. La demo con el fondo de Series A está programada para el 28 de mayo. El equipo se comprometió a tener el fix listo en 48 horas y el entorno de demo estabilizado 3 días antes de la presentación.',
    decisions: [
      'El bug de onboarding es prioridad absoluta sobre cualquier otro desarrollo',
      'Se congela el merge de nuevas features hasta resolver el incidente',
      'El entorno de demo usará datos ficticios de una empresa de 50 empleados',
    ],
    commitments: [
      {
        owner: 'carlos@agency.com',
        item: 'Resolver bug crítico en flujo de onboarding paso 3',
        dueDate: '2026-05-21',
      },
      {
        owner: 'maria@agency.com',
        item: 'Preparar y validar entorno de demo con datos realistas',
        dueDate: '2026-05-25',
      },
      {
        owner: 'CEO de Nexova',
        item: 'Confirmar agenda y asistentes de la demo con inversores',
        dueDate: '2026-05-22',
      },
    ],
  },
  {
    date: '2026-05-16T10:00:00Z',
    attendees: ['founder-1', 'nexova-ceo', 'nexova-cto'],
    summary:
      'Revisión quincenal del progreso de producto con foco en la ronda Series A. Se presentaron las métricas de crecimiento de mayo y se discutió el roadmap para los próximos 90 días post-inversión. El CEO expresó preocupación por la estabilidad técnica del producto ante los inversores técnicos del fondo.',
    decisions: [
      'Priorizar estabilidad y pulido de UX sobre nuevas features para la demo',
      'Preparar documentación técnica de arquitectura para los due diligence',
    ],
    commitments: [
      {
        owner: 'agencia',
        item: 'Preparar guía de arquitectura técnica para due diligence',
        dueDate: '2026-05-26',
      },
      {
        owner: 'nexova-cto',
        item: 'Compartir acceso al repositorio para auditoría de código',
        dueDate: '2026-05-23',
      },
    ],
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    title: 'Nexova — Demo Series A con inversores',
    date: '2026-05-28T11:00:00Z',
    attendees: ['founder-1', 'nexova-ceo', 'nexova-cto'],
    isUpcoming: true,
  },
  {
    title: 'Nexova — Revisión de entorno de demo',
    date: '2026-05-25T16:00:00Z',
    attendees: ['founder-1', 'maria@agency.com', 'nexova-ceo'],
    isUpcoming: true,
  },
  {
    title: 'Nexova — Sincronización quincenal',
    date: '2026-05-16T10:00:00Z',
    attendees: ['founder-1', 'nexova-ceo', 'nexova-cto'],
    isUpcoming: false,
  },
]

export const notionDocs: NotionDoc[] = [
  {
    title: 'Nexova — Roadmap H1 2026',
    content:
      'Q1: Lanzamiento de módulo de onboarding automatizado y gestión de nóminas. Q2: Integraciones con Google Workspace, Slack y sistemas HRIS. Hito Series A: alcanzar 1.000 DAU activos y 5 clientes enterprise. Pendiente: módulo de reporting de cumplimiento laboral.',
    lastEditedAt: '2026-05-15T10:00:00Z',
  },
  {
    title: 'Nexova — Notas deck inversores Series A',
    content:
      'Slide 1: Problema — el 73% de las PYMEs pierde más de 10h/semana en gestión manual de RRHH. Slide 4: Tracción — 890 DAU, crecimiento 22% MoM. Slide 7: Modelo de negocio — SaaS por asiento, €15/empleado/mes. Revisar: agregar caso de éxito de cliente enterprise antes del jueves.',
    lastEditedAt: '2026-05-20T14:00:00Z',
  },
  {
    title: 'Nexova — Especificación flujo de onboarding v2',
    content:
      'Paso 1: Registro de empresa (nombre, NIF, tamaño). Paso 2: Configuración de estructura organizativa. Paso 3: Invitación de colaboradores (bug actual: falla cuando se invitan >1 colaborador simultáneamente con rol admin). Paso 4: Integración con sistema de nóminas existente. Paso 5: Tour guiado del dashboard.',
    lastEditedAt: '2026-05-20T09:00:00Z',
  },
]

export const driveFiles: DriveFile[] = [
  {
    name: 'Nexova_PitchDeck_SeriesA_v4.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-20T14:30:00Z',
    url: 'https://drive.google.com/mock/nexova-pitchdeck-seriesa-v4',
  },
  {
    name: 'Nexova_Guia_Integraciones_v2.pdf',
    type: 'pdf',
    lastModifiedAt: '2026-05-16T17:00:00Z',
    url: 'https://drive.google.com/mock/nexova-guia-integraciones-v2',
  },
]

export const githubActivity: GithubActivity = {
  openPRs: 5,
  mergedThisWeek: 2,
  openIssues: 8,
  lastCommitAt: '2026-05-20T16:30:00Z',
  recentPRs: [
    { title: 'fix: race condition en onboarding paso 3', state: 'open', author: 'carlos@agency.com' },
    { title: 'feat: entorno de datos ficticios para demo', state: 'open', author: 'maria@agency.com' },
    { title: 'feat: integración SSO Google Workspace WIP', state: 'open', author: 'carlos@agency.com' },
    { title: 'chore: optimización de queries dashboard', state: 'open', author: 'pedro@agency.com' },
    { title: 'docs: documentación API integraciones partners', state: 'merged', author: 'ana@agency.com' },
  ],
}

export const obsidianNotes: ObsidianNote[] = [
  {
    title: 'Nexova — Riesgo demo Series A',
    content:
      'El bug del onboarding me tiene muy preocupado. Si Carlos no lo resuelve antes del miércoles, tenemos que plantearle al CEO retrasar la demo o mostrar solo el flujo de empresa ya configurada. No podemos permitir que un inversor vea un error en directo. Hay que tener un plan B. Hablar con el equipo mañana.',
    updatedAt: '2026-05-20T22:00:00Z',
  },
  {
    title: 'Nexova — Potencial post-inversión',
    content:
      'Si cierran la ronda, habrá mucho trabajo por delante: el CEO mencionó contratar 3 ingenieros internos. Tenemos que asegurarnos de que quieren seguir contando con nosotros para el trabajo de producto. Proponer un modelo de agencia embedded. Oportunidad grande si ejecutamos bien esta semana.',
    updatedAt: '2026-05-18T20:30:00Z',
  },
]

export const posthogMetrics: PosthogMetrics = {
  dau: 890,
  dauChange: '+22%',
  conversionRate: '3.4%',
  conversionChange: '+0.8%',
  topEvent: 'onboarding_step_1',
}

export const whatsappMessages: WhatsappMessage[] = [
  {
    from: 'CEO Nexova',
    text: 'Hola, necesito confirmación de que el bug del onboarding estará resuelto antes del miércoles. Los inversores son muy técnicos y van a querer hacer clic ellos mismos en la demo. No podemos fallar.',
    timestamp: '2026-05-20T21:30:00Z',
    hasAttachment: false,
  },
  {
    from: 'CEO Nexova',
    text: 'Acabo de hablar con el managing partner del fondo. Quieren ver el flujo completo de onboarding de una empresa de 20 personas. ¿Podemos asegurar eso? Necesito respuesta esta noche.',
    timestamp: '2026-05-20T22:15:00Z',
    hasAttachment: false,
  },
]
