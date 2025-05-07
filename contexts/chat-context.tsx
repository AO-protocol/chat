"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { nanoid } from "nanoid"
import type { Message } from "ai"

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatContextType {
  sessions: ChatSession[]
  currentSessionId: string | null
  createNewSession: () => void
  setCurrentSessionId: (id: string) => void
  addMessageToCurrentSession: (message: Message) => void
  getCurrentSession: () => ChatSession | undefined
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Generate a title based on the first few messages
  const generateSessionTitle = (messages: Message[]): string => {
    if (messages.length === 0) return "New Chat"

    // Find the first user message
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (!firstUserMessage) return "New Chat"

    // Use the first 30 characters of the user message as the title
    const title = firstUserMessage.content.substring(0, 30)
    return title.length < firstUserMessage.content.length ? `${title}...` : title
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: nanoid(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
  }

  const addMessageToCurrentSession = (message: Message) => {
    if (!currentSessionId) return

    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id === currentSessionId) {
          const updatedMessages = [...session.messages, message]
          return {
            ...session,
            messages: updatedMessages,
            title:
              session.messages.length === 0 && message.role === "user"
                ? generateSessionTitle([message])
                : session.title,
            updatedAt: new Date(),
          }
        }
        return session
      })
    })
  }

  const getCurrentSession = () => {
    return sessions.find((session) => session.id === currentSessionId)
  }

  // Create a default session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession()
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        createNewSession,
        setCurrentSessionId,
        addMessageToCurrentSession,
        getCurrentSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
