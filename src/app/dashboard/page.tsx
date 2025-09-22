'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Copy,
  Flame,
  ListChecks,
  RefreshCw,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Header from '@/components/layout/Header'
import BackgroundOverlay from '@/components/common/BackgroundOverlay'
import { HeaderVariant } from '@/types/header'
import { useBackground } from '@/contexts/BackgroundContext'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardHero } from '@/components/dashboard/hero-section'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useTracks } from '@/hooks/useTracks'
import TrackCard from '@/components/cards/TrackCard'
import Carousel from '@/components/common/Carousel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type {
  DashboardKpi,
  DashboardToolSummary,
  DashboardTask,
  DashboardHighlight,
  DashboardTrackSummary,
  DashboardSnapshot
} from '@/types/dashboard'
const DEFAULT_QUICK_ACTIONS = [
  'Crie um roteiro para meus próximos stories',
  'Analise a performance da última campanha',
  'Monte um plano de conteúdos para a semana'
]

const MAX_TOOL_CARDS = 6

export default function DashboardPage() {
  const router = useRouter()
  const { profile, user } = useAuth()
  const { currentBackground } = useBackground()
  const [commandValue, setCommandValue] = useState('')

  const { data: summary, loading, error, refresh } = useDashboardData(user ? user.id : undefined)
  const {
    tracks,
    loading: tracksLoading,
    toggleFavorite,
    isTrackFavorited
  } = useTracks(12)

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }, [])

  const displayName = useMemo(() => {
    if (profile && profile.display_name) {
      return profile.display_name
    }
    return 'Criador'
  }, [profile])

  const quickActions = useMemo(() => {
    if (summary && summary.quickActions && summary.quickActions.length > 0) {
      return summary.quickActions
    }
    return DEFAULT_QUICK_ACTIONS
  }, [summary])

  const insights = summary && summary.kpis ? summary.kpis.slice(0, 4) : []
  const snapshot = summary ? summary.snapshot : undefined
  const tasks = summary ? summary.tasks : []
  const highlights = summary ? summary.highlights : []
  const savedPrompts = summary && summary.savedPrompts ? summary.savedPrompts : []
  const toolSuggestions = summary && summary.tools ? summary.tools.slice(0, MAX_TOOL_CARDS) : []
  const notifications = snapshot && snapshot.notifications ? snapshot.notifications : []

  const continuingTracks = useMemo(() => {
    return tracks.filter((track) => {
      const progress = typeof track.progress === "number" ? track.progress : 0
      return progress > 0 && progress < 100
    })
  }, [tracks])

  const recommendedTracks = useMemo(() => {
    if (summary && summary.tracks) {
      return summary.tracks
    }
    return []
  }, [summary])

  const totalLoading = loading || tracksLoading

  const handleCommandSubmit = (value: string) => {
    router.push('/chat?message=' + encodeURIComponent(value))
  }

  const backgroundStyle = useMemo(() => {
    const base = 'radial-gradient(circle at top, rgba(94, 234, 212, 0.12), rgba(12, 14, 24, 0.95) 55%)'
    const image = currentBackground.value ? "url(\"" + currentBackground.value + "?w=1600&q=80\")" : "none"
    return {
      backgroundImage: base + ', ' + image,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    } as const
  }, [currentBackground.value])

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white" style={backgroundStyle}>
        <BackgroundOverlay />
        <Header variant={HeaderVariant.PRIMARY} />
        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 md:px-6">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 text-red-100">
              <AlertTitle>Não foi possível carregar todas as informações</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>{error}</span>
                <Button
                  variant="ghost"
                  className="inline-flex items-center gap-2 text-red-100"
                  onClick={refresh}
                >
                  <RefreshCw className="h-4 w-4" /> Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <DashboardHero
            greeting={greeting}
            userName={displayName}
            commandValue={commandValue}
            onCommandChange={setCommandValue}
            onSubmit={handleCommandSubmit}
            quickActions={quickActions}
            loading={totalLoading}
          />

          <InsightsGrid metrics={insights} loading={totalLoading} />

          <div className="grid gap-10 xl:grid-cols-[2fr,1fr]">
            <div className="space-y-10">
              <section className="space-y-4">
                <SectionHeader
                  title="Continue sua trilha"
                  description="Retome os programas que você já iniciou e mantenha o ritmo."
                  icon={<Flame className="h-4 w-4 text-brand-yellow" />}
                />
                {continuingTracks.length > 0 ? (
                  <Carousel id="dashboard-in-progress" className="pb-2">
                    {continuingTracks.map((track) => (
                      <TrackCard
                        key={String(track.id)}
                        track={track}
                        variant="compact"
                        onFavorite={(current) => toggleFavorite(String(current.id))}
                        isFavorited={isTrackFavorited(String(track.id))}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <EmptyStateCard message="Você ainda não iniciou nenhuma trilha. Escolha uma recomendação ao lado e comece hoje." />
                )}
              </section>

              <section className="space-y-4">
                <SectionHeader
                  title="Trilhas recomendadas"
                  description="Sugestões baseadas nos seus objetivos e no que a comunidade consome."
                  icon={<Sparkles className="h-4 w-4 text-brand-yellow" />}
                />
                {recommendedTracks.length > 0 ? (
                  <RecommendedTrackScroller tracks={recommendedTracks} />
                ) : (
                  <EmptyStateCard message="Nenhuma recomendação disponível no momento. Volte mais tarde para descobrir novas trilhas." />
                )}
              </section>

              <section className="space-y-4">
                <SectionHeader
                  title="Ferramentas em destaque"
                  description="Prompts e automações curados para acelerar sua produção."
                  icon={<TrendingUp className="h-4 w-4 text-brand-yellow" />}
                />
                <ToolSuggestionGrid tools={toolSuggestions} loading={totalLoading} />
              </section>

              <section className="space-y-4">
                <SectionHeader
                  title="Arsenal de prompts"
                  description="Cole, ajuste e gere em segundos."
                  icon={<Sparkles className="h-4 w-4 text-brand-yellow" />}
                />
                <PromptShelf prompts={savedPrompts} />
              </section>
            </div>
            <aside className="space-y-8">
              <SnapshotCard snapshot={snapshot} />
              <TaskList tasks={tasks} />
              <HighlightList highlights={highlights} />
              <NotificationPanel notifications={notifications} />
            </aside>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}


interface InsightsGridProps {
  metrics: DashboardKpi[]
  loading: boolean
}

function InsightsGrid({ metrics, loading }: InsightsGridProps) {
  if (loading && metrics.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={'metric-skeleton-' + index} className="h-32 border-white/10 bg-white/5">
            <CardContent className="flex h-full flex-col justify-between gap-3 py-5">
              <div className="h-3 w-24 rounded-full bg-white/10" />
              <div className="h-8 w-32 rounded-full bg-white/10" />
              <div className="h-2 w-full rounded-full bg-white/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (metrics.length === 0) {
    return <EmptyStateCard message="Nenhuma métrica disponível ainda. Conecte suas contas para visualizar os indicadores." />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.id} className="relative overflow-hidden border-white/10 bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
          <CardContent className="relative flex h-full flex-col gap-4 py-6">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4 text-brand-yellow" />
                {metric.label}
              </span>
              <Badge
                variant="secondary"
                className={cn('border-transparent bg-white/10 text-white/80', metric.trend === 'down' && 'bg-red-500/10 text-red-300')}
              >
                {metric.change > 0 ? '+' + metric.change : metric.change}%
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight">{metric.value}</p>
              {metric.helper && (
                <p className="text-sm text-white/60">{metric.helper}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
}

function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-white/50">
        {icon}
        <span>{title}</span>
      </div>
      {description && (
        <p className="max-w-2xl text-sm text-white/70">{description}</p>
      )}
    </div>
  )
}

interface RecommendedTrackScrollerProps {
  tracks: DashboardTrackSummary[]
}

function RecommendedTrackScroller({ tracks }: RecommendedTrackScrollerProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tracks.map((track) => (
        <Card key={track.id} className="relative overflow-hidden border-white/10 bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
          <CardContent className="relative flex h-full flex-col gap-4 py-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
              <span>{track.category || 'Personalizado'}</span>
              {track.level && (
                <Badge variant="secondary" className="border-transparent bg-white/10 text-white/80">
                  {track.level}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{track.title}</h3>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Progresso estimado</span>
              <span>{track.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white" style={{ width: track.progress + '%' }} />
            </div>
            <Button variant="secondary" className="h-11 justify-between bg-white/10 text-white hover:bg-white/20">
              Ver detalhes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface ToolSuggestionGridProps {
  tools: DashboardToolSummary[]
  loading: boolean
}

function ToolSuggestionGrid({ tools, loading }: ToolSuggestionGridProps) {
  if (loading && tools.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={'tool-skeleton-' + index} className="h-44 border-white/10 bg-white/5">
            <CardContent className="flex h-full flex-col justify-between gap-3 py-5">
              <div className="h-3 w-32 rounded-full bg-white/10" />
              <div className="h-10 w-full rounded-lg bg-white/10" />
              <div className="h-3 w-full rounded-full bg-white/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tools.length === 0) {
    return <EmptyStateCard message="Nenhuma ferramenta recomendada no momento. Visite a biblioteca completa para descobrir novas automações." />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.id} className="group relative overflow-hidden border-white/10 bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
          <CardContent className="relative flex h-full flex-col gap-4 py-6">
            <Badge variant="secondary" className="w-fit border-transparent bg-white/10 text-white/70">
              {tool.category || 'Ferramenta'}
            </Badge>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
              <p className="text-sm text-white/70 line-clamp-3">{tool.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{tool.usageCount ? tool.usageCount + ' usos' : 'Novo'}</span>
              <button type="button" className="inline-flex items-center gap-1 text-white/70 hover:text-white">
                Abrir <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface PromptShelfProps {
  prompts: string[]
}

function PromptShelf({ prompts }: PromptShelfProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  if (prompts.length === 0) {
    return <EmptyStateCard message="Salve prompts favoritos para encontrá-los rapidamente aqui." />
  }

  const handleCopy = (prompt: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(prompt).then(() => {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      })
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {prompts.slice(0, 4).map((prompt, index) => (
        <Card key={'prompt-' + index} className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-brand-yellow">
              <Sparkles className="h-4 w-4" /> Prompt destaque
            </CardTitle>
            <CardDescription className="text-white/70">Cole no chat para gerar instantaneamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80 line-clamp-5">{prompt}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20"
              onClick={() => handleCopy(prompt, index)}
            >
              <Copy className="h-4 w-4" /> {copiedIndex === index ? 'Copiado!' : 'Copiar'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface SnapshotCardProps {
  snapshot?: DashboardSnapshot
}

function SnapshotCard({ snapshot }: SnapshotCardProps) {
  if (!snapshot) {
    return null
  }

  const credits = snapshot.credits || 0
  const maxCredits = snapshot.maxCredits || 100
  const progress = maxCredits > 0 ? Math.min(100, Math.round((credits / maxCredits) * 100)) : 0

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-brand-yellow">
          <Sparkles className="h-4 w-4" /> Snapshot do criador
        </CardTitle>
        <CardDescription className="text-white/70">Resumo rápido das suas métricas pessoais.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-white/60">Créditos disponíveis</p>
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>{credits}</span>
            <span className="text-sm text-white/60">de {maxCredits}</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Streak</p>
            <p className="text-base font-medium text-white">{snapshot.streakDays || 0} dias</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Nível</p>
            <p className="text-base font-medium text-white">{snapshot.level || 'Explorador'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskListProps {
  tasks: DashboardTask[]
}

function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyStateCard message="Nenhuma ação pendente. Continue explorando ferramentas e trilhas." />
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-brand-yellow">
          <ListChecks className="h-4 w-4" /> Próximas ações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">{task.title}</p>
              <Badge
                variant="secondary"
                className={cn('border-transparent bg-white/10 text-white/70', task.status === 'overdue' && 'bg-red-500/10 text-red-300', task.status === 'completed' && 'bg-emerald-500/10 text-emerald-300')}
              >
                {formatStatus(task.status)}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>{task.dueAt ? formatDate(task.dueAt) : 'Sem prazo'}</span>
              {task.ctaLabel && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-brand-yellow hover:text-white"
                  onClick={() => task.ctaHref ? window.open(task.ctaHref, '_self') : null}
                >
                  {task.ctaLabel}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface HighlightListProps {
  highlights: DashboardHighlight[]
}

function HighlightList({ highlights }: HighlightListProps) {
  if (highlights.length === 0) {
    return null
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-brand-yellow">
          <TrendingUp className="h-4 w-4" /> Conteúdos em destaque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {highlights.slice(0, 3).map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/60">{item.channel} • {item.metricLabel}</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{item.metricValue}</span>
              <Badge
                variant="secondary"
                className={cn('border-transparent bg-white/10 text-white/70', item.trend === 'up' && 'bg-emerald-500/10 text-emerald-300', item.trend === 'down' && 'bg-red-500/10 text-red-300')}
              >
                {item.change > 0 ? '+' + item.change : item.change}%
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface NotificationPanelProps {
  notifications: { id: string; title: string; message: string }[]
}

function NotificationPanel({ notifications }: NotificationPanelProps) {
  if (notifications.length === 0) {
    return null
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-brand-yellow">
          <Sparkles className="h-4 w-4" /> Atualizações recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((note) => (
          <div key={note.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="font-semibold text-white">{note.title}</p>
            <p className="mt-1 text-white/60">{note.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface EmptyStateCardProps {
  message: string
}

function EmptyStateCard({ message }: EmptyStateCardProps) {
  return (
    <Card className="border-dashed border-white/15 bg-white/5">
      <CardContent className="py-10 text-center text-sm text-white/60">
        {message}
      </CardContent>
    </Card>
  )
}

function formatStatus(status: DashboardTask['status']) {
  if (status === 'completed') return 'Concluído'
  if (status === 'overdue') return 'Atrasado'
  return 'Pendente'
}

function formatDate(value?: string) {
  if (!value) return 'Sem prazo'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sem prazo'
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
