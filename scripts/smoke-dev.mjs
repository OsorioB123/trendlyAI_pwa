// Simple dev smoke test. Run while `npm run dev` is active.
// Usage: npm run smoke:dev [baseURL]
// Defaults to http://localhost:3000

const base = process.argv[2] || 'http://localhost:3000'

async function check(path, init) {
  const url = new URL(path, base).toString()
  const res = await fetch(url, init)
  const text = await res.text()
  const ok = res.ok
  console.log(`[${ok ? 'OK' : 'ERR'}] ${res.status} ${init?.method || 'GET'} ${url}`)
  if (!ok) {
    console.log(text.slice(0, 400))
  }
  return ok
}

;(async () => {
  const results = []
  results.push(await check('/'))
  results.push(await check('/api/auth/admin')) // GET endpoint returns info JSON
  results.push(await check('/test-supabase')) // page exists even if env is placeholder
  results.push(await check('/help')) // public help page should render

  const passed = results.every(Boolean)
  console.log(`\nSmoke result: ${passed ? 'PASS' : 'FAIL'}`)
  process.exit(passed ? 0 : 1)
})().catch((e) => {
  console.error('Smoke error:', e)
  process.exit(1)
})
