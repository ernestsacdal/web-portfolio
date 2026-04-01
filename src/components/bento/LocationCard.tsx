'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./LocationMap'), { ssr: false })

export function LocationCard() {
  return (
    <div className="bento-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <Map />

      {/* Pulsing dot — centered */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          pointerEvents: 'none',
        }}
      >
        {/* Ping ring */}
        <span
          className="animate-ping"
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.35)',
          }}
        />
        {/* Mid ring */}
        <span
          style={{
            position: 'absolute',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.5)',
          }}
        />
        {/* Core dot */}
        <span
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px 2px rgba(74,222,128,0.7)',
          }}
        />
      </div>
    </div>
  )
}
