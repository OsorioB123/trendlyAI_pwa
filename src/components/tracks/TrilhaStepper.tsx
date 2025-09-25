'use client'

import { useMemo, useRef } from 'react'
import { Check, Lock, Sparkles } from 'lucide-react'
import type { ModuleState, TrackModule, TrackWithModules } from '@/types/track'
import { cn } from '@/lib/utils'

export interface TrilhaStepperProps {
  track: TrackWithModules
  onSelectModule: (args: {
    module: TrackModule
    state: ModuleState
    orientation: 'left' | 'right'
    element: HTMLLIElement | null
  }) => void
}

const getDefaultCurrentModuleId = (track: TrackWithModules, completedIds: Set<string>) => {
  if (track.userProgress?.currentModuleId) {
    return track.userProgress.currentModuleId
  }
  const firstIncomplete = track.modules.find((module) => !completedIds.has(module.id))
  return firstIncomplete?.id
}

export function TrilhaStepper({ track, onSelectModule }: TrilhaStepperProps) {
  const completedIds = useMemo(
    () => new Set(track.moduleProgress.filter((progress) => progress.isCompleted).map((progress) => progress.moduleId)),
    [track.moduleProgress]
  )

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const currentModuleId = getDefaultCurrentModuleId(track, completedIds)

  const resolveState = (module: TrackModule, index: number): ModuleState => {
    if (completedIds.has(module.id)) {
      return 'completed'
    }

    if (currentModuleId === module.id) {
      return 'current'
    }

    if (index === 0) {
      return 'available'
    }

    const previousModule = track.modules[index - 1]
    const previousCompleted = completedIds.has(previousModule.id)

    return previousCompleted ? 'available' : 'locked'
  }

  const handleModuleClick = (module: TrackModule, index: number) => {
    const state = resolveState(module, index)
    if (state === 'locked') {
      return
    }

    const orientation: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right'
    onSelectModule({
      module,
      state,
      orientation,
      element: itemRefs.current[module.id] || null,
    })
  }

  return (
    <div className="trilha-container" data-testid="trilha-stepper">
      <ol className="trilha-timeline">
        {track.modules.map((module, index) => {
          const state = resolveState(module, index)
          const liClassName = cn(
            'trilha-etapa',
            state === 'completed' && 'trilha-etapa--concluida',
            state === 'current' && 'trilha-etapa--atual',
            state === 'locked' && 'trilha-etapa--bloqueada'
          )

          return (
            <li
              key={module.id}
              ref={(element) => {
                itemRefs.current[module.id] = element
              }}
              className={liClassName}
              data-step-id={index + 1}
            >
              <button
                type="button"
                className={cn('trilha-btn', state === 'current' && 'liquid-glass-pill')}
                onClick={() => handleModuleClick(module, index)}
                aria-label={`Etapa ${index + 1}: ${module.title}${
                  state === 'current'
                    ? ' (atual)'
                    : state === 'completed'
                    ? ' (concluída)'
                    : state === 'locked'
                    ? ' (bloqueada)'
                    : ''
                }`}
                disabled={state === 'locked'}
              >
                {state === 'current' && <div className="border-glow" aria-hidden="true" />}
                <div className="relative z-10 flex items-center justify-center">
                  {state === 'completed' ? (
                    <Check className="w-6 h-6" strokeWidth={2.5} />
                  ) : state === 'locked' ? (
                    <Lock className="w-6 h-6" strokeWidth={1.6} />
                  ) : (
                    <Sparkles className="w-6 h-6" strokeWidth={1.6} />
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default TrilhaStepper
