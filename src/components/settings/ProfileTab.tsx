'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { ProfileTabProps, STUDIO_THEMES, VALIDATION_RULES } from '../../types/settings'
import InlineEditableField from './InlineEditableField'
import AvatarUpload from './AvatarUpload'

export default function ProfileTab({ 
  profile, 
  themes, 
  isLoading, 
  onUpdateProfile, 
  onUploadAvatar, 
  onUpdateTheme,
  editingField,
  onEditField 
}: ProfileTabProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  if (!profile) {
    return (
      <div className="liquid-glass p-8 md:p-10 rounded-2xl">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded w-48" />
              <div className="h-4 bg-white/10 rounded w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-16 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  const handleSaveField = async (field: string, value: string): Promise<boolean> => {
    try {
      const result = await onUpdateProfile({ [field]: value })
      return result
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      return false
    }
  }

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true)
    try {
      const result = await onUploadAvatar(file)
      return result
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="liquid-glass p-8 md:p-10 rounded-2xl">
      <div className="space-y-10">
        {/* Avatar Upload Section */}
        <AvatarUpload
          currentAvatarUrl={profile.avatar_url}
          onUpload={handleAvatarUpload}
          isUploading={uploadingAvatar}
        />

        {/* Profile Fields */}
        <div className="space-y-6">
          <InlineEditableField
            label="Nome Completo"
            value={profile.full_name}
            field="full_name"
            isEditing={editingField === 'full_name'}
            onEdit={onEditField}
            onSave={handleSaveField}
            onCancel={() => onEditField(null)}
            placeholder="Digite seu nome completo"
            maxLength={VALIDATION_RULES.NAME_MAX_LENGTH}
            validation={(value) => {
              if (!value.trim()) return 'Nome é obrigatório'
              if (value.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
                return `Nome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`
              }
              return null
            }}
          />

          <InlineEditableField
            label="Nome de Usuário"
            value={profile.username}
            field="username"
            isEditing={editingField === 'username'}
            onEdit={onEditField}
            onSave={handleSaveField}
            onCancel={() => onEditField(null)}
            placeholder="@seunomedeusuario"
            maxLength={VALIDATION_RULES.USERNAME_MAX_LENGTH}
            validation={(value) => {
              const cleanUsername = value.replace('@', '')
              if (!cleanUsername) return 'Nome de usuário é obrigatório'
              if (cleanUsername.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
                return `Mínimo ${VALIDATION_RULES.USERNAME_MIN_LENGTH} caracteres`
              }
              if (cleanUsername.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
                return `Máximo ${VALIDATION_RULES.USERNAME_MAX_LENGTH} caracteres`
              }
              if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
                return 'Apenas letras, números e underscore'
              }
              return null
            }}
          />

          <InlineEditableField
            label="Bio"
            value={profile.bio || ''}
            field="bio"
            isEditing={editingField === 'bio'}
            onEdit={onEditField}
            onSave={handleSaveField}
            onCancel={() => onEditField(null)}
            placeholder="Conte um pouco sobre você..."
            maxLength={VALIDATION_RULES.BIO_MAX_LENGTH}
            validation={(value) => {
              if (value.length > VALIDATION_RULES.BIO_MAX_LENGTH) {
                return `Bio deve ter no máximo ${VALIDATION_RULES.BIO_MAX_LENGTH} caracteres`
              }
              return null
            }}
          />
        </div>

        {/* Studio Environment Section */}
        <div className="border-t border-white/5 pt-10">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Ambiente do Estúdio</h3>
            <p className="text-sm text-white/70">
              Escolha o gradiente que define seu espaço de trabalho.
            </p>
          </div>

          {/* Theme Gallery */}
          <div className="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible">
            <div className="flex gap-4 lg:grid lg:grid-cols-6 lg:gap-4 pb-4 lg:pb-0">
              {STUDIO_THEMES.map((theme) => {
                const isSelected = profile.studio_theme === theme.id
                const isInView = true // For mobile scroll tracking if needed
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateTheme(theme.id)}
                    className={`
                      relative flex-shrink-0 w-20 h-20 rounded-full overflow-hidden transition-all duration-400 cursor-pointer
                      ${isSelected 
                        ? 'ring-2 ring-white/70 scale-110' 
                        : 'ring-0 hover:scale-110'
                      }
                      ${isInView ? 'lg:transform-none' : 'transform scale-90 opacity-70'}
                    `}
                    style={{
                      background: theme.background,
                    }}
                    title={theme.name}
                  >
                    {/* Clean full-bleed background without inner overlays to avoid edge artifacts */}

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 transition-all duration-300">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center animate-scale-in">
                          <Check size={16} className="text-black" />
                        </div>
                      </div>
                    )}

                    {/* Theme name tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {theme.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Theme info */}
          <div className="mt-6 p-4 bg-black/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg"
                style={{
                  background: STUDIO_THEMES.find(t => t.id === profile.studio_theme)?.background || 'linear-gradient(135deg, #0a0a0a, #141414)'
                }}
              />
              <div>
                <p className="text-white font-medium">
                  {STUDIO_THEMES.find(t => t.id === profile.studio_theme)?.name || 'Padrão'}
                </p>
                <p className="text-white/60 text-sm">
                  Tema ativo do seu ambiente de trabalho
                </p>
              </div>
            </div>
          </div>

          {/* Mobile scroll tip */}
          <div className="lg:hidden mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-white/80 text-center">
              💡 Deslize horizontalmente para ver todos os temas
            </p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="border-t border-white/5 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {new Date(profile.created_at).toLocaleDateString('pt-BR', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
              <div className="text-sm text-white/60">Membro desde</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {profile.studio_theme}
              </div>
              <div className="text-sm text-white/60">Tema atual</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {new Date(profile.updated_at).toLocaleDateString('pt-BR') === new Date().toLocaleDateString('pt-BR') 
                  ? 'Hoje' 
                  : 'Ativo'
                }
              </div>
              <div className="text-sm text-white/60">Última atividade</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {(profile.bio?.length || 0) > 0 ? '✓' : '—'}
              </div>
              <div className="text-sm text-white/60">Bio preenchida</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Additional styles
const profileTabStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .shadow-inset-lg {
    box-shadow: inset 0 0 20px 3px rgba(0,0,0,0.3);
  }

  @keyframes scale-in {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-scale-in {
    animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .liquid-glass {
    backdrop-filter: blur(20px);
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  }
`
