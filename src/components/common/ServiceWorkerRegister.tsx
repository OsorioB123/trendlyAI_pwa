'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (e) {
          console.warn('Service Worker registration failed:', e)
        }
      }
      register()
    }
  }, [])
  return null
}

