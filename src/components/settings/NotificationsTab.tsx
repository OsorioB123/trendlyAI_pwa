'use client'

import { Bell, Mail, Smartphone, BarChart3, Megaphone, Zap, Users, Calendar, Settings } from 'lucide-react'
import { NotificationsTabProps } from '../../types/settings'
import { IconToggleSwitch } from './ToggleSwitch'

export default function NotificationsTab({ 
  preferences, 
  onUpdatePreferences, 
  isLoading 
}: NotificationsTabProps) {
  const notifications = preferences
  if (!notifications) {
    return (
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-white/10 rounded w-48" />
          <div className="space-y-4">
            <div className="h-20 bg-white/10 rounded-lg" />
            <div className="h-20 bg-white/10 rounded-lg" />
            <div className="h-20 bg-white/10 rounded-lg" />
            <div className="h-20 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  const handleToggleChange = async (key: keyof typeof notifications, value: boolean) => {
    try {
      await onUpdatePreferences({ [key]: value })
    } catch (error) {
      console.error(`Error updating ${key}:`, error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notifications Overview */}
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">Preferências de Notificação</h3>
          <p className="text-white/70 text-sm">
            Configure como você quer ser notificado sobre atividades importantes na plataforma.
          </p>
        </div>

        <div className="space-y-1">
          {/* Email Notifications */}
          <IconToggleSwitch
            icon={<Mail size={18} />}
            label="Notificações por Email"
            description="Receba atualizações importantes por email. Você pode desativar a qualquer momento."
            checked={notifications.email_notifications}
            onChange={(checked) => handleToggleChange('email_notifications', checked)}
            disabled={isLoading}
          />

          {/* Push Notifications */}
          <IconToggleSwitch
            icon={<Smartphone size={18} />}
            label="Notificações Push"
            description="Notificações em tempo real no seu dispositivo. Requer permissão do navegador."
            checked={notifications.push_notifications}
            onChange={(checked) => handleToggleChange('push_notifications', checked)}
            disabled={isLoading}
          />

          {/* Weekly Reports */}
          <IconToggleSwitch
            icon={<BarChart3 size={18} />}
            label="Relatórios Semanais"
            description="Resumo semanal das suas atividades e métricas. Envio às segundas às 8h."
            checked={notifications.weekly_reports}
            onChange={(checked) => handleToggleChange('weekly_reports', checked)}
            disabled={isLoading}
          />

          {/* Marketing Communications */}
          <IconToggleSwitch
            icon={<Megaphone size={18} />}
            label="Comunicações de Marketing"
            description="Novidades, promoções e conteúdo educativo. Você pode desativar quando quiser."
            checked={!!notifications.marketing_communications}
            onChange={(checked) => handleToggleChange('marketing_communications' as any, checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Advanced Notifications */}
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Notificações Avançadas</h3>
          <p className="text-white/70 text-sm">
            Configurações específicas para otimizar sua experiência.
          </p>
        </div>

        <div className="space-y-1">
          {/* Security Alerts */}
          <IconToggleSwitch
            icon={<Settings size={18} />}
            label="Alertas de Segurança"
            description="Notificações sobre atividades suspeitas na conta. Sempre ativo por segurança."
            checked={notifications.security_alerts}
            onChange={(checked) => handleToggleChange('security_alerts', checked)}
            disabled={true} // Always required for security
          />

          {/* Feature Updates */}
          <IconToggleSwitch
            icon={<Zap size={18} />}
            label="Atualizações de Recursos"
            description="Seja o primeiro a saber sobre novos recursos."
            checked={!!notifications.feature_updates}
            onChange={(checked) => handleToggleChange('feature_updates' as any, checked)}
            disabled={isLoading}
          />

          {/* Community Activity */}
          <IconToggleSwitch
            icon={<Users size={18} />}
            label="Atividade da Comunidade"
            description="Interações, comentários e menções da comunidade."
            checked={!!notifications.community_activity}
            onChange={(checked) => handleToggleChange('community_activity' as any, checked)}
            disabled={isLoading}
          />

          {/* System Maintenance */}
          <IconToggleSwitch
            icon={<Calendar size={18} />}
            label="Manutenções Programadas"
            description="Avisos sobre manutenções e atualizações do sistema. Recomendado manter ativo."
            checked={!!notifications.system_maintenance}
            onChange={(checked) => handleToggleChange('system_maintenance' as any, checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Notification Settings Summary */}
      <div className="liquid-glass p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-white font-medium">Estado das Notificações</p>
              <p className="text-white/60 text-sm">
                {getActiveNotificationsCount(notifications)}/{getTotalNotificationsCount()} ativas
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/70">
              {notifications.email_notifications && notifications.push_notifications ? (
                <span className="text-green-400">✓ Totalmente configurado</span>
              ) : notifications.email_notifications || notifications.push_notifications ? (
                <span className="text-yellow-400">⚠ Parcialmente configurado</span>
              ) : (
                <span className="text-red-400">⚠ Configuração recomendada</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Tips */}
      {(!notifications.email_notifications && !notifications.push_notifications) && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-300 font-medium text-sm">Dica de Notificação</h4>
              <p className="text-blue-200 text-xs mt-1">
                Recomendamos ativar pelo menos as notificações por email ou push para não perder atualizações importantes da sua conta e atividades da plataforma.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getActiveNotificationsCount(notifications: any): number {
  return Object.values(notifications).filter(value => value === true).length
}

function getTotalNotificationsCount(): number {
  return 8 // Total number of notification options
}
