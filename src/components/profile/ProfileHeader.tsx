'use client'

import { useState, useRef } from 'react'
import { 
  Camera, 
  Edit2, 
  Check, 
  X, 
  Loader, 
  Navigation, 
  Award, 
  Flame 
} from 'lucide-react'
import type { ProfileHeaderProps } from '../../types/profile'
import { PROFILE_LEVELS } from '../../types/profile'

export default function ProfileHeader({
  profile,
  isEditing,
  editingField,
  onEditField,
  onSaveField,
  onAvatarUpload,
  isUploading,
  isSaving,
  className = ''
}: ProfileHeaderProps) {
  const [formData, setFormData] = useState({
    display_name: profile.display_name || '',
    bio: profile.bio || ''
  })
  const [originalData, setOriginalData] = useState({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // =====================================================
  // AVATAR UPLOAD HANDLERS
  // =====================================================

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const success = await onAvatarUpload(file)
    if (success) {
      // Avatar upload success is handled by the parent component
    }
    
    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // =====================================================
  // INLINE EDITING HANDLERS
  // =====================================================

  const handleFieldEdit = (field: string) => {
    setOriginalData({ ...formData })
    onEditField(field)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveField = async (field: string) => {
    const value = formData[field as keyof typeof formData]
    if (value === originalData[field as keyof typeof originalData]) {
      onEditField(null)
      return
    }

    const success = await onSaveField(field, value)
    if (success) {
      onEditField(null)
    } else {
      // Revert changes on error
      setFormData(prev => ({ 
        ...prev, 
        [field]: originalData[field as keyof typeof originalData] 
      }))
    }
  }

  const handleCancelEdit = (field: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: originalData[field as keyof typeof originalData] 
    }))
    onEditField(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      if (field === 'bio' && !e.ctrlKey) return // Allow newlines in bio unless Ctrl+Enter
      e.preventDefault()
      handleSaveField(field)
    } else if (e.key === 'Escape') {
      handleCancelEdit(field)
    }
  }

  // Get level info
  const levelInfo = PROFILE_LEVELS[profile.level]

  return (
    <section className={`flex flex-col md:flex-row gap-8 items-center text-center md:text-left mb-16 animate-entry ${className}`}>
      {/* Avatar */}
      <button 
        className="relative flex-shrink-0 group avatar-interactive-wrapper"
        onClick={handleAvatarClick}
        disabled={isUploading}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
          <img 
            src={profile.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80'} 
            alt="Avatar do usuário" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Avatar Overlay */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center avatar-overlay bg-black/0 hover:bg-black/60 transition-all duration-300">
          {isUploading ? (
            <Loader className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={isUploading}
          className="hidden"
        />
      </button>

      {/* Profile Info */}
      <div className="flex-grow">
        {/* Editable Display Name */}
        <div className="mb-2">
          {editingField === 'display_name' ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'display_name')}
                className="text-5xl font-medium text-white tracking-tight bg-transparent border-b-2 border-white/50 focus:outline-none focus:border-white"
                autoFocus
                disabled={isSaving}
                placeholder="Digite seu nome"
              />
              <button
                onClick={() => handleSaveField('display_name')}
                disabled={isSaving}
                className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
              >
                {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleCancelEdit('display_name')}
                disabled={isSaving}
                className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-5xl font-medium text-white tracking-tight">
                {profile.display_name || 'Usuário'}
              </h1>
              <button
                onClick={() => handleFieldEdit('display_name')}
                className="p-1 text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Level */}
        <p className={`text-lg mb-6 ${levelInfo.color}`}>
          Nível Criativo: {levelInfo.name}
        </p>
        
        {/* Metrics Pills */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6">
          <div className="metric-pill bg-white/8 border border-white/12 rounded-full px-4 py-2 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-300">
            <Navigation className="w-4 h-4" />
            {profile.total_tracks || 0} Trilhas Ativas
          </div>
          <div className="metric-pill bg-white/8 border border-white/12 rounded-full px-4 py-2 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-300">
            <Award className="w-4 h-4" />
            {profile.completed_modules || 0} Módulos Concluídos
          </div>
          <div className="metric-pill bg-white/8 border border-white/12 rounded-full px-4 py-2 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-300">
            <Flame className="w-4 h-4" />
            Streak: {profile.streak_days || 0} Dias
          </div>
        </div>
        
        {/* Editable Bio */}
        <div className="mt-6">
          {editingField === 'bio' ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'bio')}
                placeholder="Conte um pouco sobre você..."
                className="w-full p-3 text-white/80 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 resize-none"
                rows={3}
                disabled={isSaving}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveField('bio')}
                  disabled={isSaving}
                  className="px-3 py-1 text-green-400 hover:text-green-300 disabled:opacity-50 text-sm flex items-center gap-1"
                >
                  {isSaving ? <Loader className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Salvar
                </button>
                <button
                  onClick={() => handleCancelEdit('bio')}
                  disabled={isSaving}
                  className="px-3 py-1 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancelar  
                </button>
                <span className="text-xs text-white/40 ml-auto">
                  Ctrl + Enter para salvar
                </span>
              </div>
            </div>
          ) : (
            <div className="group">
              <div className="flex items-start gap-2">
                <p className="text-white/70 leading-relaxed flex-1">
                  {profile.bio || 'Adicione uma biografia para contar mais sobre você...'}
                </p>
                <button
                  onClick={() => handleFieldEdit('bio')}
                  className="p-1 text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .avatar-interactive-wrapper {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .avatar-interactive-wrapper:hover {
          transform: scale(1.05);
        }
        .animate-entry {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideInFade {
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .metric-pill {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </section>
  )
}