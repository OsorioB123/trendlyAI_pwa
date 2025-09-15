export function setUrlParam(url: string, key: string, value: string | number) {
  try {
    const u = new URL(url)
    u.searchParams.set(key, String(value))
    return u.toString()
  } catch {
    return url
  }
}

export function optimizeUnsplash(url: string, targetWidth: number, quality = 80) {
  if (!url.includes('images.unsplash.com')) return url
  let optimized = setUrlParam(url, 'w', targetWidth)
  optimized = setUrlParam(optimized, 'q', quality)
  return optimized
}

