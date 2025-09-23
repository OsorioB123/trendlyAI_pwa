'use client'

import { useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Bell, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useHeaderState } from './SharedHeaderContext'
import {
  ProfileButton,
  ProfileMenu,
  ProfileMenuContent,
  NotificationsMenu,
  useHeaderData
} from './shared'
import { UpgradeSheet } from './upgrade/UpgradeSheet'

export function SecondaryHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { notifications, credits, creditsUsedToday } = useHeaderState()
  const { user, profile, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useHeaderData(user?.id)

  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname])
  const pageTitle = segments.length ? segments[segments.length - 1] : 'Dashboard'

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

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
        data-testid="secondary-header"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/15"
            data-testid="back-button"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => router.push('/dashboard')} className="hidden items-center transition-opacity hover:opacity-80 md:flex">
            <Image
              src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png"
              alt="TrendlyAI"
              width={160}
              height={40}
              className="h-8 w-auto"
            />
          </button>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm uppercase tracking-[0.3em] text-white/50">
            {pageTitle.replace(/-/g, ' ')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpgrade(true)}
            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-white/25 md:inline-flex"
            data-testid="upgrade-button"
            aria-label="Abrir planos Maestro"
          >
            Explorar Maestro
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(false)
                setShowNotifications((prev) => !prev)
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/20"
              aria-label={showNotifications ? 'Fechar notificações' : 'Abrir notificações'}
              data-testid="notifications-button"
            >
              <Bell className="h-5 w-5" />
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

      <UpgradeSheet open={showUpgrade} onOpenChange={setShowUpgrade} />
    </motion.header>
  )
}
