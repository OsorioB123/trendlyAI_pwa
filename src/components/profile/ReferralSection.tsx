
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, DollarSign, Copy, ArrowRight, Check, Sparkles } from 'lucide-react'
import type { ReferralSectionProps, ReferralTab } from '../../types/profile'
import { REFERRAL_TABS } from '../../types/profile'
import { MOTION_CONSTANTS, respectReducedMotion } from '@/lib/motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

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
      className={cn('mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_120px_-60px_rgba(0,0,0,0.8)] backdrop-blur-2xl', className)}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ReferralTab)} className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/50">Convidar e Ganhar</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-[2.2rem]">
              Transforme conexões em resultados
            </h2>
          </div>
          <TabsList className="bg-white/10 p-1 text-white/70">
            <TabsTrigger value="credits" className="px-5 py-2 text-sm data-[state=active]:bg-white/25 data-[state=active]:text-white">
              <Gift className="mr-2 h-4 w-4" />
              {REFERRAL_TABS.credits.label}
            </TabsTrigger>
            <TabsTrigger value="affiliate" className="px-5 py-2 text-sm data-[state=active]:bg-white/25 data-[state=active]:text-white">
              <DollarSign className="mr-2 h-4 w-4" />
              {REFERRAL_TABS.affiliate.label}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="credits">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-8 md:p-10 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-semibold text-white md:text-3xl">
                  Convide um amigo, ganhe 20 créditos.
                </h3>
                <p className="text-sm leading-relaxed text-white/70 md:text-base">
                  Quando seu amigo se cadastra usando seu link, vocês dois ganham créditos para usar na plataforma.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  <Sparkles className="h-4 w-4" />
                  Bônus instantâneo
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="rounded-full bg-black/40 px-5 py-3 text-center text-sm font-medium text-white/80 md:text-left">
                    {getReferralLink()}
                  </div>
                  <button
                    onClick={handleCopyReferralLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
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
          </div>
        </TabsContent>

        <TabsContent value="affiliate">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-8 md:p-10 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.8)]">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white md:text-3xl">
                Torne-se nosso Parceiro.
              </h3>
              <p className="text-sm leading-relaxed text-white/70 md:text-base">
                Como Maestro, você tem acesso exclusivo ao nosso programa de afiliados. Ganhe
                <strong> 10% de comissão recorrente </strong>
                para cada novo assinante que indicar.
              </p>

              {referralInfo?.is_affiliate_eligible ? (
                <button
                  onClick={onNavigateToAffiliate}
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
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
                    className="inline-flex cursor-not-allowed items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white/40"
                  >
                    Em breve disponível para você
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.section>
  )
}
