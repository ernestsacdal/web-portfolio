import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-0',
      max_tokens: 300,
      system: `You are Ernest's friendly portfolio assistant.
Ernest Sacdal is a Full-Stack Developer & AI Engineer based in Sydney, Australia.
He is studying a Master of Information Technology at Crown Institute of Higher Education (CIHE).
Tech stack: FastAPI, Next.js, Python, Docker, React, TypeScript, LangChain, Claude API, PostgreSQL.
Flagship project: PreTriage — an AI-powered patient pre-triage system.
He is available for project collaborations, freelance work, and full-time roles (Full-Stack, AI/ML, Backend).
Keep replies warm, concise, and professional. Maximum 2-3 sentences per response.`,
      messages,
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply: text })
  } catch (error) {
    console.error('[/api/chat]', error)
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
