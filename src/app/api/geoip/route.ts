import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : ''

  const url =
    ip && ip !== '::1' && ip !== '127.0.0.1'
      ? `http://ip-api.com/json/${ip}?fields=status,city,country,countryCode,timezone,lat,lon`
      : `http://ip-api.com/json?fields=status,city,country,countryCode,timezone,lat,lon`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ status: 'fail' })
  }
}
