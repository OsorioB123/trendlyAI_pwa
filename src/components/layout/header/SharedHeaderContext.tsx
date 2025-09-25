'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Notification } from '@/types/header'
import type { UserCredits } from '@/types/chat'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'

interface HeaderState {
  notifications: Notification[]
  unreadCount: number
  notificationsLoading: boolean
  notificationsError: string | null
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  credits: UserCredits | null
  creditsUsedToday: number | null
  setCredits: (credits: UserCredits | null) => void
  setCreditsUsedToday: (value: number | null) => void
}

const HeaderContext = createContext<HeaderState | undefined>(undefined)

export function HeaderProvider({
  children
}: {
  children: ReactNode
}) {
  const { user } = useAuth()
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    markNotificationRead,
    markAllNotificationsRead,
  } = useNotifications(user?.id)
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [creditsUsedToday, setCreditsUsedToday] = useState<number | null>(null)

  return (
    <HeaderContext.Provider
      value={{
        notifications,
        unreadCount,
        notificationsLoading,
        notificationsError,
        markNotificationRead,
        markAllNotificationsRead,
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
