"use client"

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, X, ShieldCheck, Lock, RefreshCw } from 'lucide-react'

interface PaywallSheetProps {
  open: boolean
  onClose: () => void
}

type PaywallPlan = {
  id: string
  title: string
  price: string
  cadence: string
  note: string
  ctaLabel: string
  ctaClass: string
  recommended: boolean
  delay: number
  planParam: string
}

const PLANS: PaywallPlan[] = [
  {
    id: 'plan-anual',
    title: 'Plano Anual',
    price: 'R$149',
    cadence: '/mês',
    note: 'Cobrado R$1.788 anualmente. Uma economia de 50%.',
    ctaLabel: 'Entrar para o Estúdio (Anual)',
    ctaClass: 'cta-button cta-primary cta-light-flow',
    recommended: true,
    delay: 300,
    planParam: 'annual'
  },
  {
    id: 'plan-trimestral',
    title: 'Plano Trimestral',
    price: 'R$299',
    cadence: '/mês',
    note: 'Cobrado R$897 trimestralmente.',
    ctaLabel: 'Continuar com o Trimestral',
    ctaClass: 'cta-button cta-secondary',
    recommended: false,
    delay: 450,
    planParam: 'quarterly'
  }
]

function PaywallSheet({ open, onClose }: PaywallSheetProps) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)
  const [recommended, setRecommended] = useState<string>('plan-anual')
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  const redirectToPlan = useCallback((planParam: string) => {
    if (typeof window === 'undefined') return
    const href = planParam ? `/subscription?plan=${planParam}` : '/subscription'
    window.location.assign(href)
  }, [])

  useEffect(() => {
    if (open) {
      setVisible(true)
    }
  }, [open])

  useEffect(() => {
    if (!visible) return
    if (open) {
      scrollRef.current?.scrollTo({ top: 0 })
      rafRef.current = requestAnimationFrame(() => setActive(true))
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    }

    setActive(false)
    const timeout = setTimeout(() => setVisible(false), 600)
    return () => clearTimeout(timeout)
  }, [open, visible])

  useEffect(() => {
    if (!active) return
    const sheet = sheetRef.current
    if (!sheet) return

    let isDragging = false
    let startY = 0
    let currentY = 0
    let startTime = 0

    const handlePointerDown = (event: PointerEvent) => {
      const y = event.clientY
      const rect = sheet.getBoundingClientRect()
      const handleAreaHeight = 80
      if (y > rect.top + handleAreaHeight) return
      isDragging = true
      startY = y
      startTime = Date.now()
      sheet.style.transition = 'none'
      sheet.style.willChange = 'transform'
      window.addEventListener('pointermove', handlePointerMove, { passive: false })
      window.addEventListener('pointerup', handlePointerUp)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return
      event.preventDefault()
      currentY = event.clientY
      const delta = currentY - startY
      if (delta > 0) {
        sheet.style.transform = `translateY(${delta}px)`
      }
    }

    const handlePointerUp = () => {
      if (!isDragging) return
      isDragging = false
      const delta = currentY - startY
      const deltaTime = Date.now() - startTime || 1
      const velocity = delta / deltaTime
      sheet.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      const threshold = sheet.offsetHeight * 0.3
      if (delta > threshold || (velocity > 0.5 && delta > 50)) {
        onClose()
      } else {
        sheet.style.transform = 'translateY(0)'
      }
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      sheet.style.willChange = ''
    }

    sheet.addEventListener('pointerdown', handlePointerDown)
    return () => {
      sheet.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [active, onClose])

  const containerClass = useMemo(() => {
    const base = 'fixed inset-0 z-[999] flex items-end justify-center paywall-overlay'
    return active ? `${base} paywall-active` : `${base} paywall-inactive`
  }, [active])

  if (!visible) return null

  return createPortal(
    <div className={containerClass} role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className={`absolute inset-0 bg-black/30 paywall-backdrop ${active ? 'active' : ''}`} onClick={onClose} />
      <div
        ref={sheetRef}
        className={`liquid-glass relative w-full h-[85vh] md:h-[70vh] rounded-t-2xl flex flex-col paywall-sheet ${active ? 'active' : ''}`}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 md:hidden" aria-hidden>
          <div className="grabber-bar" />
        </div>
        <button
          type="button"
          className="hidden md:flex absolute top-4 right-4 w-10 h-10 items-center justify-center liquid-glass-pill !rounded-full z-20"
          onClick={onClose}
          aria-label="Fechar paywall"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div
          ref={scrollRef}
          className="flex-grow pt-10 p-6 md:p-10 overflow-y-auto flex flex-col justify-start md:justify-center hide-scrollbar"
        >
          <div className="text-center mb-8 md:mb-10 relative z-10">
            <h2
              id="paywall-title"
              className="text-3xl md:text-5xl font-bold tracking-tight invitation-anim mb-4"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              Torne-se o Maestro.
            </h2>
            <p
              className="text-white/70 mt-3 max-w-2xl mx-auto invitation-anim text-lg"
              style={{ animationDelay: '150ms' }}
            >
              Acesso ilimitado a todas as estratégias, instrumentos e ao poder de orquestração do nosso Estúdio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mx-auto mb-8 md:mb-10 relative z-10">
            {PLANS.map((plan) => {
              const isSelected = recommended === plan.id
              const classes = ['plan-card invitation-anim', isSelected ? 'recommended' : '']
              return (
                <div
                  key={plan.id}
                  className={classes.join(' ')}
                  style={{ animationDelay: `${plan.delay}ms` }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setRecommended(plan.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setRecommended(plan.id)
                    }
                  }}
                >
                  {plan.recommended && <div className="card-glow" aria-hidden />}
                  <div className="relative z-10 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg text-white">{plan.title}</h3>
                      {plan.recommended ? (
                        <span className="recommendation-tag whitespace-nowrap">
                          <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                          Nossa Recomendação
                        </span>
                      ) : null}
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                      <span className="text-white/70">{plan.cadence}</span>
                      <p className="text-xs font-normal text-white/60 mt-2">{plan.note}</p>
                    </div>
                    <button
                      type="button"
                      className={plan.ctaClass}
                      onClick={(event) => {
                        event.stopPropagation()
                        redirectToPlan(plan.planParam)
                      }}
                    >
                      {plan.ctaLabel}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/70 invitation-anim relative z-10 pt-6"
            style={{ animationDelay: '600ms' }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-green)]" strokeWidth={1.5} />
              <span>Garantia de 21 Dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              <span>Cancele a Qualquer Momento</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --brand-green: #2fd159;
        }
        .paywall-overlay {
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          pointer-events: none;
        }
        .paywall-active {
          opacity: 1;
          pointer-events: auto;
        }
        .paywall-inactive {
          opacity: 0;
          pointer-events: none;
        }
        .paywall-backdrop {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
        }
        .paywall-backdrop.active {
          opacity: 1;
          backdrop-filter: saturate(0.8) blur(8px);
        }
        .paywall-sheet {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          touch-action: none;
          transform: translateY(100%);
          background-color: rgba(18, 18, 22, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(24px);
        }
        .paywall-sheet.active {
          transform: translateY(0);
        }
        .paywall-sheet::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 150%;
          height: 100%;
          background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.08), transparent 60%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.8s ease-out 0.4s;
        }
        .paywall-sheet.active::before {
          opacity: 1;
        }
        .liquid-glass-pill {
          backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .liquid-glass-pill:hover {
          background-color: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }
        .invitation-anim {
          opacity: 0;
          transform: translateY(20px);
          animation: item-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes item-enter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .plan-card {
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: left;
        }
        @media (min-width: 768px) {
          .plan-card.recommended {
            transform: scale(1.05);
            border-color: rgba(47, 209, 89, 0.25);
          }
        }
        .card-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, var(--brand-green) 0%, rgba(47, 209, 89, 0) 60%);
          opacity: 0;
          filter: blur(30px);
          mix-blend-mode: screen;
          border-radius: inherit;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .plan-card.recommended .card-glow::before {
          opacity: 0.35;
          animation: pulse 4s ease-in-out infinite alternate;
        }
        @keyframes pulse {
          from {
            opacity: 0.25;
            transform: scale(0.95);
          }
          to {
            opacity: 0.45;
            transform: scale(1.05);
          }
        }
        .cta-button {
          width: 100%;
          padding: 12px 0;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-primary {
          background-color: var(--brand-green);
          color: #000000;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .cta-primary:hover {
          transform: scale(1.03);
          background-color: #3de66e;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(47, 209, 89, 0.4);
        }
        .cta-light-flow::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(90deg, transparent, rgba(200, 255, 215, 0.5), transparent);
          width: 200%;
          opacity: 0.8;
          animation: flow-light 5s ease-in-out infinite;
          animation-delay: 2s;
        }
        @keyframes flow-light {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .cta-secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
        }
        .cta-secondary:hover {
          background-color: #ffffff;
          border-color: #ffffff;
          color: #000000;
        }
        .recommendation-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          background-color: #1a4d2a;
          color: var(--brand-green);
          border: 1px solid var(--brand-green);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .grabber-bar {
          width: 40px;
          height: 5px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
        }
      `}</style>
    </div>,
    document.body
  )
}

export default PaywallSheet

