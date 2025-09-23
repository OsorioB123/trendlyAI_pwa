'use client'

import Image from 'next/image'
import { ExternalLink, Flame } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DashboardHighlight } from '@/types/dashboard'

interface ContentHighlightsProps {
  highlights: DashboardHighlight[]
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=60'

export function ContentHighlights({ highlights }: ContentHighlightsProps) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Conteúdos em destaque</CardTitle>
        <CardDescription className="text-white/70">
          Picos de desempenho que merecem ser replicados ou amplificados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {highlights.map((item) => (
          <article key={item.id} className="flex gap-3 rounded-2xl border border-white/5 bg-white/3 p-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl">
              <Image
                src={item.thumbnailUrl ?? PLACEHOLDER_IMAGE}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <Flame className="h-3.5 w-3.5" />
                  {item.channel}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white line-clamp-2">{item.title}</h3>
                <p className="text-xs text-white/60">
                  {item.metricLabel}: {item.metricValue} • {item.change >= 0 ? '+' : ''}{item.change}%
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>{formatRelativeDate(item.publishedAt)}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver detalhes
                </Button>
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  )
}

function formatRelativeDate(value?: string) {
  if (!value) return 'Data indisponível'
  const date = new Date(value)
  const now = new Date()
  const diff = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return diff + ' dias atrás'
}
