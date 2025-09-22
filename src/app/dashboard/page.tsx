'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Header from '@/components/layout/Header'
import BackgroundOverlay from '@/components/common/BackgroundOverlay'
import { HeaderVariant } from '@/types/header'
import { useBackground } from '@/contexts/BackgroundContext'
import { useAuth } from '@/contexts/AuthContext'
import { CommandHub } from '@/components/dashboard/command-hub'
import { CreatorSnapshot } from '@/components/dashboard/creator-snapshot'
import { KpiGrid } from '@/components/dashboard/kpi-grid'
import { GrowthInsights } from '@/components/dashboard/growth-insights'
import { ActionQueue } from '@/components/dashboard/action-queue'
import { ContentHighlights } from '@/components/dashboard/content-highlights'
import { LearningProgress } from '@/components/dashboard/learning-progress'
import { Toolbelt } from '@/components/dashboard/toolbelt'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/Button'
import { RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, user } = useAuth()
  const { currentBackground } = useBackground()
  const [commandInput, setCommandInput] = useState('')

  const { data, loading, error, refresh } = useDashboardData(user?.id)

  const summary = data

  const handleCommandSubmit = (value: string) => {
    router.push('/chat?message=' + encodeURIComponent(value.trim()))
  }

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-black text-white"
        style={{
          backgroundImage: 'radial-gradient(circle at top, rgba(59,130,246,0.15), transparent 60%), url(' + currentBackground.value + '?w=1200&q=60)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <BackgroundOverlay />
        <Header variant={HeaderVariant.PRIMARY} />
        <main className="relative z-10 mx-auto mt-28 w-full max-w-6xl px-4 pb-24">
          {error && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10 text-red-100">
              <AlertTitle>Não foi possível carregar todas as informações</AlertTitle>
              <AlertDescription>
                {error}
                <Button
                  variant="ghost"
                  className="ml-4 inline-flex items-center gap-2 text-red-100"
                  onClick={refresh}
                >
                  <RefreshCw className="h-4 w-4" /> Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
            <CommandHub
              commandValue={commandInput}
              onChange={setCommandInput}
              quickActions={summary?.quickActions ?? []}
              savedPrompts={summary?.savedPrompts ?? []}
              onSubmit={handleCommandSubmit}
            />
            <CreatorSnapshot profile={profile} snapshot={summary?.snapshot ?? {
              credits: profile?.credits,
              maxCredits: profile?.max_credits,
              streakDays: profile?.streak_days,
              level: profile?.level
            }} />
          </div>

          <section className="mt-8 space-y-8">
            <KpiGrid items={summary?.kpis ?? []} loading={loading} />
            {summary && summary.growthSeries.length > 0 && (
              <GrowthInsights series={summary.growthSeries} />
            )}

            <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
              <div className="space-y-6">
                <ActionQueue tasks={summary?.tasks ?? []} />
                <LearningProgress tracks={summary?.tracks ?? []} />
              </div>
              <div className="space-y-6">
                <ContentHighlights highlights={summary?.highlights ?? []} />
                <Toolbelt tools={summary?.tools ?? []} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  )
}
