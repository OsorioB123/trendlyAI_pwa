'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { HeaderProvider } from './header/SharedHeaderContext'
import { PrimaryHeader } from './header/PrimaryHeader'
import { SecondaryHeader } from './header/SecondaryHeader'
import ChatHeader from './header/chat/ChatHeader'
import type { Notification } from '@/types/header'

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 1, message: 'Nova trilha de Storytelling disponível!', time: 'há 5 min' },
  { id: 2, message: 'Seu projeto "Roteiro para Reels" foi salvo.', time: 'há 2 horas' }
]

interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function HeaderWrapper({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname()

  const header = useMemo(() => {
    if (pathname?.startsWith('/chat')) {
      return <ChatHeader onToggleSidebar={onToggleSidebar ?? (() => undefined)} />
    }
    if (pathname === '/dashboard') {
      return <PrimaryHeader />
    }
    return <SecondaryHeader />
  }, [pathname, onToggleSidebar])

  return <HeaderProvider initialNotifications={DEFAULT_NOTIFICATIONS}>{header}</HeaderProvider>
}
