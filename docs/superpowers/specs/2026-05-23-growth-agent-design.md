# Growth Agent — Design Spec
**Date:** 2026-05-23  
**Challenge:** MunoLabs Caso Tech & Growth Agent  
**Stack:** Next.js 16 + TypeScript + Vercel AI SDK + Claude claude-sonnet-4-6 + Vercel

---

## 1. WAYRTTD — What Are We Really Trying To Do

**No es:** Responder preguntas sobre proyectos.

**Es:** Convertir conocimiento fragmentado de múltiples herramientas en memoria organizacional accionable. Eliminar que el estado de los proyectos viva en la cabeza de personas.

El agente es un **PM virtual con memoria + contexto + criterio** — no un chatbot RAG.

---

## 2. Problema Real

Una agencia con 10+ clientes B2B activos tiene su información de estado dispersa en 10 herramientas distintas. Pedir un update claro de todos los proyectos le toma medio día a un founder. El agente resuelve esto siendo la única interfaz que orquesta todas las fuentes con criterio.

---

## 3. Arquitectura General

```
Browser (Next.js App Router)
    └─ Chat UI
         – Streaming de respuestas
         – Source badges por herramienta consultada
         – Confidence indicator (Alto/Medio/Bajo)
         – Conflict alert cuando hay discrepancia entre fuentes
         – Write-back card: "El agente propone X → [Aprobar]"
         – Sidebar con lista de clientes
         │
         ▼
    /api/chat  (Next.js Route Handler)
         │
         ▼
    Orchestrator Agent
         – Vercel AI SDK streamText + tool calling
         – Claude claude-sonnet-4-6
         – Loop de tool calls hasta tener contexto suficiente
         – detectConflicts() antes de pasar al LLM
         – Output siempre estructurado
         │
    ┌────┴──────────────────────────────────┐
    │           Tool Registry (10 tools)    │
    └───────────────────────────────────────┘
         │
    Memory Layer (in-memory por sesión)
         – Cachea tool results para evitar re-fetching
         – Registra qué tools se llamaron y cuándo
         │
         ▼
    Mock Data Layer
         – TypeScript modules con interfaz idéntica a las APIs reales
         – 4 clientes ficticios con escenarios diseñados para el demo
         – Swap a real: solo cambia el cuerpo de cada función
```

---

## 4. Tool Registry — Las 10 Herramientas

El agente decide qué herramientas llamar según el tipo de pregunta. No llama todas siempre.

| Tool | Datos mock | Modo | Frescura simulada |
|------|-----------|------|-------------------|
| `get_notion_docs(client)` | Wikis, propuestas, minutas limpias | Read | Días-semanas |
| `get_linear_tasks(client)` | Tasks, bugs, milestones, ciclos | Read + Write | Horas-días |
| `get_slack_messages(client, channel?)` | Hilos por cliente, decisiones rápidas | Read + Write (draft) | Minutos |
| `get_meeting_transcripts(client)` | Transcripts + resúmenes Granola/Circleback | Read | Minutos post-meeting |
| `get_calendar_events(client)` | Reuniones pasadas/futuras, asistentes | Read | Variable |
| `get_drive_files(client)` | Decks, propuestas, assets, exports | Read | Semanas |
| `get_github_activity(client)` | PRs, issues, commits recientes | Read | Horas |
| `get_obsidian_notes(founder?)` | Notas privadas del founder | Read | Días |
| `get_posthog_metrics(client)` | Métricas de producto en tiempo real | Read | Real-time |
| `get_whatsapp_messages(client)` | Mensajes recientes del canal cliente | Read | Minutos |

### Selección inteligente por tipo de query

```
"¿Cómo va Cliente A?"
→ transcripts + linear + slack
→ NO: drive, obsidian, posthog

"¿Qué métricas tiene Cliente B?"
→ posthog + linear + transcripts
→ NO: drive, github, calendar

"Brief para reunión de mañana con Cliente C"
→ calendar + transcripts + linear + slack + notion
→ NO: posthog, obsidian (salvo que el founder lo pida)

"¿Hay algo urgente en el repo de Cliente D?"
→ github + linear + slack
→ NO: calendar, drive, whatsapp
```

La inteligencia visible en el demo: el usuario ve qué herramientas consultó el agente y por qué.

---

