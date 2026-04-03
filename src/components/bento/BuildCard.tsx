'use client'

import { useState, useCallback, useEffect } from 'react'
import { emitLog } from '@/lib/logEvents'

const COLS = 7
const ROWS = 6
const CELL = 30
const GAP = 3
const AI_COLOR = 'R' as const
const HUMAN_COLOR = 'Y' as const
const HUMAN_HEX = '#0A84FF'
const AI_HEX = '#FF453A'

type Cell = '.' | 'Y' | 'R'
type Board = Cell[][]
type Status = 'playing' | 'human_win' | 'ai_win' | 'draw'

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill('.') as Cell[])
}

function dropPiece(board: Board, col: number, color: Cell): Board | null {
  if (board[0][col] !== '.') return null
  const next = board.map(r => [...r]) as Board
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r][col] === '.') { next[r][col] = color; return next }
  }
  return null
}

function checkWin(board: Board, color: Cell): number[][] | null {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        const cells: number[][] = []
        for (let i = 0; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break
          if (board[nr][nc] !== color) break
          cells.push([nr, nc])
        }
        if (cells.length === 4) return cells
      }
    }
  }
  return null
}

function isBoardFull(board: Board): boolean {
  return board[0].every(cell => cell !== '.')
}

function scoreWindow(window: Cell[], color: Cell): number {
  const opp = color === 'R' ? 'Y' : 'R' as Cell
  const mine = window.filter(c => c === color).length
  const empty = window.filter(c => c === '.').length
  const theirs = window.filter(c => c === opp).length
  if (mine === 4) return 100
  if (mine === 3 && empty === 1) return 5
  if (mine === 2 && empty === 2) return 2
  if (theirs === 3 && empty === 1) return -4
  return 0
}

function scoreBoard(board: Board, color: Cell): number {
  let score = board.map(r => r[3]).filter(c => c === color).length * 3
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]], color)
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c < COLS; c++)
      score += scoreWindow([board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]], color)
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]], color)
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 3; c < COLS; c++)
      score += scoreWindow([board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3]], color)
  return score
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean, aiColor: Cell): number {
  const opp = aiColor === 'R' ? 'Y' : 'R' as Cell
  if (checkWin(board, aiColor)) return 1000000 + depth
  if (checkWin(board, opp)) return -1000000 - depth
  if (isBoardFull(board) || depth === 0) return scoreBoard(board, aiColor)
  const validCols = Array.from({ length: COLS }, (_, i) => i).filter(c => board[0][c] === '.')
  if (maximizing) {
    let best = -Infinity
    for (const col of validCols) {
      best = Math.max(best, minimax(dropPiece(board, col, aiColor)!, depth - 1, alpha, beta, false, aiColor))
      alpha = Math.max(alpha, best)
      if (alpha >= beta) break
    }
    return best
  } else {
    let best = Infinity
    for (const col of validCols) {
      best = Math.min(best, minimax(dropPiece(board, col, opp)!, depth - 1, alpha, beta, true, aiColor))
      beta = Math.min(beta, best)
      if (alpha >= beta) break
    }
    return best
  }
}

function localBestCol(board: Board, aiColor: Cell): number {
  const validCols = Array.from({ length: COLS }, (_, i) => i).filter(c => board[0][c] === '.')
  let bestScore = -Infinity
  let bestCol = validCols[Math.floor(validCols.length / 2)]
  for (const col of validCols) {
    const score = minimax(dropPiece(board, col, aiColor)!, 6, -Infinity, Infinity, false, aiColor)
    if (score > bestScore) { bestScore = score; bestCol = col }
  }
  return bestCol
}

