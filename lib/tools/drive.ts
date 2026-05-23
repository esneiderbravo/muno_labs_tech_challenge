// lib/tools/drive.ts
import { getClient } from '@/lib/data'
import type { ClientId, DriveFile } from '@/lib/types'

export function getDriveFiles(clientId: ClientId): DriveFile[] {
  return getClient(clientId).driveFiles
}
