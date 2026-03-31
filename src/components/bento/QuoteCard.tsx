export function QuoteCard() {
  return (
    <div
      className="bento-card"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}
    >
      <p
        style={{
          fontSize: '1rem',
          fontStyle: 'italic',
          color: 'var(--text2)',
          lineHeight: 1.55,
          textAlign: 'center',
        }}
      >
        &ldquo;Build things that matter.&rdquo;
      </p>
    </div>
  )
}
