export function QuoteCard() {
  return (
    <div
      className="bento-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        overflow: 'hidden',
        padding: '12px 20px',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(0.95rem, 1.4vw, 1.25rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: 'var(--text)',
          lineHeight: 1.3,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        Pressure is a privilege
      </p>
    </div>
  )
}
