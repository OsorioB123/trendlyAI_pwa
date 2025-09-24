'use client'

import { useState } from 'react'
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
  useHeaderData
} from './shared'
import { usePaywall } from '@/components/paywall/PaywallProvider'

export function PrimaryHeader() {
  const router = useRouter()
  const { notifications, credits, creditsUsedToday } = useHeaderState()
  const { user, profile, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { open: openPaywall } = usePaywall()

  useHeaderData(user?.id)

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
        className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        data-testid="primary-header"
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 text-left text-white transition-opacity hover:opacity-80"
        >
          <Image
            src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png"
            alt="TrendlyAI"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </button>

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

          <div className="relative">
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
              <span className="absolute right-2 top-2 inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </button>
            <NotificationsMenu open={showNotifications}>
              <div className="flex items-center justify-between px-2 pb-2">
                <h4 className="text-sm font-semibold text-white">Notificações</h4>
                <button className="text-xs text-white/60 transition-colors hover:text-white">Marcar como lidas</button>
              </div>
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className="block w-full rounded-xl px-3 py-2 text-left text-white/80 transition-all hover:bg-white/10"
                  >
                    <p className="text-sm text-white">{notification.message}</p>
                    <span className="text-xs text-white/50">{notification.time}</span>
                  </button>
                ))}
              </div>
              <button className="mt-3 w-full rounded-xl px-3 py-2 text-center text-xs text-white/70 transition-colors hover:bg-white/10">
                Ver todas
              </button>
            </NotificationsMenu>
          </div>

          <div className="relative">
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
