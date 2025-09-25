'use client'

import { useEffect, useMemo, useState } from 'react'
import { Heart, Lock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Tool } from '@/types/tool'
import type { TrackModule } from '@/types/track'
import { cn } from '@/lib/utils'
import { usePaywall } from '@/components/paywall/PaywallProvider'

interface ModuleToolsProps {
  module: TrackModule | null
  userId?: string
  isUserPremium?: boolean
  onClose: () => void
}

const mapRowToTool = (
  row: Database['public']['Tables']['tools']['Row'],
  isFavorite: boolean
): Tool => {
  const tags = Array.isArray(row.tags) ? row.tags : []
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    category: (row.category as Tool['category']) ?? 'Marketing',
    type: 'text-generation',
    compatibility: [],
    tags,
    content: row.content ?? '',
    how_to_use: undefined,
    isFavorite,
    isEdited: false,
    isPremium: Boolean(row.is_premium),
    usageCount: undefined,
    difficulty: undefined,
    estimatedTime: undefined,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  }
}

export function ModuleTools({ module, userId, isUserPremium, onClose }: ModuleToolsProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { open: openPaywall } = usePaywall()

  const toolIds = useMemo(() => {
    if (!module || !Array.isArray(module.tools)) return []
    return module.tools
      .map((tool) => (typeof tool === 'string' ? tool : tool.id))
      .filter((value): value is string => Boolean(value))
  }, [module])

  useEffect(() => {
    const fetchTools = async () => {
      if (!toolIds.length) {
        setTools([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data: favoritesData } = userId
          ? await supabase
              .from('user_tools')
              .select('tool_id, is_favorite')
              .eq('user_id', userId)
          : { data: [] }

        const favoriteMap = new Map<string, boolean>()
        favoritesData?.forEach((entry: any) => {
          favoriteMap.set(entry.tool_id, Boolean(entry.is_favorite))
        })

        const { data: toolsData, error: toolsError } = await supabase
          .from('tools')
          .select('*')
          .in('id', toolIds)
          .eq('is_active', true)

        if (toolsError) {
          throw toolsError
        }

        const mapped = (toolsData ?? []).map((row) => mapRowToTool(row, favoriteMap.get(row.id) ?? false))
        const ordered = toolIds
          .map((id) => mapped.find((tool) => tool.id === id))
          .filter((tool): tool is Tool => Boolean(tool))

        setTools(ordered)
      } catch (fetchError: any) {
        console.error('Failed to load module tools', fetchError)
        setError('Não foi possível carregar as ferramentas do módulo.')
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [toolIds, userId])

  const handleToggleFavorite = async (tool: Tool) => {
    if (!userId) {
      router.push('/login')
      return
    }

    const nextFavorite = !tool.isFavorite

    setTools((prev) =>
      prev.map((item) => (item.id === tool.id ? { ...item, isFavorite: nextFavorite } : item))
    )

    try {
      const { error: upsertError } = await (supabase.from('user_tools') as any).upsert({
        user_id: userId,
        tool_id: tool.id,
        is_favorite: nextFavorite,
        updated_at: new Date().toISOString(),
      })

      if (upsertError) {
        throw upsertError
      }
    } catch (toggleError) {
      console.error('Failed to toggle favorite', toggleError)
      setTools((prev) =>
        prev.map((item) => (item.id === tool.id ? { ...item, isFavorite: !nextFavorite } : item))
      )
    }
  }

  const handleOpenTool = (tool: Tool) => {
    if (tool.isPremium && !isUserPremium) {
      openPaywall('tool')
      return
    }

    router.push(`/tools?tool=${tool.id}`)
  }

  if (!module) {
    return null
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Arsenal da Missão</h4>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-white/60 hover:text-white transition"
        >
          Fechar
        </button>
      </div>

      {loading && <p className="text-sm text-white/60">Carregando ferramentas</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && tools.length === 0 && (
        <p className="text-sm text-white/60">Nenhuma ferramenta associada a este módulo.</p>
      )}

      <div className="space-y-3">
        {tools.map((tool) => {
          const premiumLocked = tool.isPremium && !isUserPremium
          return (
            <div key={tool.id} className="content-card rounded-xl p-4 relative overflow-hidden">
              {premiumLocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80">
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4" />
                    Exclusivo para maestros
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="text-sm font-semibold text-white">{tool.title}</h5>
                  <p className="mt-1 text-xs text-white/70 line-clamp-3">{tool.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(tool)}
                  aria-label={tool.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  className={cn(
                    'p-2 rounded-full bg-white/5 hover:bg-white/10 transition',
                    tool.isFavorite && 'text-red-400'
                  )}
                >
                  <Heart className={cn('w-4 h-4', tool.isFavorite && 'fill-current')} />
                </button>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenTool(tool)}
                  className="flex items-center gap-2 text-xs font-medium text-white hover:text-white/80 transition"
                >
                  Abrir ferramenta
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ModuleTools
