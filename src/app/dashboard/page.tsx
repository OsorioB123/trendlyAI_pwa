'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Header from '@/components/layout/Header'
import { HeaderVariant } from '@/types/header'
import { useBackground } from '@/contexts/BackgroundContext'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardHero } from '@/components/dashboard/hero-section'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useTracks } from '@/hooks/useTracks'
import TrackCard from '@/components/cards/TrackCard'
import Carousel from '@/components/common/Carousel'
import type { DashboardToolSummary, DashboardTrackSummary } from '@/types/dashboard'

const DEFAULT_QUICK_ACTIONS = [
  'Crie um roteiro para meus próximos stories',
  'Analise a performance da última campanha',
  'Monte um plano de conteúdos para a semana'
]

const MAX_TOOL_CARDS = 6

const RECOMMENDED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1000&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1000&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1000&q=80&auto=format&fit=crop'
]

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
    if (profile?.display_name) {
      return profile.display_name
    }
    return 'Criador'
  }, [profile])

  const quickActions = useMemo(() => {
    if (summary?.quickActions && summary.quickActions.length > 0) {
      return summary.quickActions
    }
    return DEFAULT_QUICK_ACTIONS
  }, [summary])

  const continuingTracks = useMemo(() => {
    return tracks.filter((track) => {
      const progress = typeof track.progress === 'number' ? track.progress : 0
      return progress > 0 && progress < 100
    })
  }, [tracks])

  const recommendedTracks = useMemo(() => {
    return summary?.tracks ?? []
  }, [summary])

  const toolSuggestions = useMemo(() => {
    return summary?.tools ? summary.tools.slice(0, MAX_TOOL_CARDS) : []
  }, [summary])

  const isLoading = loading || tracksLoading

  const backgroundStyle = useMemo(() => {
    const layers = ['radial-gradient(circle at top, rgba(8, 13, 32, 0.75), rgba(5, 8, 18, 0.95) 60%)']
    if (currentBackground.value) {
      layers.push(`url(${currentBackground.value}?w=1600&q=80)`)
    }

    return {
      backgroundColor: '#04060f',
      backgroundImage: layers.join(', '),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    } as const
  }, [currentBackground.value])

  const handleCommandSubmit = (value: string) => {
    router.push('/chat?message=' + encodeURIComponent(value))
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white" style={backgroundStyle}>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#020415]/78 backdrop-blur-[2px]" />

        <Header variant={HeaderVariant.PRIMARY} />

        <main className="relative z-10 w-full">
          <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-24 pt-32 sm:px-6 lg:px-0">
            {error ? (
              <InfoMessage
                variant="error"
                message="Não foi possível carregar todas as informações do dashboard."
                actionLabel="Tentar novamente"
                onAction={refresh}
              />
            ) : null}

            <DashboardHero
              greeting={greeting}
              userName={displayName}
              commandValue={commandValue}
              onCommandChange={setCommandValue}
              onSubmit={handleCommandSubmit}
              quickActions={quickActions}
              loading={isLoading}
            />

            <div className="mt-10 mb-28 space-y-20">
              <section className="animate-entry delay-2">
                <SectionHeading title="Continue sua Trilha" href="/tracks?tab=progress" />
                {continuingTracks.length > 0 ? (
                  <Carousel id="dashboard-popular" className="mt-4">
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
                  <InfoMessage message="Você ainda não iniciou nenhuma trilha. Explore as recomendações para dar o próximo passo." />
                )}
              </section>

              <section className="animate-entry delay-3">
                <SectionHeading title="Trilhas recomendadas pra você" href="/tracks" />
                <RecommendedCarousel tracks={recommendedTracks} />
              </section>

              <section className="animate-entry delay-4">
                <SectionHeading title="Ferramentas recomendadas pra você" href="/tools" />
                <ToolsCarousel tools={toolSuggestions} loading={isLoading} />
              </section>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

interface SectionHeadingProps {
  title: string
  href?: string
}

function SectionHeading({ title, href }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-medium tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
        {title}
      </h2>
      {href ? (
        <a
          href={href}
          className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          <span>Ver todos</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  )
}

interface RecommendedCarouselProps {
  tracks: DashboardTrackSummary[]
}

function RecommendedCarousel({ tracks }: RecommendedCarouselProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="mt-6">
        <InfoMessage message="Nenhuma recomendação disponível no momento. Volte mais tarde para descobrir novas trilhas." />
      </div>
    )
  }

  return (
    <Carousel id="dashboard-recommended" className="mt-4">
      {tracks.map((track, index) => (
        <RecommendedCard
          key={track.id ?? index}
          track={track}
          backgroundImage={RECOMMENDED_FALLBACK_IMAGES[index % RECOMMENDED_FALLBACK_IMAGES.length]}
        />
      ))}
    </Carousel>
  )
}

