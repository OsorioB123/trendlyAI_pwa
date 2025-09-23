'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Info, LogOut, Settings, HelpCircle, Gem } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHeaderState } from './SharedHeaderContext'
import ChatService from '@/lib/services/chatService'
import type { HeaderSharedProps } from './types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export function useHeaderData(userId?: string) {
  const { setCredits, setCreditsUsedToday } = useHeaderState()

  useEffect(() => {
    let mounted = true
    if (!userId) {
      setCredits(null)
      setCreditsUsedToday(null)
      return
    }

    const load = async () => {
      const [creditsResult, statsResult] = await Promise.all([
        ChatService.getUserCredits(userId),
        ChatService.getConversationStats(userId)
      ])

      if (!mounted) return
      setCredits(creditsResult.success ? creditsResult.data! : null)
      setCreditsUsedToday(statsResult.success ? statsResult.data!.credits_used_today : null)
    }

    void load()
    return () => {
      mounted = false
    }
  }, [userId, setCredits, setCreditsUsedToday])
}

export function NotificationsButton({
  children
}: {
  children: React.ReactNode
}) {
  return children
}

export function ProfileButton({
  avatarUrl,
  onClick,
  ariaLabel = 'Abrir menu do perfil',
  testId
}: {
  avatarUrl?: string
  onClick: () => void
  ariaLabel?: string
  testId?: string
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:shadow-[0_10px_32px_rgba(0,0,0,0.35)]"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <div className="relative h-9 w-9 overflow-hidden rounded-full">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Avatar" fill sizes="36px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-white/20" />
        )}
      </div>
    </button>
  )
}

export function NotificationsMenu({
  children,
  open
}: {
  children: React.ReactNode
  open: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, translateY: -8, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-3 w-[320px] rounded-2xl border border-white/15 bg-black/85 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ProfileMenu({
  children,
  open
}: {
  children: React.ReactNode
  open: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, translateY: -8, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-3 w-[320px] rounded-2xl border border-white/15 bg-black/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ProfileMenuContent({
  onNavigate,
  onLogout,
  isLoggingOut,
  credits,
  creditsUsedToday,
  displayName,
  avatarUrl,
  level
}: HeaderSharedProps['profileMenu']) {
  const router = useRouter()

  const handleNavigate = (href: string) => {
    onNavigate()
    router.push(href)
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill sizes="48px" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-white/10" />
          )}
        </div>
        <div>
          <h5 className="text-sm font-semibold">{displayName}</h5>
          <p className="text-xs text-white/60">✨ {level}</p>
        </div>
      </div>

      <button
        onClick={() => handleNavigate('/profile')}
        className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/20"
      >
        Meu Perfil
      </button>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Créditos da Salina</span>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-white/50 transition-colors hover:text-white" aria-label="Detalhes dos créditos">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="end" className="w-64 text-xs text-white">
                Seus créditos se renovam a cada 24h. Torne-se Maestro para liberar limites.
                {creditsUsedToday !== null && (
                  <div className="mt-2 text-white/70">Hoje: {creditsUsedToday}</div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${credits?.percentage ?? 0}%` }}
          />
        </div>
        <div className="text-right text-xs text-white/50">
          {(credits?.current ?? 0)}/{credits?.total ?? 0}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <button
          onClick={() => handleNavigate('/subscription')}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-white/80 transition-all hover:bg-white/10"
        >
          <Gem className="h-4 w-4" />
          Gerenciar Assinatura
        </button>
        <button
          onClick={() => handleNavigate('/settings')}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-white/80 transition-all hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
          Configurações da Conta
        </button>
        <button
          onClick={() => handleNavigate('/help')}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-white/80 transition-all hover:bg-white/10"
        >
          <HelpCircle className="h-4 w-4" />
          Central de Ajuda
        </button>
      </div>

      <Button
        variant="ghost"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 text-sm text-red-300 transition-all hover:bg-white/10 disabled:opacity-60"
      >
        {isLoggingOut ? 'Saindo...' : (
          <>
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </>
        )}
      </Button>
    </div>
  )
}
