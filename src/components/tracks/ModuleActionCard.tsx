'use client'

import { ArrowRight, CheckCircle2, MessageCircle, Sparkles, Wrench, X } from 'lucide-react'
import type { ModuleState, TrackModule, TrackWithModules } from '@/types/track'
import { cn } from '@/lib/utils'
import { forwardRef, type CSSProperties, type ReactNode } from 'react'

export interface ModuleActionCardProps {
  module: TrackModule | null
  track: TrackWithModules
  state: ModuleState
  visible: boolean
  orientation: 'left' | 'right' | 'center'
  style?: CSSProperties
  onStartOrResume: () => void
  onComplete: () => void
  onOpenTools?: () => void
  onChat?: () => void
  onClose: () => void
  isModuleCompleted: boolean
  toolsOpen?: boolean
  children?: ReactNode
}

const Button = ({
  children,
  variant = 'primary',
  onClick,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick: () => void
}) => {
  const base = 'btn flex w-full items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300'
  const primary = 'btn-primary'
  const secondary = 'btn-secondary'
  return (
    <button type="button" className={cn(base, variant === 'primary' ? primary : secondary)} onClick={onClick}>
      {children}
    </button>
  )
}

export const ModuleActionCard = forwardRef<HTMLDivElement, ModuleActionCardProps>(function ModuleActionCard({
  module,
  track,
  state,
  visible,
  orientation,
  style,
  onStartOrResume,
  onComplete,
  onOpenTools,
  onChat,
  onClose,
  isModuleCompleted,
  toolsOpen = false,
  children,
}: ModuleActionCardProps, ref) {
  if (!module) {
    return null
  }

  const moduleIndex = track.modules.findIndex((item) => item.id === module.id)
  const moduleNumber = moduleIndex + 1
  const promptsCount = module.content.prompts?.length ?? 0
  const toolsCount = Array.isArray(module.tools) ? module.tools.length : 0

  const primaryLabel = (() => {
    if (state === 'completed' || isModuleCompleted) return 'Revisar módulo'
    if (state === 'current') return 'Continuar módulo'
    return 'Iniciar módulo'
  })()

  return (
    <div
      ref={ref}
      className={cn(
        'module-action-card content-card rounded-2xl',
        visible && 'is-visible',
        orientation === 'left' && 'on-left',
        orientation === 'right' && 'on-right'
      )}
      style={style}
    >
      <div className="card-pointer" aria-hidden="true" />
      <div className="p-4 bg-[rgba(38,38,38,1)] rounded-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
          aria-label="Fechar card do módulo"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pr-8">
          <span className="text-xs uppercase tracking-wide text-white/60">Etapa {moduleNumber} de {track.modules.length}</span>
          <h3 className="mt-2 text-lg font-semibold text-white" style={{ fontFamily: 'Geist, sans-serif' }}>
            {module.title}
          </h3>
          <p className="mt-2 text-sm text-white/70">{module.content.briefing}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
          <span className="liquid-glass-pill px-3 py-1">{promptsCount} prompts</span>
          {toolsCount > 0 && <span className="liquid-glass-pill px-3 py-1">{toolsCount} ferramentas</span>}
          {isModuleCompleted && (
            <span className="liquid-glass-pill px-3 py-1 flex items-center gap-1 text-green-300">
              <CheckCircle2 className="w-3 h-3" />
              Concluído
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={onStartOrResume}>
            <ArrowRight className="w-4 h-4" />
            {primaryLabel}
          </Button>

          {toolsCount > 0 && onOpenTools && (
            <Button variant="secondary" onClick={onOpenTools}>
              <Wrench className="w-4 h-4" />
              {toolsOpen ? 'Ocultar ferramentas' : 'Ver ferramentas do módulo'}
            </Button>
          )}

          {onChat && (
            <Button variant="secondary" onClick={onChat}>
              <Sparkles className="w-4 h-4" />
              Refinar com Salina
            </Button>
          )}

          {!isModuleCompleted && state === 'current' && (
            <Button variant="secondary" onClick={onComplete}>
              <MessageCircle className="w-4 h-4" />
              Concluir etapa
            </Button>
          )}
        </div>

        {children}
      </div>
    </div>
  )
})

export default ModuleActionCard
