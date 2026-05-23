import { describe, expect, it } from 'vitest'
import { getClient } from '@/lib/data'
import { getLinearTasks } from '@/lib/tools/linear'
import { getSlackMessages } from '@/lib/tools/slack'
import { getMeetingTranscripts } from '@/lib/tools/transcripts'
import { getNotionDocs } from '@/lib/tools/notion'
import { getCalendarEvents } from '@/lib/tools/calendar'
import { getDriveFiles } from '@/lib/tools/drive'
import { getGithubActivity } from '@/lib/tools/github'
import { getObsidianNotes } from '@/lib/tools/obsidian'
import { getPosthogMetrics } from '@/lib/tools/posthog'
import { getWhatsappMessages } from '@/lib/tools/whatsapp'
import type { ClientId } from '@/lib/types'

const TOOL_CASES = [
  { name: 'getLinearTasks', run: getLinearTasks, key: 'linearTasks' as const },
  { name: 'getSlackMessages', run: getSlackMessages, key: 'slackMessages' as const },
  { name: 'getMeetingTranscripts', run: getMeetingTranscripts, key: 'meetingTranscripts' as const },
  { name: 'getNotionDocs', run: getNotionDocs, key: 'notionDocs' as const },
  { name: 'getCalendarEvents', run: getCalendarEvents, key: 'calendarEvents' as const },
  { name: 'getDriveFiles', run: getDriveFiles, key: 'driveFiles' as const },
  { name: 'getGithubActivity', run: getGithubActivity, key: 'githubActivity' as const },
  { name: 'getObsidianNotes', run: getObsidianNotes, key: 'obsidianNotes' as const },
  { name: 'getPosthogMetrics', run: getPosthogMetrics, key: 'posthogMetrics' as const },
  { name: 'getWhatsappMessages', run: getWhatsappMessages, key: 'whatsappMessages' as const },
]

const CLIENT_IDS: ClientId[] = [
  'vivamart',
  'clarix',
  'cornerstone',
  'paylane',
  'bloom',
  'draftly',
  'metrify',
  'nexova',
  'solara',
  'trackflow',
]

describe('tool wrappers', () => {
  it.each(TOOL_CASES)('returns %s data from client registry', ({ run, key }) => {
    const client = getClient('clarix')
    expect(run('clarix')).toEqual(client[key])
  })

  it('resolves all tool outputs for every configured client', () => {
    for (const clientId of CLIENT_IDS) {
      const client = getClient(clientId)
      for (const toolCase of TOOL_CASES) {
        expect(toolCase.run(clientId)).toEqual(client[toolCase.key])
      }
    }
  })
})

