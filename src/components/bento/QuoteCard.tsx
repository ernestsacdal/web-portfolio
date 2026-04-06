export function QuoteCard() {
  return (
    <div
      className="bento-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        overflow: 'hidden',
        padding: '12px 20px',
      }}
    >
      {/* Decorative oversized quotation mark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -8,
          left: 10,
          fontSize: '8rem',
          lineHeight: 1,
          color: 'var(--text)',
          opacity: 0.06,
          userSelect: 'none',
          fontFamily: "'New York', Georgia, serif",
          pointerEvents: 'none',
        }}
      >
        &ldquo;
      </span>

      {/* Quote + attribution */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p
          style={{
            fontFamily: "'New York', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            color: 'var(--text)',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Pressure is a privilege
        </p>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.05em',
            color: 'var(--text2)',
            opacity: 0.6,
            margin: 0,
            marginTop: 8,
          }}
        >
          — Billie Jean King
        </p>
      </div>
    </div>
  )
}
