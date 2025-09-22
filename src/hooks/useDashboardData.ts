'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DashboardSummary } from '@/types/dashboard'
import { fetchDashboardSummary } from '@/lib/services/dashboardService'

interface DashboardState {
  data: DashboardSummary | null
  loading: boolean
  error: string | null
}

export function useDashboardData(userId?: string | null) {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: Boolean(userId),
    error: null
  })

  const load = useCallback(async () => {
    if (!userId) {
      setState({ data: await fetchDashboardSummary(undefined), loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const summary = await fetchDashboardSummary(userId)
      setState({ data: summary, loading: false, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao carregar painel'
      setState({ data: null, loading: false, error: message })
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh: load
  }
}
