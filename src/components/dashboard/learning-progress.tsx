'use client'

import { BookOpen, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/Button'
import type { DashboardTrackSummary } from '@/types/dashboard'

interface LearningProgressProps {
  tracks: DashboardTrackSummary[]
}

export function LearningProgress({ tracks }: LearningProgressProps) {
  const router = useRouter()
  const items = tracks.length > 0 ? tracks : placeholderTracks

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Seu progresso em trilhas</CardTitle>
        <CardDescription className="text-white/70">
          Retome módulos em andamento ou desbloqueie novos aprendizados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((track) => (
            <div key={track.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">{track.level}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">{track.title}</h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  {track.progress}%
                </span>
              </div>
              <Progress value={track.progress} className="mt-4" />
              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span>Atualizado {formatRelative(track.updatedAt)}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => router.push('/tracks/' + track.id)}
                >
                  Retomar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/20"
          onClick={() => router.push('/tracks')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Explorar novas trilhas
        </Button>
      </CardContent>
    </Card>
  )
}

const placeholderTracks: DashboardTrackSummary[] = [
  { id: 'placeholder-1', title: 'Trilha de social media', level: 'Intermediário', progress: 45 },
  { id: 'placeholder-2', title: 'Trilha de monetização', level: 'Iniciante', progress: 20 }
]

function formatRelative(value?: string) {
  if (!value) return 'recentemente'
  const date = new Date(value)
  const now = new Date()
  const diff = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'hoje'
  if (diff === 1) return 'ontem'
  return diff + ' dias atrás'
}
