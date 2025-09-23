'use client'

import { useMemo, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBackground } from '@/contexts/BackgroundContext'
import { STUDIO_THEMES, DEFAULT_STUDIO_THEME_ID, studioThemeMap } from '@/data/studioThemes'
import { cn } from '@/lib/utils'

interface AmbientSelectorProps {
  className?: string
  onPersist?: (themeId: string) => Promise<boolean> | boolean
  isSaving?: boolean
}

export function AmbientSelector({ className, onPersist, isSaving = false }: AmbientSelectorProps) {
  const { currentBackground, changeBackground } = useBackground()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const fallback = studioThemeMap[DEFAULT_STUDIO_THEME_ID]
  const activeId = pendingId ?? currentBackground.id ?? fallback?.id ?? DEFAULT_STUDIO_THEME_ID

  const items = useMemo(() => STUDIO_THEMES, [])

  const handleSelect = async (themeId: string) => {
    const previousId = pendingId ?? currentBackground.id ?? fallback?.id ?? DEFAULT_STUDIO_THEME_ID
    if (isSaving || themeId === previousId) return

    setPendingId(themeId)

    try {
      await changeBackground(themeId, { persist: false })

      if (onPersist) {
        const persistResult = await onPersist(themeId)
        if (!persistResult) {
          throw new Error('Persist failed')
        }
      }

      setPendingId(null)
    } catch (error) {
      console.error('Failed to persist ambient selection:', error)
      await changeBackground(previousId, { persist: false })
      setPendingId(null)
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_120px_-60px_rgba(0,0,0,0.8)] backdrop-blur-xl',
        className
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
            <Sparkles className="h-4 w-4 text-white/70" />
            Seu Ambiente
          </div>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Escolha o mood do seu estúdio
          </h3>
          <p className="mt-2 text-sm text-white/60">
            Alterar o ambiente atualiza imediatamente o fundo e sincroniza com suas preferências.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          {isSaving ? 'Salvando preferências…' : 'Sincronizado'}
        </div>
      </div>

      <ScrollArea className="mt-6 w-full whitespace-nowrap">
        <div className="flex gap-4 pb-2">
          {items.map((theme) => {
            const isActive = activeId === theme.id

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelect(theme.id)}
                disabled={isSaving}
                className={cn(
                  'group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 transition-all duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                  isActive ? 'scale-105 border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.45)]' : 'hover:-translate-y-1 hover:scale-105'
                )}
                style={{
                  backgroundImage: `url(${theme.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent opacity-75 transition-opacity group-hover:opacity-60" />
                <div className="relative flex items-center justify-center text-xs font-medium uppercase tracking-wide text-white">
                  {theme.name}
                </div>
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity',
                    isActive ? 'opacity-100' : 'group-hover:opacity-60'
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <Check className="h-4 w-4" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
    </div>
  )
}
