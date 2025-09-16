'use client'

import { useEffect, useRef, useState } from 'react'

export default function NetworkStatusBanner() {
  const [online, setOnline] = useState(true)
  const [visible, setVisible] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const backoffRef = useRef<number>(2000)
  const retryTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setOnline(navigator.onLine)
      setVisible(!navigator.onLine)
    }

    const handleOnline = () => {
      setOnline(true)
      setReconnecting(false)
      setVisible(true)
      // hide after short delay
      setTimeout(() => setVisible(false), 2000)
    }

    const handleOffline = () => {
      setOnline(false)
      setVisible(true)
      setReconnecting(true)
      scheduleRetry()
    }

    const tryPing = async () => {
      try {
        // lightweight ping to an existing endpoint
        const res = await fetch('/api/auth/admin', { method: 'GET', cache: 'no-store' })
        if (res.ok) {
          handleOnline()
          return
        }
      } catch {}
      // schedule next attempt with simple backoff up to ~20s
      backoffRef.current = Math.min(backoffRef.current * 2, 20000)
      scheduleRetry()
    }

    const scheduleRetry = () => {
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current)
      retryTimerRef.current = window.setTimeout(() => {
        if (!navigator.onLine) {
          setReconnecting(true)
          tryPing()
        }
      }, backoffRef.current) as unknown as number
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[2000] px-4 py-2 rounded-full backdrop-blur-xl border shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center gap-2 ${
        online ? 'bg-green-500/20 border-green-500/30 text-green-200' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200'
      }`}
    >
      {!online && reconnecting && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      )}
      <span>
        {online ? 'Conexão restaurada' : reconnecting ? 'Reconectando…' : 'Você está offline — alguns recursos podem não funcionar'}
      </span>
    </div>
  )
}
