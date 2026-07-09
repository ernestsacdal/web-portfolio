'use client'

import { useEffect, useState } from 'react'

const MUSICKIT_SRC = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js'

interface MusicKitInstance {
  authorize(): Promise<string>
}

interface MusicKitGlobal {
  configure(config: {
    developerToken: string
    app: { name: string; build: string }
  }): Promise<MusicKitInstance>
}

declare global {
  interface Window {
    MusicKit?: MusicKitGlobal
  }
}

export function AppleAuthClient({ developerToken }: { developerToken: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'authorizing' | 'done' | 'error'>(() =>
    typeof window !== 'undefined' && window.MusicKit ? 'ready' : 'loading'
  )
  const [userToken, setUserToken] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (window.MusicKit) return
    const script = document.createElement('script')
    script.src = MUSICKIT_SRC
    script.async = true
    script.onload = () => setStatus('ready')
    script.onerror = () => {
      setError('Failed to load MusicKit JS')
      setStatus('error')
    }
    document.head.appendChild(script)
  }, [])

  async function authorize() {
    if (!window.MusicKit) return
    setStatus('authorizing')
    try {
      const music = await window.MusicKit.configure({
        developerToken,
        app: { name: 'Portfolio', build: '1.0' },
      })
      const token = await music.authorize()
      setUserToken(token)
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authorization failed')
      setStatus('error')
    }
  }

  async function copyToken() {
    await navigator.clipboard.writeText(userToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Apple Music auth</h1>
      <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
        Sign in with your Apple ID to generate a Music User Token, then paste it into{' '}
        <code>.env.local</code> as <code>APPLE_MUSIC_USER_TOKEN</code> and restart the dev server.
        The token expires roughly every 6 months — revisit this page to renew it.
      </p>

      {status !== 'done' && (
        <button
          onClick={authorize}
          disabled={status !== 'ready'}
          style={{
            marginTop: 24,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text)',
            cursor: status === 'ready' ? 'pointer' : 'default',
            opacity: status === 'ready' ? 1 : 0.6,
          }}
        >
          {status === 'loading' && 'Loading MusicKit…'}
          {status === 'ready' && 'Authorize with Apple Music'}
          {status === 'authorizing' && 'Waiting for Apple…'}
          {status === 'error' && 'Retry'}
        </button>
      )}

      {status === 'error' && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#e5484d' }}>{error}</p>
      )}

      {status === 'done' && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text2)' }}>
            Music User Token
          </p>
          <pre
            style={{
              marginTop: 8,
              padding: 14,
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--text)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {userToken}
          </pre>
          <button
            onClick={copyToken}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy token'}
          </button>
        </div>
      )}
    </main>
  )
}
