export interface WalrusMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

export interface WalrusSession {
  id: string
  userId: string
  messages: WalrusMessage[]
  createdAt: number
  updatedAt: number
}

export interface WalrusUser {
  id: string
  address: string
  sessions: string[] // Session IDs
}
