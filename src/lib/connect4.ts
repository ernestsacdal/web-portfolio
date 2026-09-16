/**
 * Connect 4 engine — minimax (negamax form) with alpha-beta pruning,
 * iterative deepening on a time budget, and a Zobrist-keyed transposition
 * table. Pure TypeScript: no React, no fs, importable from the API route and
 * the client alike.
 *
 * Board wire format is the same `Cell[][]` the UI uses: 6 rows × 7 cols,
 * row 0 at the top, pieces fall to the highest-index empty row.
 */

export type Cell = '.' | 'Y' | 'R'
export type Board = Cell[][]

export interface SearchResult {
  /** Column to play, 0–6. -1 only if the board has no legal move. */
  col: number
  /** Deepest ply fully searched before the budget ran out. */
  depth: number
  nodes: number
  ms: number
  /** Set when the search proved the outcome from this position. */
  forced?: 'win' | 'loss' | 'draw'
  /** Set when the move was dictated without a search: the only block of an opponent win-in-1. */
  reason?: 'block'
}

export const COLS = 7
export const ROWS = 6
const N = COLS * ROWS

/** Centre-first — the single biggest alpha-beta win in Connect 4. */
const ORDER = [3, 2, 4, 1, 5, 0, 6]

const WIN = 100_000
/** Any |score| above this is a proven forced result, not a heuristic. */
const FORCED = WIN - N

const idx = (r: number, c: number): number => r * COLS + c

// ─── Position state ─────────────────────────────────────────────────────────
// Module-level scratch. bestMove() is synchronous and fully resets it, so this
// is safe as long as it is never called re-entrantly.

/** 0 empty · +1 the AI (root side to move) · -1 the opponent */
const cells = new Int8Array(N)
/** Pieces stacked in each column, 0–6. Landing row = ROWS - 1 - height. */
const height = new Uint8Array(COLS)
let moveCount = 0
/** Whether the AI made the first move of the game (decides threat parity). */
let aiIsFirst = false

let nodes = 0
let deadline = 0
let aborted = false

// ─── All 69 four-in-a-row windows, flattened ────────────────────────────────
const WINDOW_COUNT = 69
const WINDOW_CELLS = new Int8Array(WINDOW_COUNT * 4)
{
  let w = 0
  const push = (a: number, b: number, c: number, d: number) => {
    WINDOW_CELLS[w++] = a; WINDOW_CELLS[w++] = b; WINDOW_CELLS[w++] = c; WINDOW_CELLS[w++] = d
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 3 < COLS) push(idx(r, c), idx(r, c + 1), idx(r, c + 2), idx(r, c + 3))
      if (r + 3 < ROWS) push(idx(r, c), idx(r + 1, c), idx(r + 2, c), idx(r + 3, c))
      if (r + 3 < ROWS && c + 3 < COLS) push(idx(r, c), idx(r + 1, c + 1), idx(r + 2, c + 2), idx(r + 3, c + 3))
      if (r + 3 < ROWS && c - 3 >= 0) push(idx(r, c), idx(r + 1, c - 1), idx(r + 2, c - 2), idx(r + 3, c - 3))
    }
  }
}

// ─── Positional weights ─────────────────────────────────────────────────────
// How many of the 69 windows pass through each cell (3 at the corners, 13 in
// the centre of the middle rows), halved. Values the centre without rewarding
// piling one column to the ceiling, and values low cells in adjacent columns.
const POS_WEIGHT = new Float32Array(N)
for (let w = 0; w < WINDOW_COUNT * 4; w++) POS_WEIGHT[WINDOW_CELLS[w]] += 0.5

// ─── Zobrist hashing ────────────────────────────────────────────────────────
// Two independent 26-bit hashes combined into one exactly-representable
// 52-bit Number key — avoids BigInt and avoids string keys.

const HASH_BITS = 26
const HASH_MASK = (1 << HASH_BITS) - 1
const HASH_HI_MULT = 1 << HASH_BITS
const ZOB_LO = new Int32Array(N * 2)
const ZOB_HI = new Int32Array(N * 2)
{
  // Deterministic xorshift32 so the table is identical on every load.
  let s = 0x9e3779b9
  const next = (): number => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return (s >>> 0) & HASH_MASK
  }
  for (let i = 0; i < N * 2; i++) { ZOB_LO[i] = next(); ZOB_HI[i] = next() }
}
let hashLo = 0
let hashHi = 0

