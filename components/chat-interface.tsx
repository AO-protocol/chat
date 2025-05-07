"use client"

import type React from "react"
import { useRef, useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { AnimatePresence, motion } from "framer-motion"
import { useChat } from "@/contexts/chat-context"
import { nanoid } from "nanoid"

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { currentSessionId, addMessageToCurrentSession, getCurrentSession } = useChat()

  const currentSession = getCurrentSession()
  const messages = currentSession?.messages || []

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      formRef.current?.requestSubmit()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() || isLoading || !currentSessionId) return

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: input,
    }

    addMessageToCurrentSession(userMessage)
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response after a delay
      setTimeout(() => {
        const aiMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: `This is a simulated response to: "${input}"`,
        }
        addMessageToCurrentSession(aiMessage)
        setIsLoading(false)
      }, 1000)

      // In a real implementation, you would call your API here
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: input,
      //     sessionId: currentSessionId
      //   }),
      // })
      // const data = await response.json()
      // addMessageToCurrentSession(data.message)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-6 pb-24">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center pt-20">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Welcome to AI Chat</h2>
                <p className="text-muted-foreground">Start a conversation by typing a message below.</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <div className="prose dark:prose-invert">{message.content}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background p-4 w-full">
        <form ref={formRef} onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="min-h-12 resize-none"
            disabled={isLoading || !currentSessionId}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !currentSessionId}
            className="flex-shrink-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
