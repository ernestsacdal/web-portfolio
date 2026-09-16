import { NextRequest, NextResponse } from 'next/server'
import { bestMove, isBoard, type Cell } from '@/lib/connect4'

export const dynamic = 'force-dynamic'

/** Search budget per move. Well inside the Hobby-plan function limit. */
const BUDGET_MS = 800

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { board, aiColor } = (body ?? {}) as { board?: unknown; aiColor?: unknown }
  if (!isBoard(board) || (aiColor !== 'R' && aiColor !== 'Y')) {
    return NextResponse.json({ error: 'Expected { board: Cell[6][7], aiColor: "R" | "Y" }' }, { status: 400 })
  }

  const result = bestMove(board, aiColor as Cell, BUDGET_MS)
  if (result.col < 0) {
    return NextResponse.json({ error: 'No legal move' }, { status: 400 })
  }

  return NextResponse.json({ ...result, ms: Math.round(result.ms), source: 'engine' })
}
