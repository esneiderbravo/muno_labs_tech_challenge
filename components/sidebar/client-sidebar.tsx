// components/sidebar/client-sidebar.tsx — STUB, will be replaced in Task 13
'use client'
import type { ClientId } from '@/lib/types'

interface ClientSidebarProps {
  selectedClientId: ClientId | 'all'
  onSelectClient: (id: ClientId | 'all') => void
}

export function ClientSidebar({ selectedClientId, onSelectClient }: ClientSidebarProps) {
  return <div className="w-56 shrink-0 border-r border-zinc-200 bg-white p-2 text-xs text-zinc-400">Sidebar</div>
}