interface RecommendedCardProps {
  track: DashboardTrackSummary
  backgroundImage: string
}

function RecommendedCard({ track, backgroundImage }: RecommendedCardProps) {
  const coverImage = track.thumbnailUrl || backgroundImage
  return (
    <div className="interactive-card card-glow relative flex h-64 w-full overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute top-0 left-0 flex flex-wrap items-start gap-2 p-5">
        {track.category ? (
          <span className="liquid-glass-tag">{track.category}</span>
        ) : null}
        {track.level ? (
          <span className="liquid-glass-tag">{track.level}</span>
        ) : null}
      </div>
      <div className="relative z-10 mt-auto w-full p-5">
        <h3 className="text-lg font-medium text-white leading-snug" style={{ fontFamily: 'Geist, sans-serif' }}>
          {track.title}
        </h3>
      </div>
    </div>
  )
}

interface ToolsCarouselProps {
  tools: DashboardToolSummary[]
  loading: boolean
}

function ToolsCarousel({ tools, loading }: ToolsCarouselProps) {
  if (loading && tools.length === 0) {
    return (
      <Carousel id="dashboard-tools-skeleton" className="mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="prompt-card flex h-full flex-col justify-between gap-4 border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="h-5 w-24 rounded-full bg-white/10" />
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded-full bg-white/10" />
              <div className="h-4 w-2/3 rounded-full bg-white/10" />
              <div className="h-4 w-1/2 rounded-full bg-white/10" />
            </div>
            <div className="h-4 w-20 rounded-full bg-white/10" />
          </div>
        ))}
      </Carousel>
    )
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="mt-6">
        <InfoMessage message="Nenhuma ferramenta recomendada no momento. Explore a biblioteca completa para descobrir novas automações." />
      </div>
    )
  }

  return (
    <Carousel id="dashboard-tools" className="mt-4">
      {tools.map((tool, index) => (
        <ToolCard key={tool.id ?? index} tool={tool} />
      ))}
    </Carousel>
  )
}

interface ToolCardProps {
  tool: DashboardToolSummary
}

function ToolCard({ tool }: ToolCardProps) {
  const router = useRouter()
  const tags = tool.tags ? tool.tags.slice(0, 3) : []

  const handleOpen = () => {
    if (tool.id) {
      router.push(`/tools?tool=${tool.id}`)
    } else {
      router.push('/tools')
    }
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="prompt-card group flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition"
    >
      <div className="border-glow" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium leading-snug text-white" style={{ fontFamily: 'Geist, sans-serif' }}>
            {tool.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/70 line-clamp-3">
            {tool.description}
          </p>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="liquid-glass-tag lowercase">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between text-xs text-white/50">
        <span>Clique para abrir</span>
        <ArrowRight className="h-3 w-3 text-white/60 transition group-hover:text-white" />
      </div>
    </button>
  )
}

interface InfoMessageProps {
  message: string
  variant?: 'default' | 'error'
  actionLabel?: string
  onAction?: () => void
}

function InfoMessage({ message, variant = 'default', actionLabel, onAction }: InfoMessageProps) {
  const isError = variant === 'error'
  return (
    <div
      className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-sm ${
        isError
          ? 'border-red-500/40 bg-red-500/10 text-red-100'
          : 'border-white/15 bg-white/5 text-white/80'
      }`}
    >
      <span>{message}</span>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`${
            isError
              ? 'liquid-glass-pill px-4 py-2 text-sm font-semibold text-red-100 hover:text-white'
              : 'liquid-glass-pill px-4 py-2 text-sm font-semibold text-white'
          }`}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
