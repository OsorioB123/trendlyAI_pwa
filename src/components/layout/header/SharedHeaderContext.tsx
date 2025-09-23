'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Notification } from '@/types/header'
import type { UserCredits } from '@/types/chat'

interface HeaderState {
  notifications: Notification[]
  credits: UserCredits | null
  creditsUsedToday: number | null
  setCredits: (credits: UserCredits | null) => void
  setCreditsUsedToday: (value: number | null) => void
}

const HeaderContext = createContext<HeaderState | undefined>(undefined)

export function HeaderProvider({
  children,
  initialNotifications
}: {
  children: ReactNode
  initialNotifications: Notification[]
}) {
  const [notifications] = useState(initialNotifications)
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [creditsUsedToday, setCreditsUsedToday] = useState<number | null>(null)

  return (
    <HeaderContext.Provider
      value={{
        notifications,
        credits,
        creditsUsedToday,
        setCredits,
        setCreditsUsedToday
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderState() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeaderState must be used within HeaderProvider')
  }
  return context
}
