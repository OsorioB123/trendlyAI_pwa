'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { respectReducedMotion } from '@/lib/motion'
import { ArrowLeft, Gem, Download, PauseCircle, XCircle, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSubscription } from '../../hooks/useSubscription'
import { useToastActions } from '../../components/ui/Toast'
import { useAuth } from '../../contexts/AuthContext'
import { 
  SUBSCRIPTION_STATUS_LABELS,
  BILLING_STATUS_LABELS,
  type BillingHistoryItem
} from '../../types/subscription'

export default function SubscriptionPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const subscription = useSubscription()
  const toast = useToastActions()
  
  // UI state
  const [showPlanOptions, setShowPlanOptions] = useState(false)
  const [showBillingHistory, setShowBillingHistory] = useState(false)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showCancelView, setShowCancelView] = useState(false)
  
  // Form state for modals
  const [cancelReason, setCancelReason] = useState('')
  const [selectedPauseMonths, setSelectedPauseMonths] = useState<number | null>(null)
  const [isPauseLoading, setIsPauseLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)
  const transitionSafe = respectReducedMotion({ transition: { duration: 0.35 } }).transition as any

  if (subscription.isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="h-20" />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-64" />
            <div className="h-64 bg-white/5 rounded-2xl" />
            <div className="h-32 bg-white/5 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  const handlePauseConfirm = async () => {
    if (!selectedPauseMonths) return

    try {
      setIsPauseLoading(true)
      const response = await subscription.pauseSubscription({
        months: selectedPauseMonths
      })

      if (response.success) {
        const futureDate = new Date()
        futureDate.setMonth(futureDate.getMonth() + selectedPauseMonths)
        const formattedDate = futureDate.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
        toast.success('Assinatura pausada', `Será reativada em ${formattedDate}.`)
        
        setShowPauseModal(false)
        setSelectedPauseMonths(null)
      } else if (response.error) {
        toast.error('Erro ao pausar assinatura', response.error)
      }
    } catch (e) {
      toast.error('Erro ao pausar assinatura')
    } finally {
      setIsPauseLoading(false)
    }
  }

  const handleCancelConfirm = async () => {
    try {
      setIsCancelLoading(true)
      const response = await subscription.cancelSubscription({
        reason: cancelReason
      })

      if (response.success) {
        toast.success('Assinatura cancelada')
        setShowCancelView(false)
        setCancelReason('')
      } else if (response.error) {
        toast.error('Erro ao cancelar', response.error)
      }
    } catch (e) {
      toast.error('Erro ao cancelar assinatura')
    } finally {
      setIsCancelLoading(false)
    }
  }

  const handleBackToMain = () => {
    setShowCancelView(false)
    setCancelReason('')
  }

  const handleDownloadReceipt = async (item: BillingHistoryItem) => {
    const res = await subscription.downloadReceipt(item.id)
    if (res.success) {
      toast.success('Recibo gerado', 'Abrindo em nova aba...')
    } else if (res.error) {
      toast.error('Erro ao baixar recibo', res.error)
    }
  }

  // Calculate usage percentage
  const usagePercentage = subscription.creditsInfo 
    ? subscription.creditsInfo.percentage 
    : 0

  if (showCancelView) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="h-20" />
        
        <main className="w-full mx-auto">
          <div className="max-w-3xl relative mr-auto ml-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transitionSafe}>
              <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
                Temos pena de o ver partir.
              </h1>
              <p className="text-white/70 mb-8">
                {subscription.subscription?.current_period_end 
                  ? `Seu acesso continuará até ${subscription.subscription.current_period_end.toLocaleDateString('pt-BR')}.`
                  : 'Seu acesso continuará até o fim do ciclo de cobrança.'
                }
              </p>
            </motion.div>
            
            <motion.div className="liquid-glass p-6 md:p-8 rounded-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...(transitionSafe || {}), delay: 0.1 }}>
              <label htmlFor="cancel-reason" className="font-medium text-white block mb-2">
                O que poderíamos ter feito melhor? (Opcional)
              </label>
              <textarea 
                id="cancel-reason" 
                rows={4} 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all resize-none" 
                placeholder="Seu feedback é muito valioso para nós..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="mt-6 flex flex-col sm:flex-row-reverse gap-4">
                <button 
                  onClick={handleCancelConfirm}
                  disabled={isCancelLoading}
                  className="w-full sm:w-auto bg-red-800/50 hover:bg-red-800/70 text-white font-medium py-3 px-6 rounded-full transition-all hover:shadow-lg hover:shadow-red-800/20 disabled:opacity-50"
                >
                  {isCancelLoading ? 'Processando...' : 'Sim, cancelar minha assinatura'}
                </button>
                <button 
                  onClick={handleBackToMain}
                  disabled={isCancelLoading}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-all disabled:opacity-50"
                >
                  Não, quero continuar
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="h-20" />

      <main className="w-full mx-auto">
        <div className="max-w-3xl relative mr-auto ml-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transitionSafe}>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">
                  Gerenciar Assinatura
                </h1>
                <p className="text-white/60">Seu painel de controle de valor.</p>
              </div>
            </div>
          </motion.div>

          {/* Main Subscription Card */}
          <motion.div className="liquid-glass p-6 md:p-8 my-8 rounded-2xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...(transitionSafe || {}), delay: 0.1 }}>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                  <Gem className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    {subscription.subscription?.plan?.name || 'Plano Explorador'}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    subscription.isActive ? 'bg-green-500/20 text-green-400' :
                    subscription.isPaused ? 'bg-yellow-500/20 text-yellow-400' :
                    subscription.isCanceled ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {subscription.subscription?.status ? 
                      SUBSCRIPTION_STATUS_LABELS[subscription.subscription.status] : 
                      'Ativo'
                    }
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">
                    {subscription.creditsInfo?.used || 0}
                  </span>
                  <span className="text-white/60">
                    {subscription.creditsInfo?.isUnlimited 
                      ? 'insights gerados este mês'
                      : `de ${subscription.creditsInfo?.limit || 50} insights usados`
                    }
                  </span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-auto sm:text-right flex-shrink-0 pt-2 space-y-1">
                <div className="flex justify-between sm:justify-start sm:gap-4 items-center">
                  <span className="text-sm text-white/70">Renova em:</span>
                  <strong className="text-sm text-white">
                    {subscription.subscription?.current_period_end 
                      ? subscription.subscription.current_period_end.toLocaleDateString('pt-BR')
                      : '15 de Fev, 2025'
                    }
                  </strong>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-4 items-center">
                  <span className="text-sm text-white/70">Valor:</span>
                  <strong className="text-sm text-white">
                    R$ {subscription.subscription?.plan?.price_brl?.toFixed(2) || '0,00'}
                  </strong>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-white/70 mt-4">
              {subscription.defaultPaymentMethod ? (
                <>
                  Cobrado no seu {subscription.defaultPaymentMethod.brand} terminando em {subscription.defaultPaymentMethod.last_four}.{' '}
                  <button className="font-medium text-white hover:text-white/80 transition-colors hover:underline">
                    Atualizar
                  </button>
                </>
              ) : (
                <>
                  Nenhum método de pagamento configurado.{' '}
                  <button className="font-medium text-white hover:text-white/80 transition-colors hover:underline">
                    Adicionar
                  </button>
                </>
              )}
            </div>
            
            <div className="h-px bg-white/10 my-6" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                onClick={() => setShowBillingHistory(!showBillingHistory)}
                className="text-sm text-white/60 hover:text-white transition-colors"
                aria-expanded={showBillingHistory}
                aria-controls="billing-history-section"
              >
                {showBillingHistory ? 'Ocultar histórico de cobranças' : 'Ver histórico completo de cobranças'}
              </button>
              <button 
                onClick={() => setShowPlanOptions(!showPlanOptions)}
                className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-white/15 transition-all"
                aria-expanded={showPlanOptions}
                aria-controls="plan-options-section"
              >
                <span>{showPlanOptions ? 'Ocultar Opções' : 'Ver Opções de Plano'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showPlanOptions ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.div>

          {/* Billing History */}
          {showBillingHistory && (
            <motion.div id="billing-history-section" className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...(transitionSafe || {}), delay: 0.2 }}>
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                Histórico de Cobranças
              </h2>
              <div className="liquid-glass rounded-2xl">
                {subscription.billingHistory.length > 0 ? (
                  <ul className="divide-y divide-white/10">
                    {subscription.billingHistory.map((item) => (
                      <li key={item.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors duration-200">
                        <div>
                          <p className="font-medium text-white">
                            {item.billing_date.toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-white/60">
                            {item.description || 'Plano Mestre Criador - Mensal'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="font-semibold text-white">
                              R$ {item.amount_brl.toFixed(2).replace('.', ',')}
                            </span>
                            <div className="text-xs text-white/60">
                              {BILLING_STATUS_LABELS[item.status]}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDownloadReceipt(item)}
                            title="Baixar Recibo" 
                            className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-white/60">
                    Nenhum histórico de cobrança disponível
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Plan Options */}
          {showPlanOptions && (
            <motion.div id="plan-options-section" className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...(transitionSafe || {}), delay: 0.3 }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="liquid-glass p-6 rounded-2xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                    <PauseCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Pausar Assinatura</h3>
                  <p className="text-white/70 mb-4 text-sm">
                    Precisa de uma pausa? Seu arsenal e progresso ficarão salvos.
                  </p>
                  <button 
                    onClick={() => setShowPauseModal(true)}
                    disabled={subscription.isPaused}
                    className="w-full py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscription.isPaused ? 'Já Pausada' : 'Pausar Assinatura'}
                  </button>
                </div>
                
                <div className="liquid-glass p-6 rounded-2xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Cancelar Assinatura</h3>
                  <p className="text-white/70 mb-4 text-sm">
                    Seu acesso continuará até o fim do ciclo de cobrança.
                  </p>
                  <button 
                    onClick={() => setShowCancelView(true)}
                    disabled={subscription.isCanceled}
                    className="w-full py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscription.isCanceled ? 'Já Cancelada' : 'Prosseguir'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Pausar sua jornada</h3>
              <button 
                onClick={() => {
                  setShowPauseModal(false)
                  setSelectedPauseMonths(null)
                }}
                className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-sm text-white/70 mb-4">
              Selecione por quanto tempo deseja pausar. Nenhuma cobrança será feita neste período.
            </p>
            
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((months) => (
                <button 
                  key={months}
                  onClick={() => setSelectedPauseMonths(months)}
                  className={`flex-1 p-3 text-sm font-medium border rounded-lg transition-all ${
                    selectedPauseMonths === months 
                      ? 'bg-white/20 border-white' 
                      : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  {months} Mês{months > 1 ? 'es' : ''}
                </button>
              ))}
            </div>
            
            {selectedPauseMonths && (
              <p className="text-xs text-center text-white/60 mb-4">
                Sua assinatura será reativada em{' '}
                {new Date(Date.now() + selectedPauseMonths * 30 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
            
            <button 
              onClick={handlePauseConfirm}
              disabled={!selectedPauseMonths || isPauseLoading}
              className={`w-full bg-white text-black font-bold py-3 px-6 rounded-full transition-all ${
                selectedPauseMonths && !isPauseLoading
                  ? 'hover:bg-gray-100' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isPauseLoading ? 'Processando...' : 'Confirmar Pausa'}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {subscription.error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          {subscription.error}
        </div>
      )}

      <style jsx>{`
        .animate-entry {
          opacity: 0;
          transform: translateY(20px);
          animation: slideInFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-1 { animation-delay: 0.15s; }
        .animate-entry.delay-2 { animation-delay: 0.3s; }
        .animate-entry.delay-3 { animation-delay: 0.45s; }
        
        @keyframes slideInFade { 
          to { opacity: 1; transform: translateY(0); } 
        }

        .liquid-glass {
          backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
        }
      `}</style>
    </div>
  )
}
