export enum HeaderVariant {
  PRIMARY = 'primary',      // No back button - for main pages (Home)
  SECONDARY = 'secondary',  // With back button - for internal pages
  CHAT = 'chat'            // Chat specific - adaptive mobile/desktop
}

export interface UserData {
  name: string
  title: string
  avatar: string
  credits: {
    used: number
    total: number
    percentage: number
  }
}

export interface Notification {
  id: string
  title: string
  message: string
  createdAt: string
  readAt?: string | null
  actionUrl?: string
  type?: string
}

export const mockUser: UserData = {
  name: 'João da Silva',
  title: 'Explorador',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80',
  credits: {
    used: 35,
    total: 50,
    percentage: 70
  }
}