/** Index into the Zobrist tables for a cell holding `p` (+1 or -1). */
const zob = (cell: number, p: number): number => cell * 2 + (p === 1 ? 0 : 1)

// ─── Transposition table ────────────────────────────────────────────────────
// Fixed-size, always-replace. Key stored as key+1 so 0 means "empty slot".
// Data packed into one int32: score << 8 | depth << 2 | flag.

const TT_BITS = 18
const TT_SIZE = 1 << TT_BITS
const TT_MASK = TT_SIZE - 1
const ttKey = new Float64Array(TT_SIZE)
const ttData = new Int32Array(TT_SIZE)
const EXACT = 0
const LOWER = 1
const UPPER = 2

/** Per-ply move buffers so move generation never allocates. */
const moveBuf: Int8Array[] = Array.from({ length: N + 1 }, () => new Int8Array(COLS))

// ─── Make / unmake ──────────────────────────────────────────────────────────

function make(c: number, p: number): number {
  const r = ROWS - 1 - height[c]
  const cell = idx(r, c)
  cells[cell] = p
  height[c]++
  moveCount++
  const z = zob(cell, p)
  hashLo ^= ZOB_LO[z]
  hashHi ^= ZOB_HI[z]
  return r
}

function unmake(c: number, r: number, p: number): void {
  const cell = idx(r, c)
  cells[cell] = 0
  height[c]--
  moveCount--
  const z = zob(cell, p)
  hashLo ^= ZOB_LO[z]
  hashHi ^= ZOB_HI[z]
}

/**
 * Would a piece of `p` dropped at (r, c) complete four? Walks outward in the
 * four line directions from the landing cell; the cell itself need not be set.
 */
function wouldWin(r: number, c: number, p: number): boolean {
  // horizontal
  let n = 1
  for (let cc = c - 1; cc >= 0 && cells[idx(r, cc)] === p; cc--) n++
  for (let cc = c + 1; cc < COLS && cells[idx(r, cc)] === p; cc++) n++
  if (n >= 4) return true
  // vertical — only downward can have pieces
  n = 1
  for (let rr = r + 1; rr < ROWS && cells[idx(rr, c)] === p; rr++) n++
  if (n >= 4) return true
  // diagonal ↘
  n = 1
  for (let rr = r - 1, cc = c - 1; rr >= 0 && cc >= 0 && cells[idx(rr, cc)] === p; rr--, cc--) n++
  for (let rr = r + 1, cc = c + 1; rr < ROWS && cc < COLS && cells[idx(rr, cc)] === p; rr++, cc++) n++
  if (n >= 4) return true
  // diagonal ↙
  n = 1
  for (let rr = r - 1, cc = c + 1; rr >= 0 && cc < COLS && cells[idx(rr, cc)] === p; rr--, cc++) n++
  for (let rr = r + 1, cc = c - 1; rr < ROWS && cc >= 0 && cells[idx(rr, cc)] === p; rr++, cc--) n++
  return n >= 4
}

// ─── Evaluation ─────────────────────────────────────────────────────────────

/**
 * Is `cell` on the parity `p` wants? Connect 4's parity rule: with normal
 * play, odd rows (counted from the bottom, 1-indexed) end up filled by the
 * first player and even rows by the second, so a threat on your own parity is
 * one the opponent cannot neutralise by tempo alone.
 */
function goodParity(cell: number, p: number): boolean {
  const rowFromBottom = ROWS - Math.floor(cell / COLS) // 1 (bottom) … 6 (top)
  const odd = (rowFromBottom & 1) === 1
  const pIsFirst = (p === 1) === aiIsFirst
  return pIsFirst ? odd : !odd
}

/**
 * Static evaluation from the AI's (+1) point of view. Only ever called when
 * neither side has an immediate win, so every threat counted here is one
 * whose cell is not yet playable.
 */
