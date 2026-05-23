// app/page.tsx
import { ChatContainer } from '@/components/chat/chat-container'

export default function Home() {
  return (
    <main className="flex flex-1 overflow-hidden">
      <ChatContainer />
    </main>
  )
}
