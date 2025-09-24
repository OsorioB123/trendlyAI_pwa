'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ChevronDown, ArrowRight } from 'lucide-react'
import type { Tool } from '../../types/tool'
import { MOTION_CONSTANTS } from '@/lib/motion'

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
      onClick?.(tool)
    }
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
            className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/80"
          >
            {tag}
          </span>
        ))}
        {remaining > 0 && (
          <span className="rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-white/60">
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
        'absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 ease-in-out',
        'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
        favoriteState.loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] text-red-500' : '',
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
    'prompt-card group relative flex h-full min-h-[320px] cursor-pointer rounded-2xl liquid-glass focus-ring',
    'flex-col gap-4 p-6 transition-colors hover:bg-white/8',
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
        onClick={() => onClick?.(tool)}
        onKeyDown={handleKeyboardActivate}
        transition={{ type: 'spring', ...MOTION_CONSTANTS.SPRING.stiff }}
        {...motionProps}
      >
        {renderFavoriteButton()}

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
              <div className="rounded-lg bg-white/5 p-4">
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
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </footer>
          )}
        </div>
      </motion.div>
    </div>
  )
}