## 5. Mock Data — 4 Clientes Diseñados para el Demo

| Cliente | Escenario | Demuestra |
|---------|-----------|-----------|
| **Cliente A** | Proyecto en riesgo: deadline esta semana, 3 tasks vencidas, sin update en Slack desde hace 5 días | Detección de riesgo, priorización |
| **Cliente B** | Estado saludable, reunión reciente, métricas positivas en PostHog | Respuesta normal estructurada |
| **Cliente C** | Conflicto activo: Granola(martes)=X, Linear(miércoles)=Y, Slack(jueves)=Z, Notion=X | Conflict resolution con confidence score |
| **Cliente D** | Promesas del mes pasado en transcripts, algunas cerradas en Linear, otras sin task | Cross-reference de compromisos |

---

## 6. Conflict Resolution

Lógica en el orchestrator (antes del LLM, más predecible):

```typescript
function detectConflicts(toolResults: ToolResult[]): Conflict[] {
  // Compara campos clave entre fuentes por cliente
  // Criterio de prioridad: timestamp más reciente
  // Si hay conflicto: NO silenciar, pasar al LLM con contexto explícito
}
```

**Formato de respuesta cuando hay conflicto:**
```
⚠️ Conflicto detectado entre fuentes:
  - Granola (martes 20/05): Se decidió continuar con diseño X
  - Linear (miércoles 21/05): Task cerrada como Y
  - Slack (jueves 22/05): Hilo sugiere cambiar a Z

Fuente más reciente: Slack/Z
Confianza: Media (70%)
Recomendación: Confirmar con el equipo antes de proceder.
```

---

## 7. Output Siempre Estructurado

El LLM nunca responde texto libre. El system prompt fuerza este formato:

```typescript
interface AgentResponse {
  summary: string           // 2-3 líneas ejecutivas
  risks: Risk[]             // Con evidencia y fuente
  next_steps: string[]      // Concretos y accionables
  confidence: 'high' | 'medium' | 'low'
  confidence_reason: string
  sources_consulted: string[]
  conflicts?: Conflict[]    // Solo si se detectaron
  proposed_actions?: ProposedAction[]  // Write-back pendiente de aprobación
}
```

**Regla de confianza:**
- `high`: todas las fuentes consultadas coinciden
- `medium`: fuentes mayoritariamente alineadas, alguna discrepancia menor
- `low`: conflicto activo, fuente única, o datos desactualizados

---

## 8. Write-back con Human-in-the-Loop

El agente puede proponer acciones de escritura, nunca ejecutarlas solo:

| Acción | Herramienta | Flujo |
|--------|------------|-------|
| Crear task | Linear | Agente propone → usuario aprueba → se crea |
| Actualizar doc | Notion | Agente propone → usuario aprueba → se actualiza |
| Draft de mensaje | Slack | Agente redacta → usuario revisa/envía |

**Autonomía en v1: draft mode only.** El agente nunca actúa por su cuenta.

---

## 9. Guardrails

| Riesgo | Guardrail |
|--------|-----------|
| Alucinación de datos | El LLM solo puede citar datos que vinieron de un tool call. El prompt prohíbe explícitamente inventar información. |
| Conflicto silenciado | Si `detectConflicts()` retorna resultados, el prompt obliga a mencionarlos. |
| Sobreconfianza | Confianza "Alta" solo si todas las fuentes coinciden. Fuente única = "Bajo". |
| Write-back sin permiso | Toda escritura requiere confirmación explícita del usuario (botón Aprobar). |
| Permisos de cuenta | Cada query incluye `userId`. El mock data layer filtra por clientes asignados al usuario. |
| Scope creep del agente | El system prompt define explícitamente qué puede y no puede hacer el agente. |

---

## 10. MCP vs API Directa vs Scrape

### Scrape — Descartado
Frágil, viola ToS en la mayoría de herramientas, alto costo de mantenimiento. Solo viable para herramientas sin API (edge case WhatsApp). No se usa en este proyecto.

### API Directa — Estrategia para v2
La decisión correcta para una web app donde el agente vive en nuestro servidor Next.js:

| Herramienta | API | Notas |
|-------------|-----|-------|
| Linear | GraphQL API | Excelente documentación, SDK oficial |
| Slack | Web API | SDK Node.js oficial, OAuth bien definido |
| GitHub | REST + GraphQL | Sin auth para repos públicos |
| Notion | REST API | SDK oficial, estructura predecible |
| Google Calendar/Drive | Google APIs | OAuth2 estándar, SDKs maduros |
| PostHog | REST API | Diseñada para consumo programático |
| Granola/Circleback | REST (si existe) o webhook | Depende del plan |
| WhatsApp | Mock en v1 | Sin API oficial sin Meta Business |
| Obsidian | Plugin local o vault sync | Sin API cloud nativa |

### MCP — La jugada estratégica
MCP (Model Context Protocol) aplica de dos formas distintas:

**Consumir MCP servers externos** (Linear MCP, GitHub MCP, Slack MCP): solo tiene sentido si el agente corre *dentro* de un cliente MCP como Claude Code o Cursor. En nuestra web app con Vercel AI SDK, el agente vive en nuestro servidor — los MCP servers externos no aplican directamente en v1.

**Exponer este agente como MCP server (v2+):** Esta es la jugada real. Convertir el agente en un MCP server permite que los founders lo consulten desde Claude Code, Cursor, o cualquier herramienta AI que ya usen, sin abrir otra app. Eso convierte el agente de producto standalone a infraestructura AI de la agencia.

### Decisión para v1
Mock modules con la misma interfaz que tendrían las APIs reales. El agente no sabe la diferencia. El swap a producción es cambiar el cuerpo de cada función, no la arquitectura.

---

## 11. Modelo de Permisos

```
userId → rol (founder | account_lead)
         ↓
    data layer filtra por clientes asignados

founder → ve todos los clientes
account_lead → ve solo sus cuentas asignadas
```

En v1: userId hardcodeado (mencionado explícitamente en el demo como decisión consciente).  
En v2: Auth con NextAuth o Clerk, permisos heredados del usuario que pregunta.

---

## 12. Tech Stack

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | Next.js 16 App Router + TypeScript | Ya scaffolded, App Router para streaming nativo |
| AI SDK | Vercel AI SDK 4.x | `streamText` + tool calling, streaming a UI trivial |
| LLM | Claude claude-sonnet-4-6 | Mejor reasoning, alineado con JD (Claude Code = plus) |
| UI | Tailwind v4 + shadcn/ui | Ya configurado, componentes rápidos y limpios |
| Data | TypeScript mock modules | Interfaz idéntica a APIs reales, swap sin refactor |
| Deploy | Vercel | Linked al repo, auto-deploy en push, 2 minutos |
| Auth | Ninguna en v1 | userId hardcodeado para el demo |

---

## 13. Demo Script (Live Session)

5 queries que cubren todos los escenarios evaluados:

1. `"¿Cómo va el Cliente A esta semana?"` → respuesta estructurada, muestra source badges
2. `"¿Qué proyectos están en riesgo?"` → detecta Cliente A, explica evidencia
3. `"¿Qué quedó pendiente con Cliente C después de la última reunión?"` → dispara conflict scenario con confidence score
4. `"Prepárame un brief para mi reunión de mañana con Cliente B"` → Calendar + Transcripts + Linear
5. `"¿Qué le prometimos al Cliente D el mes pasado y qué ya entregamos?"` → cross-reference transcripts vs Linear, propone crear task pendiente

---

## 14. Estimado de Implementación

| Tarea | Tiempo |
|-------|--------|
| Setup + shadcn + estructura base | 20 min |
| Mock data layer (4 clientes, 10 fuentes) | 40 min |
| Tool registry + orchestrator + conflict detection | 60 min |
| System prompt + output estructurado | 30 min |
| Chat UI con streaming + source badges | 45 min |
| Confidence indicator + conflict alert UI | 20 min |
| Write-back card (proponer + aprobar) | 20 min |
| Deploy Vercel + smoke test | 15 min |
| Buffer | 10 min |
| **Total** | **~3h 40min** |

---

## 15. Lo que NO hacemos en v1 (y por qué)

- **Auth real**: no hay tiempo y no es lo que evalúan
- **Persistencia de conversaciones**: in-memory es suficiente para el demo
- **Rate limiting / costos**: mencionado en la presentación como v2
- **MCP consumers**: nuestro agente no corre en un cliente MCP
- **APIs reales**: el mock layer demuestra la misma arquitectura sin riesgo de credenciales
