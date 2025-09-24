import { supabase } from '../supabase'
import type {
  DashboardSummary,
  DashboardKpi,
  DashboardTrackSummary,
  DashboardToolSummary,
  DashboardTask,
  DashboardHighlight
} from '@/types/dashboard'

interface UserTrackRow {
  track_id: string
  progress: number | null
  status: string | null
  updated_at: string | null
  tracks: {
    id: string
    title: string | null
    difficulty: string | null
    category: string | null
    thumbnail_url: string | null
    is_premium: boolean | null
  } | null
}

interface UserToolRow {
  tool_id: string
  is_favorite: boolean | null
  usage_count: number | null
  last_used: string | null
  tools: {
    id: string
    name: string | null
    description: string | null
    category: string | null
    configuration: Record<string, unknown> | null
    is_premium: boolean | null
  } | null
}

interface ProfileRow {
  credits: number | null
  max_credits: number | null
  streak_days: number | null
  level: string | null
}

const FALLBACK_SUMMARY: DashboardSummary = {
  kpis: [
    {
      id: 'audience',
      label: 'Audiência ativa',
      value: '12.4K',
      helper: 'Últimos 7 dias',
      trend: 'up',
      change: 12,
      series: generateLinearSeries(7, 9200, 12400)
    },
    {
      id: 'engagement',
      label: 'Taxa de engajamento',
      value: '5.6%',
      helper: 'vs semana anterior',
      trend: 'up',
      change: 1.4,
      series: generateLinearSeries(7, 3.8, 5.6)
    },
    {
      id: 'revenue',
      label: 'Receita criador',
      value: 'R$ 8.9K',
      helper: 'Assinaturas + produtos',
      trend: 'up',
      change: 9,
      series: generateLinearSeries(7, 6200, 8900)
    },
    {
      id: 'learning',
      label: 'Progresso nas trilhas',
      value: '78%',
      helper: '3 trilhas em andamento',
      trend: 'flat',
      change: 0,
      series: generateLinearSeries(7, 70, 78)
    }
  ],
  growthSeries: [
    {
      id: 'audience',
      label: 'Audiência',
      description: 'Seguidores e inscritos por semana',
      data: generateDualSeries(8, 8400, 12800)
    },
    {
      id: 'revenue',
      label: 'Receita',
      description: 'Assinaturas e vendas digitais',
      data: generateDualSeries(8, 4200, 8900)
    },
    {
      id: 'content',
      label: 'Conteúdo',
      description: 'Visualizações e salvamentos',
      data: generateDualSeries(8, 1200, 3100)
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Revisar roteiro do vídeo de tendências',
      type: 'content',
      dueAt: addDays(1),
      status: 'pending',
      ctaLabel: 'Abrir editor',
      ctaHref: '/tools'
    },
    {
      id: 'task-2',
      title: 'Responder perguntas da comunidade',
      type: 'community',
      dueAt: addDays(0),
      status: 'overdue',
      ctaLabel: 'Abrir comunidade',
      ctaHref: '/chat'
    },
    {
      id: 'task-3',
      title: 'Finalizar módulo 3 da trilha de growth',
      type: 'learning',
      dueAt: addDays(3),
      status: 'pending',
      ctaLabel: 'Retomar trilha',
      ctaHref: '/tracks'
    }
  ],
  highlights: [
    {
      id: 'highlight-1',
      title: 'Vídeo "Tendências de IA"',
      channel: 'YouTube',
      metricLabel: 'Visualizações',
      metricValue: '42.3K',
      change: 18,
      trend: 'up',
      publishedAt: addDays(-2)
    },
    {
      id: 'highlight-2',
      title: 'Newsletter semanal #45',
      channel: 'Email',
      metricLabel: 'Taxa de abertura',
      metricValue: '46%',
      change: 6,
      trend: 'up',
      publishedAt: addDays(-4)
    }
  ],
  tools: [
    {
      id: 'tool-1',
      title: 'Gerador de Roteiros',
      description: 'Crie roteiros de vídeo em minutos com foco em retenção.',
      category: 'Conteúdo',
      tags: ['vídeo', 'storytelling'],
      isFavorite: true,
      usageCount: 34
    },
    {
      id: 'tool-2',
      title: 'Resumo de Comentários',
      description: 'Agrupe comentários por sentimento e gere respostas rápidas.',
      category: 'Comunidade',
      tags: ['comentários', 'sentimento'],
      usageCount: 12
    }
  ],
  tracks: [
    {
      id: 'track-1',
      title: 'Growth para Criadores',
      level: 'Intermediário',
      progress: 65,
      updatedAt: addDays(-1),
      category: 'Growth',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1000&q=80&auto=format&fit=crop'
    },
    {
      id: 'track-2',
      title: 'Monetização Avançada',
      level: 'Avançado',
      progress: 35,
      updatedAt: addDays(-3),
      category: 'Monetização',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&q=80&auto=format&fit=crop'
    }
  ],
  snapshot: {
    credits: 42,
    maxCredits: 60,
    streakDays: 5,
    level: 'Explorador',
    nextMilestone: 'Conclua 2 módulos para liberar selo Expert',
    notifications: [
      {
        id: 'notif-1',
        title: '3 novos assinantes',
        message: 'Assinaturas ativas cresceram 12% na última semana.'
      }
    ]
  },
  quickActions: ['Criar novo conteúdo', 'Analisar audiência', 'Enviar campanha'],
  savedPrompts: [
    'Me dê ideias de reels com foco em engajamento',
    'Crie um roteiro de 3 atos sobre lançamentos',
    'Escreva uma newsletter semanal sobre tendências'
  ]
}

