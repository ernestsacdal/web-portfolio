'use client'

import 'leaflet/dist/leaflet.css'
import { useTheme } from '@/lib/theme'
import { MapContainer, TileLayer } from 'react-leaflet'

const SYDNEY: [number, number] = [-33.8688, 151.2093]

export default function LocationMap() {
  const { theme } = useTheme()

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  return (
    <MapContainer
      center={SYDNEY}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <TileLayer key={tileUrl} url={tileUrl} subdomains="abcd" maxZoom={19} />
    </MapContainer>
  )
}