function evalForAi(): number {
  let s = 0
  let aiGood = 0
  let oppGood = 0
  for (let w = 0; w < WINDOW_COUNT * 4; w += 4) {
    const a = cells[WINDOW_CELLS[w]]
    const b = cells[WINDOW_CELLS[w + 1]]
    const c = cells[WINDOW_CELLS[w + 2]]
    const d = cells[WINDOW_CELLS[w + 3]]
    const sum = a + b + c + d
    // Any mixed window is dead for both sides: |sum| < count of non-empty.
    const filled = (a !== 0 ? 1 : 0) + (b !== 0 ? 1 : 0) + (c !== 0 ? 1 : 0) + (d !== 0 ? 1 : 0)
    if (filled === 0 || Math.abs(sum) !== filled) continue
    const p = sum > 0 ? 1 : -1
    if (filled === 3) {
      const empty =
        a === 0 ? WINDOW_CELLS[w] : b === 0 ? WINDOW_CELLS[w + 1] : c === 0 ? WINDOW_CELLS[w + 2] : WINDOW_CELLS[w + 3]
      if (goodParity(empty, p)) {
        s += p * 12
        if (p === 1) aiGood++; else oppGood++
      } else {
        s += p * 3
      }
    } else if (filled === 2) {
      s += p * 2
    }
  }
  // Parity dominance: a good-parity threat the opponent cannot answer with one
  // of their own decides most Connect 4 endgames by zugzwang. Weight it like
  // the near-decisive edge it is, so the search steers away long before it
  // can prove the forced line.
  if (aiGood > 0 && oppGood === 0) s += 40
  else if (oppGood > 0 && aiGood === 0) s -= 40
  // Positional: pieces on cells that many windows pass through
  for (let i = 0; i < N; i++) s += cells[i] * POS_WEIGHT[i]
  return s
}

// ─── Search ─────────────────────────────────────────────────────────────────

