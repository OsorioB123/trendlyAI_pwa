'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { DashboardKpi } from '@/types/dashboard'

interface KpiGridProps {
  items: DashboardKpi[]
  loading?: boolean
}

export function KpiGrid({ items, loading }: KpiGridProps) {
  const skeletonItems = new Array(4).fill(null)
  const data = loading ? skeletonItems : items

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {data.map((item, index) => (
        <KpiCard key={item ? item.id : index} kpi={item} loading={loading} />
      ))}
    </div>
  )
}

interface KpiCardProps {
  kpi: DashboardKpi | null
  loading?: boolean
}

function KpiCard({ kpi, loading }: KpiCardProps) {
  if (!kpi || loading) {
    return (
      <Card className="h-full animate-pulse border-white/5 bg-white/5">
        <CardContent className="space-y-4 p-6">
          <div className="h-4 w-24 rounded-full bg-white/10" />
          <div className="h-10 w-32 rounded-full bg-white/15" />
          <div className="h-24 rounded-xl bg-white/10" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-white/10 bg-white/5">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white/70">{kpi.label}</div>
          <TrendPill trend={kpi.trend} change={kpi.change} helper={kpi.helper} />
        </div>
        <div className="text-3xl font-semibold tracking-tight text-white">{kpi.value}</div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={kpi.series} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="kpi-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.6)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth={2}
                fill="url(#kpi-gradient)"
                fillOpacity={0.3}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface TrendPillProps {
  trend: 'up' | 'down' | 'flat'
  change: number
  helper?: string
}

function TrendPill({ trend, change, helper }: TrendPillProps) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const colorClass = trend === 'up' ? 'text-emerald-300' : trend === 'down' ? 'text-rose-300' : 'text-white/60'
  const prefix = trend === 'down' ? '-' : trend === 'flat' ? '±' : '+'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            'flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs font-medium text-white/70',
            colorClass
          )}>
            <Icon className={cn('h-3 w-3', colorClass)} />
            <span>{prefix + change}</span>
          </span>
        </TooltipTrigger>
        {helper && <TooltipContent>{helper}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}
