'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Copy, Check, Heart, Lock, ArrowRight } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Tool } from '@/types/tool'
import type { TrackModule } from '@/types/track'
import { cn } from '@/lib/utils'
import { usePaywall } from '@/components/paywall/PaywallProvider'
import { useToast } from '@/components/ui/Toast'

interface ModuleToolsProps {
  module: TrackModule | null
  userId?: string
  isUserPremium?: boolean
  defaultExpandedId?: string | null
}

const mapRowToTool = (row: Database['public']['Tables']['tools']['Row'], isFavorite: boolean): Tool => {
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

export function ModuleTools({ module, userId, isUserPremium, defaultExpandedId = null }: ModuleToolsProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const router = useRouter()
  const { open: openPaywall } = usePaywall()
  const { addToast } = useToast()

  useEffect(() => {
    setExpandedId(defaultExpandedId)
  }, [defaultExpandedId])

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
      } catch (fetchError) {
        console.error('Failed to load module tools', fetchError)
        setError('Nao foi possivel carregar as ferramentas do modulo.')
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [toolIds, userId])

  const ensureAccess = useCallback((tool: Tool) => {
    if (tool.isPremium && !isUserPremium) {
      openPaywall('tool')
      return false
    }
    return true
  }, [isUserPremium, openPaywall])

  const handleToggleFavorite = useCallback(async (tool: Tool) => {
    if (!userId) {
      router.push('/login')
      return
    }

    if (!ensureAccess(tool)) return

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
      addToast({ type: 'error', title: 'Nao foi possivel atualizar o favorito.' })
    }
  }, [addToast, ensureAccess, router, userId])

  const handleCopyPrompt = useCallback(async (tool: Tool) => {
    if (!ensureAccess(tool)) return

    const promptText = typeof tool.content === 'string' ? tool.content : ''

    try {
      await navigator.clipboard.writeText(promptText)
      setCopiedId(tool.id)
      addToast({ type: 'success', title: 'Prompt copiado!' })
      setTimeout(() => setCopiedId((current) => (current === tool.id ? null : current)), 2000)
    } catch (copyError) {
      console.error('Failed to copy prompt', copyError)
      addToast({ type: 'error', title: 'Nao foi possivel copiar o prompt.' })
    }
  }, [addToast, ensureAccess])

  const handleOpenTool = useCallback((tool: Tool) => {
    if (!ensureAccess(tool)) return
    router.push(`/tools?tool=${tool.id}`)
  }, [ensureAccess, router])

  const handleToggleExpanded = useCallback((tool: Tool) => {
    if (!ensureAccess(tool)) return
    setExpandedId((current) => (current === tool.id ? null : tool.id))
  }, [ensureAccess])

  if (!module) {
    return null
  }

  if (loading) {
    return <p className="text-sm text-white/60">Carregando ferramentas...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }

  if (!tools.length) {
    return <p className="text-sm text-white/60">Nenhuma ferramenta associada a este modulo.</p>
  }

  return (
    <div className="space-y-4">
      {tools.map((tool) => {
        const isExpanded = expandedId === tool.id
        const isCopied = copiedId === tool.id
        const premiumLocked = tool.isPremium && !isUserPremium

        return (
          <div
            key={tool.id}
            className={cn('prompt-card transition-all', isExpanded && 'expanded', premiumLocked && 'pointer-events-auto')}
            data-tool-id={tool.id}
            onClick={() => handleToggleExpanded(tool)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleToggleExpanded(tool)
              }
            }}
          >
            {premiumLocked && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white"
                onClick={(event) => {
                  event.stopPropagation()
                  openPaywall('tool')
                }}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4" />
                  Conteudo exclusivo para maestros
                </div>
              </div>
            )}
            <div className="border-glow" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{tool.title}</h3>
                  {tool.description && (
                    <p className="text-white/70 text-sm">{tool.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={tool.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className={cn(
                      'prompt-action-icon',
                      tool.isFavorite && 'favorited'
                    )}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleToggleFavorite(tool)
                    }}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Copiar prompt"
                    className="prompt-action-icon"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleCopyPrompt(tool)
                    }}
                  >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <ChevronDown className={cn('chevron text-white/60', isExpanded && 'rotate-180')} />
              </div>
            </div>
            <div className={cn('prompt-card-content', isExpanded && 'expanded')}>
              <div>
                <div className="content-card rounded-lg p-4 bg-black/30">
                  <p className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre-wrap">
                    {typeof tool.content === 'string' ? tool.content : ''}
                  </p>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    className="btn-secondary px-4 py-2 text-sm font-medium"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleOpenTool(tool)
                    }}
                  >
                    <span className="btn-text">Abrir ferramenta</span>
                    <ArrowRight className="btn-icon w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ModuleTools
