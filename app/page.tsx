"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import ChatInterface from "@/components/chat-interface"
import Header from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useWallet } from "@/hooks/use-wallet"
import { ChatProvider } from "@/contexts/chat-context"

export default function Home() {
  const { theme } = useTheme()
  const { address, isConnecting, connect, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <SidebarProvider defaultOpen={true}>
      <ChatProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar address={address} />
          <div className="flex flex-1 flex-col">
            <Header address={address} isConnecting={isConnecting} onConnect={connect} onDisconnect={disconnect} />
            <ChatInterface />
          </div>
        </div>
      </ChatProvider>
    </SidebarProvider>
  )
}
