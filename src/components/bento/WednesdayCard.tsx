import { siApple } from 'simple-icons'

const APP_STORE_URL = 'https://apps.apple.com/au/app/wednesday'

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
  @keyframes wedPing {
    0%   { transform: scale(1);   opacity: 0.45; }
    75%  { transform: scale(2.6); opacity: 0; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  .wed-ping {
    transform-box: fill-box;
    transform-origin: center;
    animation: wedPing 2.6s ease-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .wed-phone, .wed-ping { animation: none; }
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
      font-size: 13px !important;
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

/** Miniature grocery item row rendered inside the phone screen. */
function ScreenItem({
  name,
  was,
  now,
  chip,
  sub,
}: {
  name: string
  was?: string
  now?: string
  chip?: string
  sub?: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.88)',
        borderRadius: 11,
        padding: '8px 10px',
        boxShadow: '0 1px 4px rgba(29,60,40,0.07)',
        marginBottom: 7,
      }}
    >
      <div style={{ fontSize: 8, fontWeight: 600, color: '#1D1D1F', whiteSpace: 'nowrap' }}>
        {name}
      </div>
      {(was || now || sub) && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
          {was && (
            <span style={{ fontSize: 7, color: '#98A29B', textDecoration: 'line-through' }}>
              {was}
            </span>
          )}
          {now && (
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1F9D4D' }}>{now}</span>
          )}
          {sub && <span style={{ fontSize: 7, color: '#98A29B' }}>{sub}</span>}
        </div>
      )}
      {chip && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            marginTop: 5,
            padding: '2px 6px',
            borderRadius: 999,
            background: 'rgba(52,199,89,0.14)',
          }}
        >
          <span
            style={{ width: 4, height: 4, borderRadius: '50%', background: '#34C759' }}
          />
          <span style={{ fontSize: 6.5, fontWeight: 600, color: '#1F9D4D' }}>{chip}</span>
        </div>
      )}
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
            'radial-gradient(closest-side, rgba(52,199,89,0.16), rgba(52,199,89,0))',
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
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #34C759 0%, #248A3D 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              flexShrink: 0,
              boxShadow:
                '0 4px 10px rgba(52,199,89,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            W
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
            background:
              'linear-gradient(170deg, #FAFDF9 0%, #ECF7EE 48%, #DDF1E3 100%)',
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
                color: '#1D1D1F',
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
              fill="#1D1D1F"
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
                stroke="#1D1D1F"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M16.4 6a3.7 3.7 0 0 1 5.2 0"
                fill="none"
                stroke="#1D1D1F"
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
                stroke="#1D1D1F"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <rect x="27.3" y="2.9" width="5" height="3.2" rx="0.9" />
              <path d="M35.1 3.3v2.4a1.3 1.3 0 0 0 0-2.4Z" fillOpacity="0.4" />
            </svg>
          </div>

          {/* App content — left-weighted so the crop never hides key info */}
          <div style={{ padding: '8px 13px 0' }}>
            <div style={{ margin: '4px 0 10px' }}>
              <div
                style={{
                  fontSize: 6.5,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#7A8A7E',
                }}
              >
                Next specials
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 2 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#1D1D1F',
                  }}
                >
                  6 days
                </span>
                <span style={{ fontSize: 8, fontWeight: 600, color: '#1F9D4D' }}>
                  Wed 22 Jul
                </span>
              </div>
            </div>

            <ScreenItem
              name="Tim Tam Original 365g"
              was="$6.00"
              now="$3.00"
              chip="½ price predicted · Wed"
            />

            {/* Price-cycle sparkline — prediction dot kept left of the crop zone */}
            <div
              style={{
                background: 'rgba(255,255,255,0.88)',
                borderRadius: 11,
                padding: '8px 10px 7px',
                boxShadow: '0 1px 4px rgba(29,60,40,0.07)',
                marginBottom: 7,
              }}
            >
              <span
                style={{
                  fontSize: 6.5,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#7A8A7E',
                }}
              >
                Price cycle
              </span>
              <svg
                width="100%"
                height={26}
                viewBox="0 0 132 26"
                fill="none"
                style={{ display: 'block', marginTop: 4 }}
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7h18l8 12 8-12h18l8 12 8-12h16"
                  stroke="#B9CDBE"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M86 7l9 12"
                  stroke="#34C759"
                  strokeWidth="1.4"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
                <circle className="wed-ping" cx="95" cy="19" r="2.4" fill="#34C759" opacity="0.35" />
                <circle cx="95" cy="19" r="2.4" fill="#34C759" />
              </svg>
            </div>

            <ScreenItem name="Pepsi Max 24 × 375ml" sub="tracking · Woolworths" />
          </div>
        </div>
      </div>
    </div>
  )
}
