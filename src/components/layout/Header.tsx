'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { HeaderProvider } from './header/SharedHeaderContext'
import { PrimaryHeader } from './header/PrimaryHeader'
import { SecondaryHeader } from './header/SecondaryHeader'
import ChatHeader from './header/chat/ChatHeader'

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

  return <HeaderProvider>{header}</HeaderProvider>
}
