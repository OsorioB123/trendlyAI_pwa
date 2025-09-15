import { NextResponse } from 'next/server'

// 1x1 transparent PNG (base64)
const TRANSPARENT_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgU0sJ6UAAAAASUVORK5CYII='

export async function GET() {
  const buffer = Buffer.from(TRANSPARENT_PNG_BASE64, 'base64')
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  })
}

