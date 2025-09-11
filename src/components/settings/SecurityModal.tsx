'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, AlertTriangle, Lock, Mail, Shield, Trash2 } from 'lucide-react'
import { SecurityModalProps, ChangeEmailRequest, ChangePasswordRequest, DeleteAccountRequest, VALIDATION_RULES } from '../../types/settings'

const MODAL_CONFIGS = {
  'change-email': {
    title: 'Alterar seu Email',
    description: 'Digite sua senha atual e o novo email para confirmar a alteração.',
    icon: Mail,
    dangerLevel: 'medium' as const
  },
  'change-password': {
    title: 'Alterar sua Senha',
    description: 'Digite sua senha atual e escolha uma nova senha segura.',
    icon: Lock,
    dangerLevel: 'medium' as const
  },
  'setup-2fa': {
    title: 'Configurar Autenticação de Dois Fatores',
    description: 'Configure 2FA para adicionar uma camada extra de segurança à sua conta.',
    icon: Shield,
    dangerLevel: 'low' as const
  },
  'delete-account': {
    title: 'Você tem certeza absoluta?',
    description: 'Esta ação é irreversível. Todos os seus dados, projetos e trilhas serão permanentemente apagados. Não há como voltar atrás.',
    icon: Trash2,
    dangerLevel: 'high' as const
  }
}

export default function SecurityModal({ type, isOpen, onClose, onSubmit, isLoading = false }: SecurityModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const config = type ? MODAL_CONFIGS[type] : null
  const Icon = config?.icon || Lock

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setFormData({})
      setShowPasswords({})
      setErrors({})
      setIsFormValid(false)
      
      // Focus first input
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    validateForm()
  }, [formData, type])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let valid = true

    if (type === 'change-email') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória'
        valid = false
      }
      if (!formData.newEmail) {
        newErrors.newEmail = 'Novo email é obrigatório'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
        newErrors.newEmail = 'Email inválido'
        valid = false
      }
    }

    if (type === 'change-password') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória'
        valid = false
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'Nova senha é obrigatória'
        valid = false
      } else if (formData.newPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
        newErrors.newPassword = `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`
        valid = false
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
        valid = false
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não conferem'
        valid = false
      }
    }

    if (type === 'setup-2fa') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória'
        valid = false
      }
    }

    if (type === 'delete-account') {
      if (formData.confirmationText !== VALIDATION_RULES.DELETE_CONFIRMATION_TEXT) {
        newErrors.confirmationText = `Digite "${VALIDATION_RULES.DELETE_CONFIRMATION_TEXT}" para confirmar`
        valid = false
      }
    }

    setErrors(newErrors)
    setIsFormValid(valid && Object.keys(formData).length > 0)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading) return

    try {
      let submitData
      
      switch (type) {
        case 'change-email':
          submitData = {
            current_password: formData.currentPassword,
            new_email: formData.newEmail
          } as ChangeEmailRequest
          break
        case 'change-password':
          submitData = {
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
            confirm_password: formData.confirmPassword
          } as ChangePasswordRequest
          break
        case 'setup-2fa':
          submitData = formData.currentPassword
          break
        case 'delete-account':
          submitData = {
            confirmation_text: formData.confirmationText
          } as DeleteAccountRequest
          break
        default:
          return
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Modal submit error:', error)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const renderFormFields = () => {
    switch (type) {
      case 'change-email':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Senha Atual</label>
              <div className="relative">
                <input
                  ref={firstInputRef}
                  type={showPasswords.currentPassword ? 'text' : 'password'}
                  value={formData.currentPassword || ''}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPasswords.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-400 text-xs">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Novo Email</label>
              <input
                type="email"
                value={formData.newEmail || ''}
                onChange={(e) => handleInputChange('newEmail', e.target.value)}
                placeholder="novo@exemplo.com"
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50"
              />
              {errors.newEmail && (
                <p className="text-red-400 text-xs">{errors.newEmail}</p>
              )}
            </div>
          </>
        )

      case 'change-password':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Senha Atual</label>
              <div className="relative">
                <input
                  ref={firstInputRef}
                  type={showPasswords.currentPassword ? 'text' : 'password'}
                  value={formData.currentPassword || ''}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPasswords.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-400 text-xs">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Nova Senha</label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  value={formData.newPassword || ''}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Digite sua nova senha"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPasswords.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-xs">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword || ''}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirme sua nova senha"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </>
        )

      case 'setup-2fa':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Senha Atual</label>
            <div className="relative">
              <input
                ref={firstInputRef}
                type={showPasswords.currentPassword ? 'text' : 'password'}
                value={formData.currentPassword || ''}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Digite sua senha atual para confirmar"
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
              >
                {showPasswords.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-400 text-xs">{errors.currentPassword}</p>
            )}
          </div>
        )

      case 'delete-account':
        return (
          <>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-medium text-sm">Atenção: Ação Irreversível</p>
                  <p className="text-red-200 text-xs mt-1">
                    Todos os seus dados, conversas, trilhas e configurações serão perdidos permanentemente.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Digite "{VALIDATION_RULES.DELETE_CONFIRMATION_TEXT}" para confirmar
              </label>
              <input
                ref={firstInputRef}
                type="text"
                value={formData.confirmationText || ''}
                onChange={(e) => handleInputChange('confirmationText', e.target.value)}
                placeholder={VALIDATION_RULES.DELETE_CONFIRMATION_TEXT}
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors disabled:opacity-50 font-mono"
              />
              {errors.confirmationText && (
                <p className="text-red-400 text-xs">{errors.confirmationText}</p>
              )}
              <p className="text-white/50 text-xs">
                Esta ação não pode ser desfeita. Seus dados serão excluídos em 24 horas.
              </p>
            </div>
          </>
        )

      default:
        return null
    }
  }

  const getButtonStyles = () => {
    const base = "w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    
    switch (config?.dangerLevel) {
      case 'high':
        return `${base} bg-red-600 hover:bg-red-700 text-white`
      case 'medium':
        return `${base} bg-white text-black hover:bg-white/90`
      default:
        return `${base} bg-blue-600 hover:bg-blue-700 text-white`
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Processando...'
    
    switch (type) {
      case 'change-email':
        return 'Alterar Email'
      case 'change-password':
        return 'Alterar Senha'
      case 'setup-2fa':
        return 'Configurar 2FA'
      case 'delete-account':
        return 'Sim, excluir minha conta permanentemente'
      default:
        return 'Confirmar'
    }
  }

  if (!isOpen || !type || !config) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md bg-[#1a1a1a] border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              config.dangerLevel === 'high' 
                ? 'bg-red-500/20 text-red-400' 
                : config.dangerLevel === 'medium'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-blue-500/20 text-blue-400'
            }`}>
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {config.title}
              </h3>
              <p className="text-sm text-white/70">
                {config.description}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 text-white/60 hover:text-white/80 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {renderFormFields()}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={getButtonStyles()}
            >
              {getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}