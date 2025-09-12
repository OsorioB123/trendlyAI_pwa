'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Shield, Mail, Lock, KeyRound, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { SecurityTabProps } from '../../types/settings'
import SecurityModal from './SecurityModal'

export default function SecurityTab({
  security,
  onChangeEmail,
  onChangePassword,
  onSetup2FA,
  onDeleteAccount,
  activeModal,
  onSetActiveModal
}: SecurityTabProps) {
  if (!security) {
    return (
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-white/10 rounded w-48" />
          <div className="space-y-4">
            <div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-16 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  const handleModalSubmit = async (data: any): Promise<boolean> => {
    try {
      let result = false

      switch (activeModal) {
        case 'change-email':
          result = await onChangeEmail(data)
          break
        case 'change-password':
          result = await onChangePassword(data)
          break
        case 'setup-2fa':
          const setup2FAResult = await onSetup2FA(data)
          result = !!setup2FAResult
          break
        case 'delete-account':
          result = await onDeleteAccount(data)
          break
      }

      if (result) {
        onSetActiveModal(null)
      }

      return result
    } catch (error) {
      console.error('Modal submit error:', error)
      return false
    }
  }

  const getSecurityScore = () => {
    let score = 0
    let maxScore = 4

    // Email verified
    if (security.email) score += 1

    // Password set
    if (security.has_password) score += 1

    // 2FA enabled
    if (security.two_factor_enabled) score += 1

    // Recent password change (within 90 days)
    if (security.last_password_change) {
      const daysSinceChange = Math.floor(
        (Date.now() - security.last_password_change.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceChange <= 90) score += 1
    }

    return { score, maxScore, percentage: Math.round((score / maxScore) * 100) }
  }

  const securityScore = getSecurityScore()

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400 bg-green-500/20'
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const formatLastChange = (date?: Date) => {
    if (!date) return 'Nunca'
    
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      })
    } catch {
      return date.toLocaleDateString('pt-BR')
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Segurança da Conta</h3>
            <p className="text-white/70 text-sm">
              Mantenha sua conta protegida com estas configurações de segurança.
            </p>
          </div>
          
          {/* Security Score */}
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getScoreColor(securityScore.percentage)}`}>
              <Shield size={16} />
              <span>{securityScore.percentage}% Seguro</span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              {securityScore.score}/{securityScore.maxScore} configurações ativas
            </p>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <Mail size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Email</span>
                  <CheckCircle size={14} className="text-green-400" />
                </div>
                <p className="text-sm text-white/70 break-all">
                  {security.email}
                </p>
                {security.last_email_change && (
                  <p className="text-xs text-white/50">
                    Alterado {formatLastChange(security.last_email_change)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onSetActiveModal('change-email')}
              className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-md text-sm transition-all"
            >
              Alterar
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                <Lock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Senha</span>
                  {security.has_password ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <AlertTriangle size={14} className="text-orange-400" />
                  )}
                </div>
                <p className="text-sm text-white/70">
                  {security.has_password ? '••••••••' : 'Não definida'}
                </p>
                {security.last_password_change && (
                  <p className="text-xs text-white/50">
                    Alterada {formatLastChange(security.last_password_change)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onSetActiveModal('change-password')}
              className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-md text-sm transition-all"
            >
              {security.has_password ? 'Alterar' : 'Definir'}
            </button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                security.two_factor_enabled 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-orange-500/20 text-orange-400'
              }`}>
                <KeyRound size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Autenticação de Dois Fatores</span>
                  {security.two_factor_enabled ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <Clock size={14} className="text-orange-400" />
                  )}
                </div>
                <p className="text-sm text-white/70">
                  {security.two_factor_enabled 
                    ? 'Ativada - Sua conta está protegida com 2FA' 
                    : 'Adicione uma camada extra de segurança'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => onSetActiveModal('setup-2fa')}
              className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-md text-sm transition-all"
            >
              {security.two_factor_enabled ? 'Gerenciar' : 'Configurar'}
            </button>
          </div>
        </div>

        {/* Security Tips */}
        {securityScore.percentage < 100 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-medium text-sm">Dica de Segurança</h4>
                <p className="text-blue-200 text-xs mt-1">
                  {!security.two_factor_enabled && "Configure a autenticação de dois fatores para máxima proteção. "}
                  {security.last_password_change && 
                   Math.floor((Date.now() - security.last_password_change.getTime()) / (1000 * 60 * 60 * 24)) > 90 &&
                   "Considere alterar sua senha regularmente. "
                  }
                  Mantenha suas informações de login seguras e atualizadas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="border border-red-500/40 bg-red-500/5 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500/20 text-red-400 rounded-lg flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-red-300 font-semibold mb-2">Zona Perigosa</h4>
              <p className="text-red-200 text-sm mb-4">
                Essas ações são irreversíveis e podem resultar na perda permanente de dados. 
                Proceda com extrema cautela.
              </p>
              <button
                onClick={() => onSetActiveModal('delete-account')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <AlertTriangle size={16} />
                Excluir Conta Permanentemente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Modal */}
      <SecurityModal
        type={activeModal}
        isOpen={!!activeModal}
        onClose={() => onSetActiveModal(null)}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}