function negamax(depth: number, alpha: number, beta: number, p: number, ply: number): number {
  nodes++
  if ((nodes & 4095) === 0 && performance.now() > deadline) {
    aborted = true
    return 0
  }

  // Tactics first — these are exact and prune whole subtrees.
  let oppThreats = 0
  let forcedCol = -1
  for (let i = 0; i < COLS; i++) {
    const c = ORDER[i]
    if (height[c] >= ROWS) continue
    const r = ROWS - 1 - height[c]
    if (wouldWin(r, c, p)) return WIN - ply
    if (wouldWin(r, c, -p)) { oppThreats++; forcedCol = c }
  }
  if (oppThreats >= 2) return -(WIN - ply - 1) // can only block one
  if (moveCount >= N) return 0
  if (depth === 0) return p === 1 ? evalForAi() : -evalForAi()

  const key = hashHi * HASH_HI_MULT + hashLo + 1
  const slot = hashLo & TT_MASK
  if (ttKey[slot] === key) {
    const data = ttData[slot]
    if (((data >> 2) & 63) >= depth) {
      let score = data >> 8
      // Mate scores are stored root-relative; convert back to this ply.
      if (score > FORCED) score -= ply
      else if (score < -FORCED) score += ply
      const flag = data & 3
      if (flag === EXACT) return score
      if (flag === LOWER && score >= beta) return score
      if (flag === UPPER && score <= alpha) return score
    }
  }

  // Move generation. A single opponent threat forces the block. Otherwise
  // centre-first, with moves that hand the opponent a win on the cell above
  // ("playing under a threat") searched last.
  const moves = moveBuf[ply]
  let count = 0
  if (oppThreats === 1) {
    moves[count++] = forcedCol
  } else {
    for (let i = 0; i < COLS; i++) {
      const c = ORDER[i]
      if (height[c] >= ROWS) continue
      const r = ROWS - 1 - height[c]
      if (r > 0 && wouldWin(r - 1, c, -p)) continue
      moves[count++] = c
    }
    for (let i = 0; i < COLS; i++) {
      const c = ORDER[i]
      if (height[c] >= ROWS) continue
      const r = ROWS - 1 - height[c]
      if (r > 0 && wouldWin(r - 1, c, -p)) moves[count++] = c
    }
  }

  const alphaOrig = alpha
  let best = -Infinity
  for (let i = 0; i < count; i++) {
    const c = moves[i]
    const r = make(c, p)
    const v = -negamax(depth - 1, -beta, -alpha, -p, ply + 1)
    unmake(c, r, p)
    if (aborted) return 0
    if (v > best) best = v
    if (v > alpha) alpha = v
    if (alpha >= beta) break
  }

  let stored = best
  if (stored > FORCED) stored += ply
  else if (stored < -FORCED) stored -= ply
  const flag = best <= alphaOrig ? UPPER : best >= beta ? LOWER : EXACT
  ttKey[slot] = key
  ttData[slot] = (stored << 8) | (depth << 2) | flag
  return best
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Type guard for the wire format: 6 rows × 7 cols of '.', 'Y' or 'R'. */
export function isBoard(x: unknown): x is Board {
  if (!Array.isArray(x) || x.length !== ROWS) return false
  for (const row of x) {
    if (!Array.isArray(row) || row.length !== COLS) return false
    for (const cell of row) if (cell !== '.' && cell !== 'Y' && cell !== 'R') return false
  }
  return true
}

function load(board: Board, aiColor: Cell): void {
  cells.fill(0)
  height.fill(0)
  hashLo = 0
  hashHi = 0
  moveCount = 0
  let aiPieces = 0
  let oppPieces = 0
  for (let c = 0; c < COLS; c++) {
    for (let r = ROWS - 1; r >= 0; r--) {
      const v = board[r][c]
      if (v === '.') break
      const p = v === aiColor ? 1 : -1
      if (p === 1) aiPieces++; else oppPieces++
      const cell = idx(r, c)
      cells[cell] = p
      height[c]++
      moveCount++
      const z = zob(cell, p)
      hashLo ^= ZOB_LO[z]
      hashHi ^= ZOB_HI[z]
    }
  }
  // It is the AI's turn. Equal piece counts mean the AI opened the game.
  aiIsFirst = aiPieces === oppPieces
}

/**
 * Choose the AI's move. Searches with iterative deepening until `budgetMs`
 * elapses, then returns the best move from the deepest fully-completed
 * iteration. Immediate wins and forced blocks return without searching.
 */
export function bestMove(board: Board, aiColor: Cell, budgetMs: number): SearchResult {
  const t0 = performance.now()
  load(board, aiColor)
  nodes = 0
  aborted = false
  deadline = t0 + budgetMs
  ttKey.fill(0)

  const playable: number[] = []
  for (const c of ORDER) if (height[c] < ROWS) playable.push(c)
  if (playable.length === 0) {
    return { col: -1, depth: 0, nodes: 0, ms: performance.now() - t0, forced: 'draw' }
  }

  // Root tactics
  const threats: number[] = []
  for (const c of playable) {
    const r = ROWS - 1 - height[c]
    if (wouldWin(r, c, 1)) return { col: c, depth: 1, nodes: 0, ms: performance.now() - t0, forced: 'win' }
    if (wouldWin(r, c, -1)) threats.push(c)
  }
  if (threats.length === 1) return { col: threats[0], depth: 1, nodes: 0, ms: performance.now() - t0, reason: 'block' }
  if (threats.length >= 2) return { col: threats[0], depth: 1, nodes: 0, ms: performance.now() - t0, forced: 'loss' }

  // Iterative deepening. The previous iteration's best move is searched first.
  let order = playable
  let bestCol = order[0]
  let bestScore = 0
  let completed = 0
  const remaining = N - moveCount

  for (let d = 1; d <= remaining; d++) {
    let dBest = -Infinity
    let dCol = order[0]
    let alpha = -Infinity
    for (const c of order) {
      const r = make(c, 1)
      const v = -negamax(d - 1, -Infinity, -alpha, -1, 1)
      unmake(c, r, 1)
      if (aborted) break
      if (v > dBest) { dBest = v; dCol = c }
      if (v > alpha) alpha = v
    }
    if (aborted) break
    bestCol = dCol
    bestScore = dBest
    completed = d
    order = [dCol, ...order.filter(c => c !== dCol)]
    if (Math.abs(dBest) > FORCED) break
  }

  let forced: SearchResult['forced']
  if (bestScore > FORCED) forced = 'win'
  else if (bestScore < -FORCED) forced = 'loss'
  else if (completed >= remaining) forced = 'draw'

  return { col: bestCol, depth: completed, nodes, ms: performance.now() - t0, forced }
}
