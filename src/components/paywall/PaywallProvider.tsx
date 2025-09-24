import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import PaywallSheet from './PaywallSheet'

export type PaywallSource = 'header' | 'tool' | 'track' | 'module' | 'generic'

interface PaywallContextValue {
  open: (source?: PaywallSource) => void
  close: () => void
  isOpen: boolean
  source: PaywallSource
}

const PaywallContext = createContext<PaywallContextValue | undefined>(undefined)

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState<PaywallSource>('generic')

  const open = useCallback((nextSource: PaywallSource = 'generic') => {
    setSource(nextSource)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const originalOverflow = document.body.style.overflow
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow || ''
    }
    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [isOpen, close])

  const value = useMemo(() => ({ open, close, isOpen, source }), [open, close, isOpen, source])

  return (
    <PaywallContext.Provider value={value}>
      {children}
      <PaywallSheet open={isOpen} onClose={close} />
    </PaywallContext.Provider>
  )
}

export function usePaywall() {
  const context = useContext(PaywallContext)
  if (!context) {
    throw new Error('usePaywall must be used within a PaywallProvider')
  }
  return context
}
