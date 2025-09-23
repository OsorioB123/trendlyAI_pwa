'use client'

import { useEffect, useMemo, useState } from 'react'
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
  const selectedTheme = availableThemes.find((theme) => theme.id === activeThemeId) || fallbackTheme

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
            <div className="flex gap-4 pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-6 lg:gap-4 lg:pb-0 lg:snap-none">
              {availableThemes.map((theme) => {
                const isSelected = activeThemeId === theme.id
                const themeImage = theme.imageUrl || studioThemeMap[theme.id]?.imageUrl

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleThemeSelect(theme.id)}
                    disabled={isLoading || isUpdatingTheme}
                    aria-pressed={isSelected}
                    className={cn(
                      'group relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60 snap-center',
                      isSelected ? 'scale-110 border-white/40' : 'hover:scale-105'
                    )}
                    style={{
                      backgroundImage: themeImage ? `url(${themeImage})` : undefined,
                      background: !themeImage ? theme.background : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                    title={theme.name}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/70 opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                    <div className="absolute inset-[2px] rounded-full border border-white/15" />

                    <span className="relative text-[0.7rem] font-medium text-white drop-shadow">
                      {theme.name}
                    </span>

                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200',
                        isSelected ? 'opacity-100' : 'group-hover:opacity-60'
                      )}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                        <Check size={16} />
                      </span>
                    </div>

                    <span className="pointer-events-none absolute -bottom-8 left-1/2 w-max -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {theme.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Theme info */}
          <div className="mt-6 rounded-lg bg-black/50 p-4">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 overflow-hidden rounded-lg border border-white/10"
                style={{
                  backgroundImage: selectedTheme?.imageUrl
                    ? `url(${selectedTheme.imageUrl})`
                    : undefined,
                  background: !selectedTheme?.imageUrl ? (selectedTheme?.background ?? fallbackTheme?.background) : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div>
                <p className="text-white font-medium">
                  {selectedTheme?.name || fallbackTheme?.name || 'Padrão'}
                </p>
                <p className="text-sm text-white/60">
                  Tema ativo do seu ambiente de trabalho
                </p>
                {isUpdatingTheme && (
                  <p className="mt-1 text-xs text-white/40">
                    Salvando preferências...
                  </p>
                )}
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
