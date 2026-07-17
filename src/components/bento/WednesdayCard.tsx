import { siApple } from 'simple-icons'

const APP_STORE_URL = 'https://apps.apple.com/au/app/wednesday'

// Wednesday brand palette (from the app's icon spec)
const INK = '#16140F'
const PAPER = '#FBFAF6'
const GREEN = '#157A42'
const GREEN2 = '#3FB873'
const COLES_RED = '#E1251B'
const SUB = '#8D8A80'

const CARD_CSS = `
  .wed-pill {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .wed-pill:hover {
    opacity: 0.85;
  }
  .wed-pill:active {
    transform: scale(0.97);
  }
  @keyframes wedPhoneIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .wed-phone {
    animation: wedPhoneIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards;
    will-change: transform;
  }
  .dark .wed-phone {
    box-shadow:
      0 24px 48px rgba(0,0,0,0.5),
      0 4px 12px rgba(0,0,0,0.3),
      0 0 0 1px rgba(255,255,255,0.07),
      inset 0 0 0 1px rgba(255,255,255,0.22) !important;
  }
  @media (prefers-reduced-motion: reduce) {
    .wed-phone { animation: none; }
  }
  @media (max-width: 767px) {
    .wed-head {
      flex-direction: row !important;
      align-items: center !important;
      gap: 10px !important;
    }
    .wed-badge {
      width: 28px !important;
      height: 28px !important;
      border-radius: 7px !important;
    }
    .wed-title { font-size: 15px !important; }
    .wed-copy  { max-width: calc(100% - 128px) !important; }
    .wed-desc {
      font-size: 11px !important;
      margin-top: 7px !important;
      max-width: 100% !important;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .wed-pill { padding: 5px 11px 5px 9px !important; }
    .wed-pill-small { font-size: 7px !important; }
    .wed-pill-big   { font-size: 11px !important; }
    .wed-phone {
      top: 14px !important;
      right: -30px !important;
      width: 150px !important;
      height: 306px !important;
      border-radius: 28px !important;
    }
    .wed-screen { border-radius: 23px !important; }
    .wed-glow {
      top: -40px !important;
      right: -60px !important;
    }
  }
`

/** The real Wednesday app icon — price-line W with a drop marker. */
function WednesdayLogo() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" aria-hidden>
      <polyline
        points="22,32 39,61 48,44.5 62.5,64.5 77.5,50.5"
        fill="none"
        stroke={PAPER}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="77.5" cy="50.5" r="8.5" fill={GREEN2} />
      <path
        d="M77.5 46.5v5.5M74.4 49.6l3.1 3.2 3.1-3.2"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="24" y1="74" x2="76" y2="74" stroke="#6E6B62" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

/** Retailer chip inside the phone screen (Coles / Woolies counts). */
function StoreChip({ letter, color, count }: { letter: string; color: string; count: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: '#FFFFFF',
        borderRadius: 8,
        padding: '4px 7px',
        boxShadow: '0 1px 4px rgba(22,20,15,0.06)',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: color,
          color: '#FFFFFF',
          fontSize: 6.5,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {letter}
      </span>
      <span style={{ fontSize: 6.5, fontWeight: 600, color: INK }}>{count}</span>
    </div>
  )
}

/** Half-price drop row inside the phone screen. */
function DropRow({
  name,
  now,
  was,
  store,
  storeColor,
}: {
  name: string
  now: string
  was: string
  store: string
  storeColor: string
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 11,
        padding: '7px 10px',
        boxShadow: '0 1px 4px rgba(22,20,15,0.06)',
        marginBottom: 7,
      }}
    >
      <div style={{ fontSize: 8, fontWeight: 600, color: INK, whiteSpace: 'nowrap' }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: GREEN }}>{now}</span>
        <span style={{ fontSize: 7, color: '#A9A69D', textDecoration: 'line-through' }}>{was}</span>
        <span style={{ fontSize: 6.5, fontWeight: 700, color: GREEN }}>½ price</span>
        <span style={{ fontSize: 6.5, fontWeight: 600, color: storeColor }}>{store}</span>
      </div>
    </div>
  )
}

