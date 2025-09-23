'use client'

import { useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DashboardGrowthSeries } from '@/types/dashboard'

const RANGE_OPTIONS = ['7 dias', '30 dias', '90 dias']

interface GrowthInsightsProps {
  series: DashboardGrowthSeries[]
}

export function GrowthInsights({ series }: GrowthInsightsProps) {
  const firstTab = series[0]?.id ?? 'audience'
  const [range, setRange] = useState('7 dias')

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Insights de crescimento</CardTitle>
          <CardDescription className="text-white/70">
            Acompanhe métricas chave e compare evolução em diferentes períodos.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option}
              variant={option === range ? 'default' : 'secondary'}
              size="sm"
              className={cn('rounded-full px-4', option === range ? 'bg-white text-slate-900' : 'bg-white/10 text-white')}
              onClick={() => setRange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue={firstTab} className="w-full">
          <TabsList className="mb-6">
            {series.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {series.map((item) => (
            <TabsContent key={item.id} value={item.id} className="mt-0">
              <div className="space-y-3">
                {item.description && (
                  <p className="text-sm text-white/60">{item.description}</p>
                )}
                <div className="h-72 rounded-3xl border border-white/10 bg-black/30">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={item.data} margin={{ left: 0, right: 0, top: 20, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} tickFormatter={(value: string) => value.slice(5)} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} width={60} tickFormatter={(value: number) => formatCompact(value)} />
                      <RechartsTooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.7)' }} formatter={(value: number) => [formatCompact(value), '']} />
                      <defs>
                        <linearGradient id={item.id + '-primary'} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(255,255,255,0.8)" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id={item.id + '-secondary'} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(94,234,212,0.7)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="rgba(94,234,212,0.05)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="primary" stroke="rgba(255,255,255,0.9)" strokeWidth={3} fill={'url(#' + item.id + '-primary)'} isAnimationActive={false} />
                      <Area type="monotone" dataKey="secondary" stroke="rgba(94,234,212,0.8)" strokeWidth={2} fill={'url(#' + item.id + '-secondary)'} fillOpacity={0.3} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

const tooltipStyle = {
  background: 'rgba(5,7,12,0.95)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white'
}

function formatCompact(value: number) {
  if (Math.abs(value) >= 1000000) return (value / 1000000).toFixed(1) + 'M'
  if (Math.abs(value) >= 1000) return (value / 1000).toFixed(1) + 'K'
  return String(Math.round(value))
}
