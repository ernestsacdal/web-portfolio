export function BuildCard() {
  return (
    <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span
        className="animate-pulse-dot"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#22c55e',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--text)' }}>
          Let&apos;s Build
          <br />
          Something
        </p>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>
          Sydney · Remote OK
        </p>
      </div>

      <a
        href="mailto:ernest@ernestsacdal.com"
        style={{ fontSize: 13, fontWeight: 500, color: '#0071E3', textDecoration: 'none' }}
      >
        → Get in touch
      </a>
    </div>
  )
}
