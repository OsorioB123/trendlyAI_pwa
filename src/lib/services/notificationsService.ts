import { supabase } from '../supabase'
import type { Database } from '@/types/database'
import type { Notification } from '@/types/header'
import { RealtimeChannel } from '@supabase/supabase-js'

const TABLE_NAME = 'user_notifications'

type NotificationRow = Database['public']['Tables']['user_notifications']['Row']

type SubscriptionHandlers = {
  onInsert?: (notification: Notification) => void
  onUpdate?: (notification: Notification) => void
}

function mapRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
    readAt: row.read_at,
    actionUrl: row.action_url ?? undefined,
    type: row.type ?? undefined,
  }
}

export async function fetchNotifications(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return (data ?? []).map(mapRow)
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('id', notificationId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapRow(data)
}

export async function markAllNotificationsRead(userId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)
    .select('*')

  if (error) {
    throw error
  }

  return (data ?? []).map(mapRow)
}

export function subscribeToNotifications(userId: string, handlers: SubscriptionHandlers = {}) {
  const channel = supabase.channel(`user_notifications:${userId}`)

  channel
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: TABLE_NAME,
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      if (!handlers.onInsert) return
      const newRow = payload.new as NotificationRow
      handlers.onInsert(mapRow(newRow))
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: TABLE_NAME,
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      if (!handlers.onUpdate) return
      const newRow = payload.new as NotificationRow
      handlers.onUpdate(mapRow(newRow))
    })
    .subscribe()

  return channel
}

export function removeNotificationsSubscription(channel: RealtimeChannel) {
  supabase.removeChannel(channel)
}

export const NotificationsService = {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeToNotifications,
  removeNotificationsSubscription,
}

export default NotificationsService