export async function fetchDashboardSummary(userId?: string | null): Promise<DashboardSummary> {
  if (!userId) {
    return FALLBACK_SUMMARY
  }

  try {
    const [profileRes, tracksRes, toolsRes, messagesRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('credits, max_credits, streak_days, level, preferences')
        .eq('id', userId)
        .maybeSingle(),
      supabase
        .from('user_tracks')
        .select('track_id, progress, status, updated_at, tracks ( id, title, difficulty, category, thumbnail_url, is_premium )')
        .eq('user_id', userId)
        .limit(12),
      supabase
        .from('user_tools')
        .select('tool_id, is_favorite, usage_count, last_used, tools ( id, name, description, category, configuration, is_premium )')
        .eq('user_id', userId)
        .limit(8),
      supabase
        .from('messages')
        .select('id, created_at')
        .eq('sender_id', userId)
        .gte('created_at', sevenDaysAgo())
    ])

    const tracksRows = (tracksRes.data as UserTrackRow[] | null) ?? []
    const toolsRows = (toolsRes.data as UserToolRow[] | null) ?? []
    const messagesRows = messagesRes.data ?? []

    const kpis = buildKpis(tracksRows, toolsRows, messagesRows.length)
    const trackSummaries = buildTrackSummaries(tracksRows)
    const toolSummaries = buildToolSummaries(toolsRows)
    const tasks = buildTasks(trackSummaries)
    const highlights = buildHighlights(trackSummaries)
    const profileRow = profileRes.data as ProfileRow | null

    return {
      kpis,
      growthSeries: buildGrowthSeries(kpis),
      tasks,
      highlights,
      tools: toolSummaries,
      tracks: trackSummaries,
      snapshot: {
        credits: profileRow?.credits ?? FALLBACK_SUMMARY.snapshot.credits,
        maxCredits: profileRow?.max_credits ?? FALLBACK_SUMMARY.snapshot.maxCredits,
        streakDays: profileRow?.streak_days ?? FALLBACK_SUMMARY.snapshot.streakDays,
        level: profileRow?.level ?? FALLBACK_SUMMARY.snapshot.level,
        nextMilestone: FALLBACK_SUMMARY.snapshot.nextMilestone,
        notifications: FALLBACK_SUMMARY.snapshot.notifications
      },
      quickActions: FALLBACK_SUMMARY.quickActions,
      savedPrompts: FALLBACK_SUMMARY.savedPrompts
    }
  } catch (error) {
    console.warn('Dashboard summary fallback due to error:', error)
    return FALLBACK_SUMMARY
  }
}

function buildKpis(
  tracks: UserTrackRow[],
  tools: UserToolRow[],
  messagesLastWeek: number
): DashboardKpi[] {
  const inProgress = tracks.filter((track) => track.status === 'in_progress').length
  const completed = tracks.filter((track) => track.status === 'completed').length
  const favorites = tools.filter((tool) => tool.is_favorite).length

  return [
    {
      id: 'learning-progress',
      label: 'Trilhas em andamento',
      value: String(inProgress),
      helper: 'Atualizado em tempo real',
      trend: inProgress >= 3 ? 'up' : 'flat',
      change: inProgress,
      series: generateLinearSeries(7, Math.max(0, inProgress - 2), inProgress)
    },
    {
      id: 'learning-done',
      label: 'Trilhas concluídas',
      value: String(completed),
      helper: 'Últimos 30 dias',
      trend: completed > 0 ? 'up' : 'flat',
      change: completed,
      series: generateLinearSeries(7, completed, completed)
    },
    {
      id: 'tool-favorites',
      label: 'Ferramentas favoritas',
      value: String(favorites),
      helper: 'Biblioteca pessoal',
      trend: favorites > 0 ? 'up' : 'flat',
      change: favorites,
      series: generateLinearSeries(7, favorites, favorites + 1)
    },
    {
      id: 'messages',
      label: 'Mensagens enviadas',
      value: String(messagesLastWeek),
      helper: 'Últimos 7 dias',
      trend: messagesLastWeek > 5 ? 'up' : 'flat',
      change: messagesLastWeek,
      series: generateLinearSeries(7, messagesLastWeek, messagesLastWeek + 2)
    }
  ]
}

