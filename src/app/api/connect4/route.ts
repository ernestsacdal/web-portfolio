import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const COLS = 7
const ROWS = 6

type Board = string[][]

function isValidCol(board: Board, col: number): boolean {
  return col >= 0 && col < COLS && board[0][col] === '.'
}

function dropPiece(board: Board, col: number, color: string): Board | null {
  if (!isValidCol(board, col)) return null
  const next = board.map(r => [...r])
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r][col] === '.') {
      next[r][col] = color
      return next
    }
  }
  return null
}

function checkWin(board: Board, color: string): boolean {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if ([0,1,2,3].every(i => board[r][c+i] === color)) return true
    }
  }
  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      if ([0,1,2,3].every(i => board[r+i][c] === color)) return true
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if ([0,1,2,3].every(i => board[r+i][c+i] === color)) return true
    }
  }
  // Diagonal down-left
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      if ([0,1,2,3].every(i => board[r+i][c-i] === color)) return true
    }
  }
  return false
}

function isBoardFull(board: Board): boolean {
  return board[0].every(cell => cell !== '.')
}

function scoreWindow(window: string[], color: string): number {
  const opp = color === 'R' ? 'Y' : 'R'
  const mine = window.filter(c => c === color).length
  const empty = window.filter(c => c === '.').length
  const theirs = window.filter(c => c === opp).length

  if (mine === 4) return 100
  if (mine === 3 && empty === 1) return 5
  if (mine === 2 && empty === 2) return 2
  if (theirs === 3 && empty === 1) return -4
  return 0
}

function scoreBoard(board: Board, color: string): number {
  let score = 0

  // Center column preference
  const center = board.map(r => r[3]).filter(c => c === color).length
  score += center * 3

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], color)
    }
  }
  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      score += scoreWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], color)
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], color)
    }
  }
  // Diagonal down-left
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      score += scoreWindow([board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]], color)
    }
  }
  return score
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiColor: string
): number {
  const oppColor = aiColor === 'R' ? 'Y' : 'R'
  if (checkWin(board, aiColor)) return 1000000 + depth
  if (checkWin(board, oppColor)) return -1000000 - depth
  if (isBoardFull(board) || depth === 0) return scoreBoard(board, aiColor)

  const validCols = Array.from({ length: COLS }, (_, i) => i).filter(c => isValidCol(board, c))

  if (maximizing) {
    let best = -Infinity
    for (const col of validCols) {
      const next = dropPiece(board, col, aiColor)!
      best = Math.max(best, minimax(next, depth - 1, alpha, beta, false, aiColor))
      alpha = Math.max(alpha, best)
      if (alpha >= beta) break
    }
    return best
  } else {
    let best = Infinity
    for (const col of validCols) {
      const next = dropPiece(board, col, oppColor)!
      best = Math.min(best, minimax(next, depth - 1, alpha, beta, true, aiColor))
      beta = Math.min(beta, best)
      if (alpha >= beta) break
    }
    return best
  }
}

function bestMinimaxCol(board: Board, aiColor: string, depth: number): number {
  const validCols = Array.from({ length: COLS }, (_, i) => i).filter(c => isValidCol(board, c))
  let bestScore = -Infinity
  let bestCol = validCols[Math.floor(validCols.length / 2)]

  for (const col of validCols) {
    const next = dropPiece(board, col, aiColor)!
    const score = minimax(next, depth - 1, -Infinity, Infinity, false, aiColor)
    if (score > bestScore) {
      bestScore = score
      bestCol = col
    }
  }
  return bestCol
}

export async function POST(req: NextRequest) {
  const { board, aiColor } = (await req.json()) as { board: Board; aiColor: string }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    const col = bestMinimaxCol(board, aiColor, 7)
    return NextResponse.json({ col, source: 'minimax' })
  }

  // Board string for Groq prompt
  const boardStr = board.map(row => row.join(' ')).join('\n')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'You are playing Connect 4. Respond with a single integer (0-6) — the column to play. Nothing else.',
          },
          {
            role: 'user',
            content: `You are ${aiColor === 'R' ? 'RED (R)' : 'YELLOW (Y)'}. Board (rows top to bottom, . = empty):\n${boardStr}\nColumns 0-6. Which column do you play?`,
          },
        ],
        max_tokens: 5,
        temperature: 0.2,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const data = await groqRes.json()
    const raw = data?.choices?.[0]?.message?.content?.trim() ?? ''
    const suggested = parseInt(raw, 10)

    // Validate: must be a legal column
    if (!Number.isNaN(suggested) && isValidCol(board, suggested)) {
      // Validate with minimax: check if this move leads to a losing position
      const afterSuggested = dropPiece(board, suggested, aiColor)!
      const oppColor = aiColor === 'R' ? 'Y' : 'R'
      const suggestedScore = minimax(afterSuggested, 5, -Infinity, Infinity, false, aiColor)

      // Get best minimax score for comparison
      const validCols = Array.from({ length: COLS }, (_, i) => i).filter(c => isValidCol(board, c))
      let bestScore = -Infinity
      for (const col of validCols) {
        const next = dropPiece(board, col, aiColor)!
        const s = minimax(next, 5, -Infinity, Infinity, false, aiColor)
        if (s > bestScore) bestScore = s
      }

      // Allow Groq suggestion if it's within a reasonable margin of the best move
      // (not catastrophically worse than minimax best)
      if (suggestedScore >= bestScore - 10) {
        return NextResponse.json({ col: suggested, source: 'groq' })
      }
    }

    // Groq suggested a bad or invalid move — fall through to minimax
  } catch {
    // Timeout or network error — fall through to minimax
  }

  const col = bestMinimaxCol(board, aiColor, 7)
  return NextResponse.json({ col, source: 'minimax' })
}
