'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ChevronDown, ArrowRight, Lock } from 'lucide-react'
import type { Tool } from '../../types/tool'
import { MOTION_CONSTANTS } from '@/lib/motion'
import { useAuth } from '@/contexts/AuthContext'
import { usePaywall } from '@/components/paywall/PaywallProvider'

interface ToolCardProps {
  tool: Tool
  variant?: 'compact' | 'full'
  onClick?: (tool: Tool) => void
  onFavorite?: (tool: Tool) => void
  isFavorited?: boolean
}

type FavoriteState = {
  loading: boolean
}

export default function ToolCard({
  tool,
  variant = 'full',
  onClick,
  onFavorite,
  isFavorited = false,
}: ToolCardProps) {
  const MAX_VISIBLE_TAGS = 3
  const [favoriteState, setFavoriteState] = useState<FavoriteState>({ loading: false })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { profile } = useAuth()
  const { open: openPaywall } = usePaywall()

  const isPremiumUser = profile?.is_premium
  const isLocked = tool.isPremium && !isPremiumUser

  useEffect(() => {
    if (typeof window === 'undefined') return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(query.matches)

    updatePreference()
    query.addEventListener?.('change', updatePreference)

    return () => query.removeEventListener?.('change', updatePreference)
  }, [])

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (isLocked) {
      openPaywall('tool')
      return
    }
    if (favoriteState.loading) return

    setFavoriteState({ loading: true })

    try {
      await onFavorite?.(tool)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteState({ loading: false })
    }
  }

  const handleKeyboardActivate = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isLocked) {
        openPaywall('tool')
      } else {
        onClick?.(tool)
      }
    }
  }

  const handleCardClick = () => {
    if (isLocked) {
      openPaywall('tool')
      return
    }
    onClick?.(tool)
  }

  const renderTags = () => {
    if (!tool.tags?.length) {
      return <div className="min-h-[28px]" />
    }

    const visibleTags = tool.tags.slice(0, MAX_VISIBLE_TAGS)
    const remaining = tool.tags.length - visibleTags.length

    return (
      <div className="flex min-h-[28px] flex-wrap items-center gap-2">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/20 bg-white/12 px-2 py-1 text-xs font-medium text-white/85 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
        {remaining > 0 && (
          <span className="rounded-full border border-white/15 bg-white/8 px-2 py-1 text-xs font-medium text-white/65">
            +{remaining}
          </span>
        )}
      </div>
    )
  }

  const renderFavoriteButton = () => (
    <button
      type="button"
      className={[
        'absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/12 backdrop-blur-xl transition-all duration-200 ease-in-out shadow-[0_12px_32px_rgba(4,6,18,0.35)]',
        'hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
        favoriteState.loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] text-red-500' : 'text-white/70',
      ].join(' ')}
      onClick={handleFavoriteClick}
      disabled={favoriteState.loading}
      aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={isFavorited}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
      />
    </button>
  )

  const cardBaseClasses = [
    'prompt-card group relative flex h-full w-full cursor-pointer rounded-2xl border border-white/12 bg-white/8 shadow-[0_24px_60px_rgba(4,8,20,0.45)]',
    'min-h-[240px] sm:min-h-[250px] lg:min-h-[260px] flex-col gap-4 p-5 transition-all hover:border-white/25 hover:bg-white/12',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0',
  ].join(' ')

  const motionProps = prefersReducedMotion
    ? { whileHover: undefined, whileTap: undefined }
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      }

  const snippet = tool.content?.substring(0, 200) ?? ''

  return (
    <div className="flex h-full w-full">
      <motion.div
        className={cardBaseClasses}
        role="button"
        tabIndex={0}
        aria-label={`Abrir ferramenta: ${tool.title}`}
        onClick={handleCardClick}
        onKeyDown={handleKeyboardActivate}
        transition={{ type: 'spring', ...MOTION_CONSTANTS.SPRING.stiff }}
        {...motionProps}
      >
        {renderFavoriteButton()}

        {isLocked && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Disponível para assinantes Maestro"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[4px]"
            onClick={(event) => {
              event.stopPropagation()
              openPaywall('tool')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openPaywall('tool')
              }
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-[0_12px_24px_rgba(0,0,0,0.45)]">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
            </div>
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col gap-4">
          <header className="min-h-[88px] space-y-2 pr-10">
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-white">
              {tool.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
              {tool.description}
            </p>
          </header>

          {renderTags()}

          {variant === 'compact' ? (
            <div className="mt-auto space-y-3">
              <div className="rounded-xl border border-white/12 bg-white/10 p-4 shadow-[0_10px_30px_rgba(4,8,18,0.25)]">
                <p className="line-clamp-3 text-sm leading-relaxed text-white/85">
                  {snippet.length ? `${snippet}...` : 'Nenhum prompt disponível.'}
                </p>
              </div>
              <div className="flex justify-end text-white/60">
                <ChevronDown className="h-4 w-4 transition-colors group-hover:text-white" />
              </div>
            </div>
          ) : (
            <footer className="mt-auto flex items-center justify-between text-xs text-white/60">
              <span>Clique para abrir</span>
              <ArrowRight className="h-3 w-3 transition-transform text-white/60 group-hover:translate-x-1 group-hover:text-white" />
            </footer>
          )}
        </div>
      </motion.div>
    </div>
  )
}

