'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  ChevronLeft, 
  Menu, 
  Info, 
  Gem, 
  Settings, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react'
import { HeaderVariant, Notification, mockUser } from '../../types/header'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
  variant?: HeaderVariant
  onMenuToggle?: () => void
  showMobileSidebar?: boolean
}

export default function Header({ 
  variant = HeaderVariant.PRIMARY, 
  onMenuToggle, 
  showMobileSidebar = false 
}: HeaderProps) {
  const router = useRouter()
  const { signOut, user, profile } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showCreditsTooltip, setShowCreditsTooltip] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const creditsRef = useRef<HTMLDivElement>(null)

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: 1,
      message: 'Nova trilha de Storytelling disponível!',
      time: 'há 5 min'
    },
    {
      id: 2,
      message: 'Seu projeto "Roteiro para Reels" foi salvo.',
      time: 'há 2 horas'
    }
  ]

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

  const handleLogoClick = () => {
    router.push('/dashboard')
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      setShowProfile(false)
      
      const { error } = await signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      router.push('/auth/login')
      
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const closeAllMenus = () => {
    setShowNotifications(false)
    setShowProfile(false)
    setShowCreditsTooltip(false)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !notificationsRef.current?.contains(event.target as Node) &&
        !profileRef.current?.contains(event.target as Node) &&
        !creditsRef.current?.contains(event.target as Node)
      ) {
        closeAllMenus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const renderLeftSection = () => {
    switch (variant) {
      case HeaderVariant.PRIMARY:
        return (
          <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
              alt="TrendlyAI Logo" 
              className="h-8 w-auto object-cover"
            />
          </button>
        )

      case HeaderVariant.SECONDARY:
        return (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
                alt="TrendlyAI Logo" 
                className="h-8 w-auto object-cover"
              />
            </button>
          </div>
        )

      case HeaderVariant.CHAT:
        return (
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuToggle || handleBack}
              className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
            >
              <Menu className="w-5 h-5 md:hidden" />
              <ChevronLeft className="w-6 h-6 hidden md:block" />
            </button>
            
            <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
                alt="TrendlyAI Logo" 
                className="h-8 w-auto object-cover"
              />
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 pt-3 pr-4 pb-3 pl-4">
        <div className="max-w-7xl flex sticky top-0 z-40 mr-auto ml-auto items-center justify-between backdrop-blur-2xl bg-white/10 border border-white/15 shadow-2xl rounded-full px-5 py-3">
          
          {/* Left Section */}
          {renderLeftSection()}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  closeAllMenus()
                  setShowNotifications(!showNotifications)
                }}
                className="relative w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 p-2 w-80 z-50 backdrop-blur-2xl bg-white/10 border border-white/15 shadow-2xl rounded-2xl">
                  <div className="p-2 flex justify-between items-center">
                    <h4 className="text-white font-semibold text-sm">Notificações</h4>
                    <button className="text-xs text-white/60 hover:text-white transition-colors">
                      Marcar como lidas
                    </button>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <button 
                        key={notification.id}
                        className="block p-3 rounded-lg w-full text-left hover:bg-white/10 transition-colors"
                      >
                        <p className="text-sm text-white">{notification.message}</p>
                        <span className="text-xs text-white/60">{notification.time}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button className="block text-center text-xs text-white/70 hover:text-white transition-colors p-2 w-full">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => {
                  closeAllMenus()
                  setShowProfile(!showProfile)
                }}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all ring-2 ring-transparent hover:ring-white/30 backdrop-blur-2xl bg-white/10 border border-white/15 shadow-lg"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img 
                    src={profile?.avatar_url || mockUser.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {showProfile && (
                <div className="absolute top-full right-0 mt-2 p-4 w-72 z-50 backdrop-blur-2xl bg-white/10 border border-white/15 shadow-2xl rounded-2xl">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={profile?.avatar_url || mockUser.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">{profile?.display_name || user?.email?.split('@')[0] || 'Usuário'}</h5>
                      <p className="text-sm text-white/70 flex items-center gap-1.5">
                        ✨ <span>{profile?.level || 'Explorador'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Profile Button */}
                  <button 
                    onClick={() => router.push('/profile')}
                    className="block text-center w-full px-4 py-2.5 mb-5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-2xl border border-white/15"
                  >
                    Meu Perfil
                  </button>

                  {/* Credits Section */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <h6 className="text-xs font-medium text-white/80">Créditos Mensais</h6>
                      <div className="relative" ref={creditsRef}>
                        <button 
                          onClick={() => {
                            setShowCreditsTooltip(!showCreditsTooltip)
                          }}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {showCreditsTooltip && (
                          <div className="absolute bottom-full right-0 mb-2 p-3 w-64 backdrop-blur-2xl bg-white/10 border border-white/15 shadow-2xl rounded-xl">
                            <p className="text-xs text-white/90">
                              Seus créditos são usados para conversas e se renovam a cada 24h. Precisa de mais? Torne-se Premium para ter acesso ilimitado.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300" 
                          style={{ width: `${profile?.credits && profile?.max_credits ? (profile.credits / profile.max_credits * 100) : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-right text-white/60 mt-1">
                        {profile?.credits || 0}/{profile?.max_credits || 50}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1 border-t border-white/10 pt-3 mt-4">
                    <button 
                      onClick={() => router.push('/subscription')}
                      className="flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left hover:bg-white/10 transition-colors"
                    >
                      <Gem className="w-4 h-4 text-white/70" />
                      <span>Gerenciar Assinatura</span>
                    </button>
                    <button 
                      onClick={() => router.push('/settings')}
                      className="flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-white/70" />
                      <span>Configurações da Conta</span>
                    </button>
                    <button 
                      onClick={() => router.push('/help')}
                      className="flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left hover:bg-white/10 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-white/70" />
                      <span>Central de Ajuda</span>
                    </button>
                    
                    <div className="border-t border-white/10 my-2" />
                    
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 p-2.5 text-red-400 hover:text-red-300 text-sm rounded-lg w-full text-left disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      {isLoggingOut ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span>{isLoggingOut ? 'Saindo...' : 'Sair da Conta'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}