// ─── Start Screen ──────────────────────────────────────────────────────────────
function StartScreen({ onPlay }: { onPlay: () => void }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    }}>
      {/* Decorative dots */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[AI_HEX, HUMAN_HEX, AI_HEX, HUMAN_HEX].map((bg, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: bg, display: 'block' }} />
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
          Connect 4
        </p>
        <p style={{ fontSize: 10, color: 'var(--text2)', margin: '3px 0 0', letterSpacing: '0.02em' }}>
          Human vs Hybrid AI
        </p>
      </div>

      {/* Play button */}
      <button
        onClick={onPlay}
        style={{
          marginTop: 4,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: HUMAN_HEX,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 16px ${HUMAN_HEX}55`,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={e => {
          ; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'
            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${HUMAN_HEX}77`
        }}
        onMouseLeave={e => {
          ; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${HUMAN_HEX}55`
        }}
      >
        {/* Play triangle */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2L12 7L3 12V2Z" fill="white" />
        </svg>
      </button>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function BuildCard() {
  const [started, setStarted] = useState(false)
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [status, setStatus] = useState<Status>('playing')
  const [winCells, setWinCells] = useState<number[][]>([])
  const [aiThinking, setAiThinking] = useState(false)
  const [hoverCol, setHoverCol] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [isHumanTurn, setIsHumanTurn] = useState(true)

  const resolveStatus = useCallback((b: Board): { status: Status; winCells: number[][] } => {
    const hw = checkWin(b, HUMAN_COLOR)
    if (hw) return { status: 'human_win', winCells: hw }
    const aw = checkWin(b, AI_COLOR)
    if (aw) return { status: 'ai_win', winCells: aw }
    if (isBoardFull(b)) return { status: 'draw', winCells: [] }
    return { status: 'playing', winCells: [] }
  }, [])

  const triggerAiMove = useCallback(async (b: Board) => {
    setAiThinking(true)
    const startTime = Date.now()
    emitLog({ type: 'api:start', path: '/connect4', method: 'POST' })
    try {
      const res = await fetch('/api/connect4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: b, aiColor: AI_COLOR }),
      })
      const { col } = await res.json() as { col: number }
      emitLog({ type: 'api:done', path: '/connect4', status: 200, latencyMs: Date.now() - startTime, aiCol: col })
      const next = dropPiece(b, col, AI_COLOR)
      if (!next) return
      const resolved = resolveStatus(next)
      setBoard(next); setStatus(resolved.status); setWinCells(resolved.winCells)
      if (resolved.status !== 'playing') emitLog({ type: 'game:end', winner: resolved.status })
      if (resolved.status === 'playing') setIsHumanTurn(true)
    } catch {
      const col = localBestCol(b, AI_COLOR)
      emitLog({ type: 'api:done', path: '/connect4', status: 0, latencyMs: Date.now() - startTime, aiCol: col, fallback: true })
      const next = dropPiece(b, col, AI_COLOR)
      if (!next) return
      const resolved = resolveStatus(next)
      setBoard(next); setStatus(resolved.status); setWinCells(resolved.winCells)
      if (resolved.status !== 'playing') emitLog({ type: 'game:end', winner: resolved.status })
      if (resolved.status === 'playing') setIsHumanTurn(true)
    } finally {
      setAiThinking(false)
    }
  }, [resolveStatus])

  const handleColClick = useCallback((col: number) => {
    if (!isHumanTurn || status !== 'playing' || aiThinking) return
    const next = dropPiece(board, col, HUMAN_COLOR)
    if (!next) return
    const resolved = resolveStatus(next)
    setBoard(next); setStatus(resolved.status); setWinCells(resolved.winCells)
    emitLog({ type: 'game:move', player: 'human', col })
    if (resolved.status !== 'playing') emitLog({ type: 'game:end', winner: resolved.status })
    if (resolved.status === 'playing') setIsHumanTurn(false)
  }, [board, isHumanTurn, status, aiThinking, resolveStatus])

  useEffect(() => {
    if (started && !isHumanTurn && status === 'playing') triggerAiMove(board)
  }, [started, isHumanTurn, status, board, triggerAiMove])

  function reset() {
    setBoard(emptyBoard()); setStatus('playing'); setWinCells([])
    setAiThinking(false); setIsHumanTurn(true); setShowInfo(false)
    setStarted(false)
  }

  function cellBg(cell: Cell, r: number, c: number): string {
    const isWin = winCells.some(([wr, wc]) => wr === r && wc === c)
    if (cell === HUMAN_COLOR) return isWin ? '#38A5FF' : HUMAN_HEX
    if (cell === AI_COLOR) return isWin ? '#FF6B61' : AI_HEX
    if (hoverCol === c && isHumanTurn && status === 'playing' && !aiThinking)
      return 'var(--bg)'
    return 'var(--bg3)'
  }

  const statusText =
    aiThinking ? 'AI thinking\u2026' :
      status === 'human_win' ? 'You win! \uD83C\uDF89' :
        status === 'ai_win' ? 'AI wins.' :
          status === 'draw' ? 'Draw.' :
            isHumanTurn ? 'Your turn' : ''

  const statusClr =
    status === 'human_win' ? HUMAN_HEX :
      status === 'ai_win' ? AI_HEX :
        'var(--text2)'

  const boardW = COLS * CELL + (COLS - 1) * GAP
  const boardH = ROWS * CELL + (ROWS - 1) * GAP

  return (
    <div
      className="bento-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, minHeight: 22 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: statusClr, letterSpacing: '0.01em' }}>
          {started ? statusText : '\u00A0'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {started && (
            <button
              onClick={() => setShowInfo(v => !v)}
              title="About the AI"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text2)', padding: '0 2px', lineHeight: 1, opacity: 0.6 }}
            >ⓘ</button>
          )}
          {started && (
            <button
              onClick={reset}
              title="Restart"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text2)', padding: '0 2px', lineHeight: 1 }}
            >↺</button>
          )}
        </div>
      </div>

      {/* ── Body: start screen OR board ── */}
      {!started ? (
        <StartScreen onPlay={() => { setStarted(true); emitLog({ type: 'game:start' }) }} />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`, gap: GAP, width: boardW, height: boardH }}
            onMouseLeave={() => setHoverCol(null)}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isWinCell = winCells.some(([wr, wc]) => wr === r && wc === c)
                const canClick = isHumanTurn && status === 'playing' && !aiThinking
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleColClick(c)}
                    onMouseEnter={() => setHoverCol(c)}
                    style={{
                      width: CELL, height: CELL,
                      borderRadius: '50%',
                      background: cellBg(cell, r, c),
                      cursor: canClick ? (board[0][c] !== '.' ? 'not-allowed' : 'pointer') : 'default',
                      transition: 'background 0.12s ease',
                      animation: isWinCell ? 'winPulse 0.55s ease-in-out infinite alternate' : 'none',
                    }}
                  />
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ── Legend / Footer ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, minHeight: 20, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: HUMAN_HEX, display: 'inline-block', boxShadow: `0 0 6px ${HUMAN_HEX}88` }} />
            <span style={{ fontSize: 10, color: 'var(--text2)' }}>You</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: AI_HEX, display: 'inline-block', boxShadow: `0 0 6px ${AI_HEX}88` }} />
            <span style={{ fontSize: 10, color: 'var(--text2)' }}>AI</span>
          </span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text2)', opacity: 0.5, letterSpacing: '0.04em' }}>
          CONNECT 4
        </span>
      </div>

      {/* ── Info overlay ── */}
      {showInfo && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--bg2)',
          borderRadius: '1.25rem',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '16px 18px', gap: 12, zIndex: 10,
        }}>
          {/* How to play */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              How to Play
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                ['Click a column', 'to drop your disc'],
                ['Pieces fall', 'to the lowest empty row'],
                ['Connect 4', 'horizontally, vertically, or diagonally'],
                ['First to 4', 'wins — board full = draw'],
              ].map(([bold, rest]) => (
                <li key={bold} style={{ fontSize: 10, color: 'var(--text2)', lineHeight: 1.4 }}>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{bold}</span> {rest}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', flexShrink: 0 }} />

          {/* About the AI */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              Hybrid AI Engine
            </p>
            <p style={{ fontSize: 10, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
              <span style={{ color: HUMAN_HEX, fontWeight: 600 }}>LLM</span> suggests strategic moves.{' '}
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Minimax depth&nbsp;7</span> validates every suggestion — blunders are overridden. Good luck.
            </p>
          </div>

          <button
            onClick={() => setShowInfo(false)}
            style={{
              fontSize: 11, color: 'white',
              background: HUMAN_HEX,
              border: 'none', borderRadius: 8,
              padding: '5px 14px', cursor: 'pointer',
              fontWeight: 500, alignSelf: 'flex-start',
            }}
          >Got it</button>
        </div>
      )}

      <style>{`
        @keyframes winPulse {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0.65; transform: scale(0.88); }
        }
      `}</style>
    </div>
  )
}
