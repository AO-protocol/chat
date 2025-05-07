"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Plus, MessageSquarePlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useChat } from "@/contexts/chat-context"

interface SidebarProps {
  address?: string
}

export function Sidebar({ address }: SidebarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useSidebar()
  const { sessions, currentSessionId, createNewSession, setCurrentSessionId } = useChat()

  // Simulate loading state when address changes
  useEffect(() => {
    if (address) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [address])

  const handleNewChat = () => {
    createNewSession()
  }

  return (
    <SidebarComponent variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold truncate">Chat History</h2>
          <Button variant="ghost" size="icon" disabled={!address} className="flex-shrink-0" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {!address ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">Connect your wallet to see your chat history</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 p-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <MessageSquarePlus className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium">No chats yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Start a new conversation by clicking the + button</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleNewChat}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        ) : (
          <SidebarMenu>
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  asChild
                  isActive={session.id === currentSessionId}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <button className="w-full text-left">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{session.title}</span>
                        <span className="flex items-center text-xs text-muted-foreground whitespace-nowrap ml-2">
                          <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                          {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {session.messages.length > 0 ? `${session.messages.length} messages` : "No messages yet"}
                      </p>
                    </div>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  )
}
