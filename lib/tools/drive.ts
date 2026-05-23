// lib/tools/drive.ts
import { getClient } from '@/lib/data'
import type { ClientId, DriveFile } from '@/lib/types'

/**
 * Fetch Drive files for a client from the demo datastore.
 *
 * @param clientId - Client identifier to read from.
 * @returns Drive file metadata associated with the client.
 */
export function getDriveFiles(clientId: ClientId): DriveFile[] {
  return getClient(clientId).driveFiles
}
