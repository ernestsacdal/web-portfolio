export type LogEventDetail =
  | { type: 'game:start' }
  | { type: 'game:move'; player: 'human'; col: number }
  | { type: 'game:end'; winner: 'human_win' | 'ai_win' | 'draw' }
  | { type: 'api:start'; path: string; method: string }
  | { type: 'api:done'; path: string; status: number; latencyMs: number; aiCol: number; fallback?: boolean }
  | { type: 'user:action'; action: string }
  | { type: 'nav:change'; to: string }

const LOG_EVENT = 'portfolio:log'

export function emitLog(detail: LogEventDetail): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<LogEventDetail>(LOG_EVENT, { detail }))
}

export function onLog(handler: (detail: LogEventDetail) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => handler((e as CustomEvent<LogEventDetail>).detail)
  window.addEventListener(LOG_EVENT, listener)
  return () => window.removeEventListener(LOG_EVENT, listener)
}
