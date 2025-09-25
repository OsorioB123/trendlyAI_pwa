'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Bell, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useHeaderState } from './SharedHeaderContext'
import {
  ProfileButton,
  ProfileMenu,
  ProfileMenuContent,
  NotificationsMenu,
  useHeaderData,
  formatRelativeTime
} from './shared'
import { usePaywall } from '@/components/paywall/PaywallProvider'

export function PrimaryHeader() {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    notificationsLoading,
    notificationsError,
    markNotificationRead,
    markAllNotificationsRead,
    credits,
    creditsUsedToday
  } = useHeaderState()
  const { user, profile, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { open: openPaywall } = usePaywall()
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useHeaderData(user?.id)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfile(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      router.replace('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-3"
    >
      <div
        className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        data-testid="primary-header"
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 text-left text-white transition-opacity hover:opacity-80"
        >
          <Image
            src="https://i.ibb.co/6JghTg2R/Sem-nome-Apresenta-o-43-64-x-40-px-cone-para-You-Tube.png"
            alt="TrendlyAI"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </button>

        {!profile?.is_premium && (
          <button
            onClick={() => openPaywall('header')}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-white/25 md:hidden"
            aria-label="Abrir planos Maestro"
          >
            <Rocket className="h-4 w-4" />
            Tornar-se Maestro
          </button>
        )}

        <div className="flex items-center gap-2">
          {!profile?.is_premium && (
            <button
              onClick={() => openPaywall('header')}
              className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-white/25 md:inline-flex"
              data-testid="upgrade-button"
              aria-label="Abrir planos Maestro"
            >
              <Rocket className="h-4 w-4" />
              Tornar-se Maestro
            </button>
          )}

         <div ref={notificationsRef} className="relative">
           <button
              onClick={() => {
                setShowProfile(false)
                setShowNotifications((prev) => !prev)
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/20"
              aria-label={showNotifications ? 'Fechar notificações' : 'Abrir notificações'}
              data-testid="notifications-button"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              )}
            </button>
            <NotificationsMenu open={showNotifications}>
              <div className="flex items-center justify-between px-2 pb-2">
                <h4 className="text-sm font-semibold text-white">Notificações</h4>
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="text-xs text-white/60 transition-colors hover:text-white"
                >
                  Marcar como lidas
                </button>
              </div>
              <div className="space-y-1">
                {notificationsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`notification-skeleton-${index}`}
                      className="animate-pulse rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                    >
                      <div className="h-4 w-3/4 rounded bg-white/20" />
                      <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
                    </div>
                  ))
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const isUnread = !notification.readAt
                    return (
                      <button
                        key={notification.id}
                        onClick={async () => {
                          if (isUnread) {
                            await markNotificationRead(notification.id)
                          }
                          if (notification.actionUrl) {
                            router.push(notification.actionUrl)
                            setShowNotifications(false)
                          }
                        }}
                        className={`block w-full rounded-xl px-3 py-2 text-left transition-all ${
                          isUnread ? 'border border-white/15 bg-white/10 text-white' : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-white/50">{formatRelativeTime(notification.createdAt)}</p>
                        {notification.message && (
                          <p className="mt-1 text-xs text-white/70">{notification.message}</p>
                        )}
                      </button>
                    )
                  })
                ) : (
                  <div className="px-3 py-6 text-center text-xs text-white/60">
                    {notificationsError ?? 'Nenhuma notificação por aqui ainda.'}
                  </div>
                )}
              </div>
              <button className="mt-3 w-full rounded-xl px-3 py-2 text-center text-xs text-white/70 transition-colors hover:bg-white/10">
                Ver todas
              </button>
            </NotificationsMenu>
          </div>

          <div ref={profileRef} className="relative">
            <ProfileButton
              avatarUrl={profile?.avatar_url}
              onClick={() => {
                setShowNotifications(false)
                setShowProfile((prev) => !prev)
              }}
              ariaLabel={showProfile ? 'Fechar menu do perfil' : 'Abrir menu do perfil'}
              testId="profile-button"
            />
            <ProfileMenu open={showProfile}>
              <ProfileMenuContent
                displayName={profile?.display_name || user?.email || 'Usuário'}
                avatarUrl={profile?.avatar_url}
                level={profile?.level || 'Explorador'}
                credits={credits}
                creditsUsedToday={creditsUsedToday}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
                onNavigate={() => setShowProfile(false)}
              />
            </ProfileMenu>
          </div>
        </div>
      </div>

    </motion.header>
  )
}
