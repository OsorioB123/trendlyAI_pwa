'use client'

import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { ProfileTabProps, VALIDATION_RULES } from '../../types/settings'
import { DEFAULT_STUDIO_THEME_ID, STUDIO_THEMES, studioThemeMap } from '@/data/studioThemes'
import { useBackground } from '@/contexts/BackgroundContext'
import { cn } from '@/lib/utils'
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
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false)
  const [pendingThemeId, setPendingThemeId] = useState<string | null>(null)
  const { changeBackground } = useBackground()
  const availableThemes = useMemo(() => (
    themes && themes.length > 0 ? themes : STUDIO_THEMES
  ), [themes])
  const fallbackTheme = studioThemeMap[DEFAULT_STUDIO_THEME_ID]
  const activeThemeId = pendingThemeId ?? profile?.studio_theme ?? fallbackTheme?.id ?? DEFAULT_STUDIO_THEME_ID
  const sphereSize = 96

  useEffect(() => {
    if (!pendingThemeId || !profile?.studio_theme) {
      return
    }

    if (profile.studio_theme === pendingThemeId) {
      setPendingThemeId(null)
    }
  }, [pendingThemeId, profile?.studio_theme])

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

  const handleThemeSelect = async (themeId: string) => {
    if (isUpdatingTheme || profile.studio_theme === themeId) {
      return
    }

    setIsUpdatingTheme(true)
    setPendingThemeId(themeId)
    const previousThemeId = profile.studio_theme || DEFAULT_STUDIO_THEME_ID

    try {
      await changeBackground(themeId, { persist: false })
      const success = await onUpdateTheme(themeId)

      if (!success) {
        await changeBackground(previousThemeId, { persist: false })
        setPendingThemeId(null)
      }
    } finally {
      setIsUpdatingTheme(false)
    }
  }

  return (
    <div className="liquid-glass p-8 md:p-10 rounded-2xl">
      <div className="grid grid-cols-1 gap-y-10">
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
        <div className="pt-10 border-t border-white/10">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Ambiente do Estúdio</h3>
            <p className="text-sm text-white/70">
              Escolha o gradiente que define seu espaço de trabalho.
            </p>
          </div>

          <div id="studio-environment-gallery" className="mt-4">
            <div className="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible">
              <ol
                id="studio-environment-track"
                className="flex items-center gap-4 py-4 snap-x snap-mandatory lg:grid lg:grid-cols-6 lg:gap-4 lg:py-0 lg:snap-none"
              >
                {availableThemes.map((theme) => {
                  const isSelected = activeThemeId === theme.id
                  const mappedTheme = studioThemeMap[theme.id] || theme
                  const themeImage = mappedTheme?.imageUrl || theme.imageUrl
                  const sphereStyle: (CSSProperties & { '--sphere-bg'?: string }) = {
                    width: sphereSize,
                    height: sphereSize
                  }

                  if (themeImage) {
                    sphereStyle['--sphere-bg'] = `url(${themeImage})`
                  } else if (mappedTheme?.background || theme.background) {
                    sphereStyle['--sphere-bg'] = mappedTheme?.background || theme.background
                  }

                  return (
                    <li
                      key={theme.id}
                      className="flex-shrink-0 snap-center px-1 lg:flex lg:justify-center"
                    >
                      <button
                        type="button"
                        data-theme-id={theme.id}
                        onClick={() => handleThemeSelect(theme.id)}
                        disabled={isLoading || isUpdatingTheme}
                        aria-pressed={isSelected}
                        aria-label={theme.name}
                        title={theme.name}
                        className={cn(
                          'theme-sphere relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60',
                          isSelected && 'is-selected'
                        )}
                        style={sphereStyle}
                      >
                        <span className="sr-only">{theme.name}</span>
                        <div className="check-icon">
                          <Check size={20} className="text-white" strokeWidth={1.5} />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          {isUpdatingTheme && (
            <p className="mt-3 text-xs text-white/50" role="status" aria-live="polite">
              Salvando preferências...
            </p>
          )}
        </div>


      </div>
    </div>
  )
}
