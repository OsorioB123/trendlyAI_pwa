'use client'

import { useState, type ElementType } from 'react'
import { motion } from 'framer-motion'
import { Gift, DollarSign, Copy, ArrowRight, Check, Sparkles } from 'lucide-react'
import type { ReferralSectionProps, ReferralTab } from '../../types/profile'
import { REFERRAL_TABS } from '../../types/profile'
import { MOTION_CONSTANTS, respectReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const REFERRAL_TAB_ITEMS: { id: ReferralTab; label: string; icon: ElementType }[] = [
  { id: 'credits', label: REFERRAL_TABS.credits.label, icon: Gift },
  { id: 'affiliate', label: REFERRAL_TABS.affiliate.label, icon: DollarSign }
]

export default function ReferralSection({
  referralInfo,
  activeTab,
  onTabChange,
  onCopyReferralLink,
  onNavigateToAffiliate,
  className = ''
}: ReferralSectionProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const transitionSafe = respectReducedMotion({ transition: { duration: 0.3 } }).transition as any

  const handleCopyReferralLink = async () => {
    if (!referralInfo?.referral_code) return

    try {
      const referralLink = `https://trendly.ai/ref/${referralInfo.referral_code}`
      await navigator.clipboard.writeText(referralLink)
      
      setCopySuccess(true)
      onCopyReferralLink?.()
      
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy referral link:', error)
    }
  }

  const getReferralLink = () => {
    if (!referralInfo?.referral_code) return 'trendly.ai/ref/seucódigo'
    return `trendly.ai/ref/${referralInfo.referral_code}`
  }

  return (
    <motion.section
      className={cn('animate-entry delay-3', className)}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <h2 className="mb-8 text-3xl font-medium text-white tracking-tight">Convidar e Ganhar</h2>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {REFERRAL_TAB_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={cn(
              'liquid-glass-pill flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors',
              activeTab === id ? 'text-white/80' : 'text-white/60 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="liquid-glass rounded-[20px] p-8 md:p-10">
        {activeTab === 'credits' ? (
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-medium text-white md:text-3xl">
                Convide um amigo, ganhe 20 créditos.
              </h3>
              <p className="text-base leading-relaxed text-white/70">
                Quando seu amigo se cadastra usando seu link, vocês dois ganham créditos para usar na plataforma.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                <Sparkles className="h-4 w-4" />
                Bônus instantâneo
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="rounded-full border border-white/10 bg-black/30 px-5 py-3 text-center text-sm font-medium text-white/80 md:text-left">
                  {getReferralLink()}
                </div>
                <button
                  onClick={handleCopyReferralLink}
                  className="liquid-glass-pill inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar Link
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-white/60">
                Você já ganhou <strong className="text-white">{referralInfo?.total_credits || 0} créditos</strong> com suas indicações.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-medium text-white md:text-3xl">
              Torne-se nosso Parceiro.
            </h3>
            <p className="text-base leading-relaxed text-white/70">
              Como Maestro, você tem acesso exclusivo ao nosso programa de afiliados. Ganhe
              <strong> 10% de comissão recorrente </strong>
              para cada novo assinante que indicar.
            </p>

            {referralInfo?.is_affiliate_eligible ? (
              <button
                onClick={onNavigateToAffiliate}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white px-8 py-4 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              >
                Acessar painel de afiliado
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h4 className="text-white font-medium">Requisitos para se tornar um Afiliado</h4>
                  <ul className="mt-3 space-y-1 text-sm text-white/60">
                    <li>• Assinatura Maestro ativa</li>
                    <li>• Pelo menos 5 indicações bem-sucedidas</li>
                    <li>• Perfil completo com bio e avatar</li>
                  </ul>
                </div>
                <button
                  disabled
                  className="liquid-glass-pill inline-flex cursor-not-allowed items-center gap-3 px-8 py-4 text-sm font-semibold text-white/50"
                >
                  Em breve disponível para você
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  )
}