function buildTrackSummaries(rows: UserTrackRow[]): DashboardTrackSummary[] {
  return rows.map((row) => ({
    id: row.track_id,
    title: row.tracks?.title ?? 'Trilha sem título',
    level: mapDifficulty(row.tracks?.difficulty),
    progress: row.progress ?? 0,
    updatedAt: row.updated_at ?? undefined,
    category: row.tracks?.category ?? undefined,
    thumbnailUrl: row.tracks?.thumbnail_url ?? undefined,
    isPremium: Boolean(row.tracks?.is_premium)
  }))
}

function buildToolSummaries(rows: UserToolRow[]): DashboardToolSummary[] {
  return rows.map((row) => ({
    id: row.tool_id,
    title: row.tools?.name ?? 'Ferramenta sem nome',
    description: row.tools?.description ?? 'Descrição não disponível.',
    category: row.tools?.category ?? undefined,
    tags: Array.isArray((row.tools?.configuration as any)?.tags)
      ? ((row.tools?.configuration as any).tags as string[])
      : undefined,
    isFavorite: row.is_favorite ?? false,
    usageCount: row.usage_count ?? undefined,
    lastUsedAt: row.last_used ?? undefined,
    content: typeof (row.tools?.configuration as any)?.prompt === 'string'
      ? ((row.tools?.configuration as any).prompt as string)
      : undefined,
    isPremium: Boolean(row.tools?.is_premium)
  }))
}

function buildTasks(tracks: DashboardTrackSummary[]): DashboardTask[] {
  if (tracks.length === 0) {
    return FALLBACK_SUMMARY.tasks
  }

  return tracks.slice(0, 4).map((track) => ({
    id: 'task-' + track.id,
    title: 'Continuar "' + track.title + '" (' + track.progress + '% concluído)',
    type: 'learning' as const,
    dueAt: track.updatedAt ?? addDays(2),
    status: (track.progress >= 100 ? 'completed' : 'pending') as DashboardTask['status'],
    ctaLabel: track.progress >= 100 ? 'Revisar trilha' : 'Retomar trilha',
    ctaHref: '/tracks/' + track.id
  }))
}

function buildHighlights(tracks: DashboardTrackSummary[]): DashboardHighlight[] {
  if (tracks.length === 0) {
    return FALLBACK_SUMMARY.highlights
  }

  return tracks.slice(0, 3).map((track) => ({
    id: 'highlight-' + track.id,
    title: track.title,
    channel: track.category ?? 'Trilha',
    metricLabel: 'Progresso',
    metricValue: String(track.progress) + '%',
    change: Math.round(Math.max(0, track.progress - 50) / 10),
    trend: (track.progress >= 50 ? 'up' : 'flat'),
    publishedAt: track.updatedAt ?? addDays(-1)
  }))
}

function buildGrowthSeries(kpis: DashboardKpi[]) {
  return kpis.slice(0, 3).map((kpi) => ({
    id: kpi.id,
    label: kpi.label,
    description: kpi.helper,
    data: generateDualSeries(
      8,
      kpi.series.length > 0 ? kpi.series[0].value : 0,
      kpi.series.length > 0 ? kpi.series[kpi.series.length - 1].value : 0
    )
  }))
}

function mapDifficulty(value: string | null | undefined) {
  if (!value) return 'Iniciante'
  const normalized = value.toLowerCase()
  if (normalized.indexOf('inter') >= 0) return 'Intermediário'
  if (normalized.indexOf('av') >= 0) return 'Avançado'
  return 'Iniciante'
}

function generateLinearSeries(points: number, start: number, end: number) {
  if (points <= 1) {
    return [{ date: formatDay(0), value: end }]
  }

  const step = (end - start) / (points - 1)
  return Array.from({ length: points }).map((_, index) => ({
    date: formatDay(-(points - 1 - index)),
    value: Math.round(start + step * index)
  }))
}

function generateDualSeries(points: number, start: number, end: number) {
  if (points <= 1) {
    return [{ date: formatDay(0), primary: end, secondary: Math.round(end * 0.8) }]
  }

  const step = (end - start) / (points - 1)
  return Array.from({ length: points }).map((_, index) => {
    const primary = start + step * index
    return {
      date: formatDay(-(points - 1 - index)),
      primary: Math.round(primary),
      secondary: Math.round(primary * 0.75)
    }
  })
}

function addDays(delta: number) {
  const date = new Date()
  date.setDate(date.getDate() + delta)
  return date.toISOString()
}

function formatDay(offset: number) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

function sevenDaysAgo() {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString()
}

