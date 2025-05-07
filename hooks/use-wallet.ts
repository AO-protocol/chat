"use client"

import { useState, useEffect, useCallback } from "react"

export function useWallet() {
  const [address, setAddress] = useState<string | undefined>()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAddress(accounts[0])
          }
        } catch (err) {
          console.error("Failed to get accounts", err)
        }
      }
    }

    checkConnection()
  }, [])

  // Handle account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(undefined)
        } else {
          setAddress(accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsConnecting(true)
      setError(null)

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAddress(accounts[0])
      } catch (err) {
        console.error("Failed to connect", err)
        setError(err instanceof Error ? err : new Error("Failed to connect"))
      } finally {
        setIsConnecting(false)
      }
    } else {
      setError(new Error("MetaMask is not installed"))
    }
  }, [])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(undefined)
  }, [])

  return {
    address,
    isConnecting,
    error,
    connect,
    disconnect,
  }
}

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, listener: (...args: any[]) => void) => void
      removeListener: (event: string, listener: (...args: any[]) => void) => void
    }
  }
}
