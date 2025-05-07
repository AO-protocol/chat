"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { truncateAddress } from "@/lib/utils"

interface HeaderProps {
  address?: string
  isConnecting: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export default function Header({ address, isConnecting, onConnect, onDisconnect }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { setOpenMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" onClick={() => setOpenMobile(true)} />
        <h1 className="text-xl font-bold truncate">AI Chat</h1>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {address ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground md:inline-block whitespace-nowrap">Connected as</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 truncate max-w-[140px] md:max-w-none"
              onClick={onDisconnect}
            >
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
              <span className="truncate">{truncateAddress(address)}</span>
            </Button>
          </div>
        ) : (
          <Button onClick={onConnect} disabled={isConnecting} size="sm" className="h-8 whitespace-nowrap">
            {isConnecting ? (
              <>
                <Skeleton className="mr-2 h-4 w-4 rounded-full flex-shrink-0" />
                <span className="truncate">Connecting...</span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
