#!/usr/bin/env node
/**
 * Retrieval eval for Mikhai — spends zero LLM tokens.
 *
 * For each question, checks that a chunk that actually answers it is among
 * the chunks retrieved for the model (via the dev-only /api/chat/retrieve).
 * Tune src/lib/mikhai/aliases.ts until this passes; the model can only be as
 * right as what it is shown.
 *
 *   npm run dev            # in another terminal
 *   node scripts/eval-retrieval.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? 'http://localhost:3000'

/** expect: chunk-id prefixes; a case passes if any retrieved id starts with one. */
const CASES = [
  // Wednesday
  { q: "What's Wednesday?", expect: ['project:wednesday'] },
  { q: "How accurate are Wednesday's predictions?", expect: ['project:wednesday:the-predictor', 'project:wednesday:by-the-numbers', 'cv:projects:wednesday'] },
  { q: 'How many products does the grocery app track?', expect: ['project:wednesday:by-the-numbers', 'project:wednesday:data-pipeline', 'cv:projects:wednesday'] },
  { q: 'Which supermarkets does it cover?', prev: "What's Wednesday?", expect: ['project:wednesday', 'cv:projects:wednesday'] },
  { q: "What's its tech stack?", prev: "What's Wednesday?", expect: ['project:wednesday:summary', 'project:wednesday:the-app', 'cv:projects:wednesday'] },
  // Other projects
  { q: 'Tell me about the Laravel migrator', expect: ['project:multi-agent-laravel-migrator', 'cv:projects:mikhai'] },
  { q: 'Are you named after something?', expect: ['project:multi-agent-laravel-migrator', 'cv:projects:mikhai'] },
  { q: 'What is PreTriage?', expect: ['project:pretriage', 'cv:projects:pretriage'] },
  { q: 'Has he built anything in healthcare?', expect: ['project:pretriage', 'cv:projects:pretriage'] },
  { q: 'how does it work?', prev: 'Tell me about PreTriage', expect: ['project:pretriage'] },
  { q: 'What is SQRLY?', expect: ['cv:projects:sqrly'] },
  { q: "How many tables are in SQRLY's database schema?", expect: ['cv:projects:sqrly'] },
  { q: 'Tell me about the mechanic booking site', expect: ['project:niks-automotive', 'cv:projects:niks'] },
  { q: "What's LockerIQ?", expect: ['project:locker-iq'] },
  { q: "What's TrustLedger?", expect: ['project:trust-ledger'] },
  // CV
  { q: 'What did he do at Lightweight?', expect: ['cv:experience:software-engineer'] },
  { q: 'When was his internship?', expect: ['cv:experience:software-engineer-intern'] },
  { q: 'Where did Ernest study?', expect: ['cv:education'] },
  { q: 'When does he finish his masters?', expect: ['cv:education:master', 'about:what-hes-looking-for'] },
  { q: 'Does he know LangGraph?', expect: ['cv:technical-skills'] },
  { q: "What's his tech stack?", expect: ['cv:technical-skills'] },
  // Availability / about
  { q: 'Does he have work rights in Australia?', expect: ['about:what-hes-looking-for'] },
  { q: 'Is he open to freelance work?', expect: ['about:what-hes-looking-for'] },
  { q: 'What kind of role is he looking for?', expect: ['about:what-hes-looking-for'] },
  { q: 'How many years of experience does he have?', expect: ['about:experience'] },
  { q: 'How do I contact him?', expect: ['about:contact', 'cv:header'] },
  // This site
  { q: 'How does the Connect 4 AI work?', expect: ['about:this-website'] },
  { q: 'How was this website built?', expect: ['about:this-website'] },
  // Blog
  { q: 'What has he written about?', expect: ['blog:'] },
  { q: 'Why did he choose Groq for PreTriage?', expect: ['blog:groq-vs-openai-pretriage'] },
  { q: 'Why does Wednesday use statistics instead of machine learning?', expect: ['blog:shipping-wednesday', 'project:wednesday:the-predictor'] },
  { q: 'Why did he rip out free-form LLM codegen?', expect: ['blog:llm-codegen-migration-pipeline'] },
]

let pass = 0
const failures = []
for (const c of CASES) {
  const url = new URL('/api/chat/retrieve', BASE)
  url.searchParams.set('q', c.q)
  if (c.prev) url.searchParams.set('prev', c.prev)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} from ${url} — is the dev server running?`)
  const { results, contextTokens } = await res.json()
  const ids = results.map(r => r.id)
  const rank = ids.findIndex(id => c.expect.some(p => id.startsWith(p)))
  const ok = rank !== -1
  if (ok) pass++
  else failures.push({ ...c, got: ids.slice(0, 5) })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${ok ? `#${rank + 1}` : '  '}  ${String(contextTokens).padStart(4)}t  ${c.prev ? `(after "${c.prev}") ` : ''}${c.q}`)
}
console.log(`\n${pass}/${CASES.length} retrieved an answering chunk`)
for (const f of failures) console.log(`\nMISS: ${f.q}\n  expected one of: ${f.expect.join(', ')}\n  got: ${f.got.join(', ') || '(nothing)'}`)
process.exit(pass === CASES.length ? 0 : 1)
