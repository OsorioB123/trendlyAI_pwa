"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Notification } from '@/types/header'
import NotificationsService, { subscribeToNotifications, removeNotificationsSubscription } from '@/lib/services/notificationsService'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseNotificationsResult {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
}

export function useNotifications(userId?: string | null): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel | null = null
    let mounted = true

    const loadNotifications = async () => {
      if (!userId) {
        setNotifications([])
        return
      }

      try {
        setLoading(true)
        const result = await NotificationsService.fetchNotifications(userId)
        if (!mounted) return
        setNotifications(result)
      } catch (err) {
        console.error('Failed to fetch notifications', err)
        if (mounted) setError('Erro ao carregar notificações')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    const subscribe = () => {
      if (!userId) return
      channel = subscribeToNotifications(userId, {
        onInsert: (notification) => {
          setNotifications((prev) => {
            const exists = prev.some((item) => item.id === notification.id)
            if (exists) return prev
            return [notification, ...prev].slice(0, 30)
          })
        },
        onUpdate: (notification) => {
          setNotifications((prev) =>
            prev.map((item) => (item.id === notification.id ? notification : item))
          )
        }
      })
    }

    void loadNotifications()
    subscribe()

    return () => {
      mounted = false
      if (channel) {
        removeNotificationsSubscription(channel)
      }
    }
  }, [userId])

  const markNotificationRead = useCallback(async (id: string) => {
    if (!userId) return
    try {
      const updated = await NotificationsService.markNotificationRead(userId, id)
      setNotifications((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      console.error('Failed to mark notification as read', err)
      setError('Erro ao atualizar notificação')
    }
  }, [userId])

  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return
    try {
      const updatedList = await NotificationsService.markAllNotificationsRead(userId)
      if (updatedList.length === 0) {
        setNotifications((prev) => prev.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })))
      } else {
        const updatedIds = new Set(updatedList.map((item) => item.id))
        setNotifications((prev) =>
          prev.map((item) => (updatedIds.has(item.id) ? { ...item, readAt: new Date().toISOString() } : item))
        )
      }
    } catch (err) {
      console.error('Failed to mark notifications as read', err)
      setError('Erro ao atualizar notificações')
    }
  }, [userId])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications]
  )

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markNotificationRead,
    markAllNotificationsRead,
  }
}

export default useNotifications