export function WednesdayCard() {
  return (
    <div
      className="bento-card"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <style>{CARD_CSS}</style>

      {/* Soft green ambience behind the phone — reads in both themes */}
      <div
        className="wed-glow"
        aria-hidden
        style={{
          position: 'absolute',
          top: 70,
          right: -50,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(63,184,115,0.16), rgba(63,184,115,0))',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ————— Copy column ————— */}
      <div
        className="wed-copy"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div
          className="wed-head"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div
            className="wed-badge"
            aria-hidden
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: INK,
              padding: 2,
              flexShrink: 0,
              boxShadow:
                '0 4px 10px rgba(22,20,15,0.3), inset 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            <WednesdayLogo />
          </div>
          <h3
            className="wed-title"
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'var(--text)',
            }}
          >
            Wednesday
          </h3>
        </div>

        <p
          className="wed-desc"
          style={{
            margin: '10px 0 0',
            fontSize: 12.5,
            lineHeight: 1.5,
            color: 'var(--text2)',
            maxWidth: 165,
          }}
        >
          AI that predicts when groceries hit half price.
        </p>

        <a
          className="wed-pill"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Wednesday — available on the App Store"
          style={{
            marginTop: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            width: 'fit-content',
            padding: '7px 13px 7px 11px',
            borderRadius: 12,
            background: 'var(--text)',
            color: 'var(--bg)',
            textDecoration: 'none',
          }}
        >
          <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={siApple.path} />
          </svg>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span
              className="wed-pill-small"
              style={{ fontSize: 8, fontWeight: 500, opacity: 0.7 }}
            >
              Available on the
            </span>
            <span className="wed-pill-big" style={{ fontSize: 12.5, fontWeight: 600 }}>
              App Store
            </span>
          </span>
        </a>
      </div>

      {/* ————— iPhone, cropped by the card edge ————— */}
      <div
        className="wed-phone"
        aria-hidden
        style={{
          position: 'absolute',
          top: 64,
          right: -44,
          width: 176,
          height: 360,
          zIndex: 1,
          borderRadius: 32,
          background: '#0B0B0D',
          padding: 5,
          boxShadow:
            '0 24px 48px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.09)',
        }}
      >
        <div
          className="wed-screen"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 27,
            overflow: 'hidden',
            position: 'relative',
            background: '#F7F5EF',
          }}
        >
          {/* Status bar + Dynamic Island */}
          <div style={{ position: 'relative', height: 24 }}>
            <span
              style={{
                position: 'absolute',
                left: 15,
                top: 7,
                fontSize: 8.5,
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: INK,
              }}
            >
              9:41
            </span>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 6,
                transform: 'translateX(-50%)',
                width: 46,
                height: 13,
                borderRadius: 999,
                background: '#0B0B0D',
              }}
            />
            <svg
              style={{ position: 'absolute', right: 12, top: 8 }}
              width={36}
              height={9}
              viewBox="0 0 36 9"
              fill={INK}
            >
              {/* Signal */}
              <rect x="0" y="5.4" width="2" height="3.6" rx="0.7" />
              <rect x="3.2" y="3.9" width="2" height="5.1" rx="0.7" />
              <rect x="6.4" y="2.4" width="2" height="6.6" rx="0.7" />
              <rect x="9.6" y="0.9" width="2" height="8.1" rx="0.7" />
              {/* Wi-Fi */}
              <path
                d="M14.9 4.1a6.2 6.2 0 0 1 8.2 0"
                fill="none"
                stroke={INK}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M16.4 6a3.7 3.7 0 0 1 5.2 0"
                fill="none"
                stroke={INK}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <circle cx="19" cy="8" r="1" />
              {/* Battery */}
              <rect
                x="26"
                y="1.6"
                width="8.2"
                height="5.8"
                rx="1.9"
                fill="none"
                stroke={INK}
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <rect x="27.3" y="2.9" width="5" height="3.2" rx="0.9" />
              <path d="M35.1 3.3v2.4a1.3 1.3 0 0 0 0-2.4Z" fillOpacity="0.4" />
            </svg>
          </div>

          {/* App content — mirrors the real home screen, left-weighted for the crop */}
          <div style={{ padding: '6px 13px 0' }}>
            <div
              style={{
                fontSize: 6,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: SUB,
              }}
            >
              Wednesday 8 July
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: INK,
                marginTop: 2,
              }}
            >
              G&apos;day, Ernest.
            </div>
            <div style={{ fontSize: 7, color: SUB, marginTop: 2 }}>
              New specials dropped this morning.
            </div>

            {/* Retailer chips */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <StoreChip letter="C" color={COLES_RED} count="1,141" />
              <StoreChip letter="W" color={GREEN} count="1,623" />
            </div>

            {/* Drops */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
                margin: '9px 0 5px',
              }}
            >
              <span
                style={{
                  fontSize: 6,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: SUB,
                }}
              >
                This week&apos;s drops
              </span>
              <span
                style={{
                  fontSize: 6.5,
                  fontWeight: 700,
                  color: INK,
                  borderBottom: `1.5px solid ${INK}`,
                }}
              >
                Half-price
              </span>
            </div>

            <DropRow
              name="Blackmores Omega Triple"
              now="$42.50"
              was="$85.00"
              store="Woolies"
              storeColor={GREEN}
            />
            <DropRow
              name="Oral B iO2 Toothbrush"
              now="$80.00"
              was="$160.00"
              store="Coles"
              storeColor={COLES_RED}
            />
            <DropRow
              name="Philips Sonicare"
              now="$50.00"
              was="$100.00"
              store="Coles"
              storeColor={COLES_RED}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
