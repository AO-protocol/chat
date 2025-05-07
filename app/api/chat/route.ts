import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Simulate storing messages in Walrus
  // In a real implementation, you would store messages using Walrus SDK
  console.log("Storing messages in Walrus...")

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}
