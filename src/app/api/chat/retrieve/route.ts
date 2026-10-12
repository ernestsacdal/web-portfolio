import { NextRequest } from 'next/server'
import { estimateTokens, getKnowledge, retrieve } from '@/lib/mikhai/knowledge'
import { staticSystemPrompt } from '@/lib/mikhai/prompt'

export const dynamic = 'force-dynamic'

/**
 * Dev-only: what Mikhai would retrieve for a question. 404s in production.
 * GET /api/chat/retrieve?q=<question>[&prev=<previous question>][&budget=1800]
 * Used by scripts/eval-retrieval.mjs and for debugging answers.
 */
export function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') return new Response(null, { status: 404 })
  const q = req.nextUrl.searchParams.get('q') ?? ''
  const prev = req.nextUrl.searchParams.get('prev') ?? undefined
  const budget = Number(req.nextUrl.searchParams.get('budget') ?? 1800)
  const chunks = retrieve(q, prev, budget)
  const k = getKnowledge()
  return Response.json({
    question: q,
    staticPromptTokens: estimateTokens(staticSystemPrompt()),
    knowledge: { chunks: k.chunks.length, totalTokens: k.chunks.reduce((n, c) => n + c.tokens, 0) },
    contextTokens: chunks.reduce((n, c) => n + c.tokens, 0),
    results: chunks.map(c => ({ id: c.id, section: `${c.doc} › ${c.section}`, url: c.url, score: +c.score.toFixed(2), tokens: c.tokens })),
  })
}
