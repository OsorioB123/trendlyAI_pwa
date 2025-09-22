'use client'

import Image from 'next/image'
import { Flame, Crown, Bell } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import type { DashboardSnapshot } from '@/types/dashboard'
import type { Profile } from '@/contexts/AuthContext'

interface CreatorSnapshotProps {
  profile: Profile | null
  snapshot: DashboardSnapshot
  onManagePlan?: () => void
}

export function CreatorSnapshot({ profile, snapshot, onManagePlan }: CreatorSnapshotProps) {
  const credits = snapshot.credits ?? 0
  const maxCredits = snapshot.maxCredits ?? 100
  const progress = maxCredits > 0 ? Math.min(100, Math.round((credits / maxCredits) * 100)) : 0

  return (
    <Card className="h-full bg-white/5">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-semibold">Olá, {profile?.display_name ?? 'Criador'}</CardTitle>
            <CardDescription className="text-white/70">
              Continue a construir sua comunidade. Você tem {credits} créditos disponíveis.
            </CardDescription>
          </div>
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.display_name ?? 'Avatar'} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10 text-lg font-semibold text-white/70">
                {(profile?.display_name ?? 'C')[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Créditos disponíveis</span>
            <span>{credits} / {maxCredits}</span>
          </div>
          <Progress value={progress} className="mt-3" />
          <div className="mt-3 flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Streak atual: {snapshot.streakDays ?? 0} dias</span>
            </div>
            <Button variant="link" className="h-auto p-0 text-xs" onClick={onManagePlan}>
              Gerenciar plano
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Nível atual</p>
              <p className="text-xs text-white/60">Você está evoluindo para Expert</p>
            </div>
            <Badge className="rounded-full bg-purple-500/20 text-purple-200">
              <Crown className="mr-1 h-3.5 w-3.5" />
              {snapshot.level ?? 'Explorador'}
            </Badge>
          </div>
          {snapshot.nextMilestone && (
            <p className="mt-3 text-xs text-white/60">{snapshot.nextMilestone}</p>
          )}
        </div>

        {snapshot.notifications && snapshot.notifications.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Bell className="h-4 w-4 text-emerald-300" />
              Atualizações recentes
            </div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {snapshot.notifications.map((note) => (
                <li key={note.id} className="rounded-xl bg-black/20 p-3">
                  <p className="font-medium text-white">{note.title}</p>
                  <p className="text-xs text-white/60">{note.message}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
