// lib/tools/calendar.ts
import { getClient } from '@/lib/data'
import type { ClientId, CalendarEvent } from '@/lib/types'

export function getCalendarEvents(clientId: ClientId): CalendarEvent[] {
  return getClient(clientId).calendarEvents
}
