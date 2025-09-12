'use client'

import { useState } from 'react'
import { Gift, DollarSign, Copy, ArrowRight, Check } from 'lucide-react'
import type { ReferralSectionProps, ReferralTab } from '../../types/profile'
import { REFERRAL_TABS } from '../../types/profile'

export default function ReferralSection({
  referralInfo,
  activeTab,
  onTabChange,
  onCopyReferralLink,
  onNavigateToAffiliate,
  className = ''
}: ReferralSectionProps) {
  const [copySuccess, setCopySuccess] = useState(false)

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
    <section className={`mt-16 animate-entry delay-3 ${className}`}>
      <h2 className="text-3xl font-medium text-white tracking-tight mb-8">Convidar e Ganhar</h2>

      {/* Tab Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button 
          onClick={() => onTabChange('credits')}
          className={`bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 font-medium transition-all flex items-center gap-3 ${
            activeTab === 'credits' 
              ? 'bg-white/20 border-white/30 text-white transform scale-100 shadow-lg' 
              : 'text-white/60 hover:text-white hover:bg-white/15'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>{REFERRAL_TABS.credits.label}</span>
        </button>
        <button 
          onClick={() => onTabChange('affiliate')}
          className={`bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 font-medium transition-all flex items-center gap-3 ${
            activeTab === 'affiliate' 
              ? 'bg-white/20 border-white/30 text-white transform scale-100 shadow-lg' 
              : 'text-white/60 hover:text-white hover:bg-white/15'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{REFERRAL_TABS.affiliate.label}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[320px]">
        <div className="bg-white/8 backdrop-blur-lg border border-white/12 rounded-2xl w-full p-8 md:p-10">
          <div className="relative w-full h-full">
            
            {/* Conteúdo: Indique e Ganhe Créditos */}
            {activeTab === 'credits' && (
              <div className="flex flex-col justify-center h-full">
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
                  Convide um amigo, ganhe 20 créditos.
                </h3>
                <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                  Quando seu amigo se cadastra usando seu link, vocês dois ganham créditos para usar na plataforma.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                  <div className="flex-grow w-full sm:w-auto bg-black/30 border border-white/10 rounded-full px-5 py-3 text-white/80 text-center sm:text-left">
                    {getReferralLink()}
                  </div>
                  <button 
                    onClick={handleCopyReferralLink}
                    className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 w-full sm:w-auto font-medium flex items-center justify-center gap-2 hover:bg-white/15 hover:scale-105 transition-all duration-300"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-sm text-white/50">
                  Você já ganhou <strong>{referralInfo?.total_credits || 0} créditos</strong> com suas indicações.
                </p>
              </div>
            )}

            {/* Conteúdo: Programa de Afiliados */}
            {activeTab === 'affiliate' && (
              <div className="flex flex-col justify-center h-full">
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
                  Torne-se nosso Parceiro.
                </h3>
                <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                  Como Maestro, você tem acesso exclusivo ao nosso programa de afiliados. Ganhe <strong>10% de comissão recorrente</strong> para cada novo assinante que indicar.
                </p>
                
                {referralInfo?.is_affiliate_eligible ? (
                  <div className="flex">
                    <button 
                      onClick={onNavigateToAffiliate}
                      className="bg-white text-black rounded-full px-8 py-4 font-semibold flex items-center gap-3 hover:bg-gray-100 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                    >
                      <span>Acessar Painel de Afiliado</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-white font-medium mb-2">Requisitos para se tornar um Afiliado:</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Assinatura Maestro ativa</li>
                        <li>• Pelo menos 5 indicações bem-sucedidas</li>
                        <li>• Perfil completo com bio e avatar</li>
                      </ul>
                    </div>
                    <button 
                      disabled
                      className="bg-white/5 text-white/40 rounded-full px-8 py-4 font-semibold flex items-center gap-3 cursor-not-allowed"
                    >
                      <span>Em breve disponível para você</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        .animate-entry {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-3 { 
          animation-delay: 0.45s; 
        }
        
        @keyframes slideInFade {
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </section>
  )
}