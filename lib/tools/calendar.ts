// lib/tools/calendar.ts
import { getClient } from '@/lib/data'
import type { ClientId, CalendarEvent } from '@/lib/types'

/**
 * Fetch calendar events for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Calendar events associated with the client.
 */
export function getCalendarEvents(clientId: ClientId): CalendarEvent[] {
  return getClient(clientId).calendarEvents
}
