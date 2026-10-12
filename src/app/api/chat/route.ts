import { NextRequest } from 'next/server'
import Groq from 'groq-sdk'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'
import { estimateTokens, retrieve } from '@/lib/mikhai/knowledge'
import { contextMessage, staticSystemPrompt } from '@/lib/mikhai/prompt'

export const dynamic = 'force-dynamic'

// Groq retired llama-3.3-70b-versatile on 2026-08-16. Check
// console.groq.com/docs/deprecations before changing models. Each model has
// its own free-tier rate-limit bucket, so the second is a real fallback.
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'] as const

// Budget for Groq's free tier (8K tokens/min). See the Phase 20 notes in CLAUDE.md.
const MAX_MESSAGES = 6
const MAX_USER_CHARS = 1000
const MAX_ASSISTANT_CHARS = 2000
const HISTORY_CHAR_BUDGET = 3200 // ~800 tokens of prior turns
const CONTEXT_TOKEN_BUDGET = 1800
const MAX_OUTPUT_TOKENS = 400

type Turn = { role: 'user' | 'assistant'; content: string }

/**
 * Only user/assistant turns with string content are accepted — a client must
 * never be able to inject a system message. Returns null on anything else.
 */
function parseTurns(raw: unknown): Turn[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const turns: Turn[] = []
  for (const m of raw) {
    if (typeof m !== 'object' || m === null) return null
    const { role, content } = m as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const text = content.trim().slice(0, role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS)
    if (text) turns.push({ role, content: text })
  }
  const recent = turns.slice(-MAX_MESSAGES)
  if (recent.at(-1)?.role !== 'user') return null

  // Drop the oldest prior turns until the history fits its budget
  const question = recent[recent.length - 1]
  const history = recent.slice(0, -1)
  while (history.length && history.reduce((n, t) => n + t.content.length, 0) > HISTORY_CHAR_BUDGET) history.shift()
  return [...history, question]
}

let client: Groq | null = null
function groq(): Groq {
  // Built lazily so a missing key fails the request, not the build.
  // No SDK retries: a 429 should fall through to the next model immediately.
  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 0, timeout: 20_000 })
  return client
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const turns = parseTurns((body as { messages?: unknown } | null)?.messages)
  if (!turns) {
    return Response.json({ error: 'Expected { messages: [{ role: "user" | "assistant", content: string }] } ending with a user message' }, { status: 400 })
  }

  const question = turns[turns.length - 1].content
  const previousQuestion = turns.slice(0, -1).filter(t => t.role === 'user').at(-1)?.content
  const chunks = retrieve(question, previousQuestion, CONTEXT_TOKEN_BUDGET)

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: staticSystemPrompt() },
    ...turns.slice(0, -1),
    { role: 'system', content: await contextMessage(chunks) },
    { role: 'user', content: question },
  ]

  // Open the completion before the stream exists, so an upstream failure is a
  // proper JSON error with the real reason in the logs — not an aborted stream.
  let opened: { stream: AsyncIterable<Groq.Chat.Completions.ChatCompletionChunk>; model: string } | null = null
  for (const model of MODELS) {
    try {
      const { data, response } = await groq()
        .chat.completions.create({
          model,
          reasoning_effort: 'low',
          include_reasoning: false,
          max_tokens: MAX_OUTPUT_TOKENS,
          stream: true,
          messages,
        })
        .withResponse()
      console.log('[/api/chat] open', JSON.stringify({
        model,
        sources: chunks.map(c => c.id),
        estPromptTokens: messages.reduce((n, m) => n + estimateTokens(String(m.content)), 0),
        remainingTokensPerMin: response.headers.get('x-ratelimit-remaining-tokens'),
        remainingRequestsPerDay: response.headers.get('x-ratelimit-remaining-requests'),
      }))
      opened = { stream: data, model }
      break
    } catch (error) {
      if (error instanceof Groq.RateLimitError) {
        console.warn(`[/api/chat] rate limited on ${model}`)
        continue
      }
      console.error('[/api/chat] upstream error:', error)
      return Response.json({ error: 'Upstream model error' }, { status: 502 })
    }
  }
  if (!opened) {
    return Response.json({ error: 'busy' }, { status: 429 })
  }

  const { stream: completion, model } = opened
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content
          if (text) controller.enqueue(encoder.encode(text))
          const usage = chunk.x_groq?.usage
          if (usage) console.log('[/api/chat] usage', JSON.stringify({ model, ...usage }))
        }
        controller.close()
      } catch (err) {
        console.error('[/api/chat] stream error:', err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
