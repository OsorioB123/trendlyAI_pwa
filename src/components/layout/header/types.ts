import type { UserCredits } from '@/types/chat'

export interface HeaderSharedProps {
  profileMenu: {
    onNavigate: () => void
    onLogout: () => Promise<void>
    isLoggingOut: boolean
    credits: UserCredits | null
    creditsUsedToday: number | null
    displayName: string
    avatarUrl?: string
    level?: string
  }
}
