// app/page.tsx
import { ChatContainer } from '@/components/chat/chat-container'

export default function Home() {
  return (
    <main className="flex-1 flex overflow-hidden">
      <ChatContainer />
    </main>
  )
}
