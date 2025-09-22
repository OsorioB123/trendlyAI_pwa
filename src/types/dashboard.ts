export type TrendDirection = 'up' | 'down' | 'flat'

export interface DashboardKpi {
  id: string
  label: string
  value: string
  helper?: string
  trend: TrendDirection
  change: number
  series: Array<{ date: string; value: number }>
}

export interface DashboardGrowthSeries {
  id: string
  label: string
  description?: string
  data: Array<{ date: string; primary: number; secondary?: number }>
}

export interface DashboardTask {
  id: string
  title: string
  type: 'content' | 'community' | 'learning' | 'system'
  dueAt?: string
  status: 'pending' | 'completed' | 'overdue'
  ctaLabel?: string
  ctaHref?: string
}

export interface DashboardHighlight {
  id: string
  title: string
  channel: string
  metricLabel: string
  metricValue: string
  change: number
  trend: TrendDirection
  publishedAt?: string
  thumbnailUrl?: string
}

export interface DashboardToolSummary {
  id: string
  title: string
  description: string
  category?: string
  tags?: string[]
  isFavorite?: boolean
  usageCount?: number
  lastUsedAt?: string
  content?: string
}

export interface DashboardTrackSummary {
  id: string
  title: string
  level: string
  progress: number
  updatedAt?: string
  category?: string
}

export interface DashboardSnapshot {
  credits?: number
  maxCredits?: number
  streakDays?: number
  level?: string
  nextMilestone?: string
  notifications?: Array<{ id: string; title: string; message: string }>
}

export interface DashboardSummary {
  kpis: DashboardKpi[]
  growthSeries: DashboardGrowthSeries[]
  tasks: DashboardTask[]
  highlights: DashboardHighlight[]
  tools: DashboardToolSummary[]
  tracks: DashboardTrackSummary[]
  snapshot: DashboardSnapshot
  quickActions: string[]
  savedPrompts: string[]
}
