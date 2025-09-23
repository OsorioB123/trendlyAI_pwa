'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'
import ProfileHeader from '../../components/profile/ProfileHeader'
import NextActionCard from '../../components/profile/NextActionCard'
import ArsenalSection from '../../components/profile/ArsenalSection'
import ReferralSection from '../../components/profile/ReferralSection'
import { AmbientSelector } from '../../components/profile/ambient-selector/AmbientSelector'
import { SettingsService } from '@/lib/services/settingsService'
import type { ArsenalTab, ReferralTab } from '../../types/profile'
import { useBackground } from '../../contexts/BackgroundContext'

// Background comes from user preferences via BackgroundContext

export default function ProfileContent() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const {
    profile,
    nextAction,
    arsenalData,
    referralInfo,
    isLoading: profileLoading,
    isUploading: profileUploading,
    isSaving: profileSaving,
    error: profileError,
    clearError,
    editingField,
    setEditingField,
    saveField,
    uploadAvatar
  } = useProfile()
  const { currentBackground } = useBackground()

  // UI state
  const [activeArsenalTab, setActiveArsenalTab] = useState<ArsenalTab>('trails')
  const [activeReferralTab, setActiveReferralTab] = useState<ReferralTab>('credits')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isAmbientSaving, setIsAmbientSaving] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    const isE2E = typeof window !== 'undefined' && (window as any).__E2E_TEST__ === true
    if (!isE2E && !authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Handle profile hook errors
  useEffect(() => {
    if (!profileError) return

    setErrorMessage(profileError)
    const timeout = setTimeout(() => {
      setErrorMessage('')
      clearError()
    }, 5000)

    return () => clearTimeout(timeout)
  }, [profileError, clearError])

  const handlePersistAmbient = async (themeId: string) => {
    if (!user?.id) return false

    try {
      setIsAmbientSaving(true)
      const response = await SettingsService.updateStudioTheme(user.id, themeId)

      if (response.success) {
        setSuccessMessage('Ambiente atualizado com sucesso!')
        setTimeout(() => setSuccessMessage(''), 3000)
        return true
      }

      setErrorMessage(response.error || 'Não foi possível atualizar o ambiente.')
      setTimeout(() => setErrorMessage(''), 4000)
      return false
    } catch (error) {
      console.error('Error persisting ambient selection:', error)
      setErrorMessage('Erro inesperado ao salvar ambiente.')
      setTimeout(() => setErrorMessage(''), 4000)
      return false
    } finally {
      setIsAmbientSaving(false)
    }
  }

  // Show loading state
  if (authLoading || profileLoading || !user || !profile) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("${currentBackground.value}?w=800&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <BackgroundOverlay />
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=1920&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <BackgroundOverlay />

      {/* Header */}
      <Header />

      {/* Toast Messages */}
      {(successMessage || errorMessage) && (
        <div className="fixed top-6 right-6 z-50 space-y-3">
          {successMessage && (
            <div className="relative flex items-start gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white shadow-lg shadow-black/30 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1 text-sm leading-5 text-white/90">
                {successMessage}
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="relative flex items-start gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white shadow-lg shadow-black/30 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-200">
                <XCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 text-sm leading-5 text-white/90">
                {errorMessage}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Profile Header */}
          <ProfileHeader 
            profile={profile as any}
            editingField={editingField}
            onEditField={setEditingField}
            onSaveField={saveField}
            onAvatarUpload={uploadAvatar}
            isUploading={profileUploading}
            isSaving={profileSaving}
          />

          {/* Ambient Selector */}
          <AmbientSelector
            className="mt-2"
            onPersist={handlePersistAmbient}
            isSaving={isAmbientSaving}
          />

          {/* Next Action Card */}
          {nextAction && (
            <NextActionCard 
              recommendation={nextAction}
              onActionClick={() => {
                console.log('Next action clicked')
                // Could trigger analytics or profile update here
              }}
            />
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Arsenal Section */}
            <ArsenalSection
              arsenalData={arsenalData as any}
              activeTab={activeArsenalTab}
              onTabChange={setActiveArsenalTab}
              onTrackClick={(track) => router.push(`/tracks/${track.id}`)}
              onNavigateToTools={() => router.push('/tools')}
              isLoading={profileLoading}
            />

            {/* Referral Section */}
            <ReferralSection
              referralInfo={referralInfo as any}
              activeTab={activeReferralTab}
              onTabChange={setActiveReferralTab}
              onCopyReferralLink={() => {
                setSuccessMessage('Código de referência copiado!')
                setTimeout(() => setSuccessMessage(''), 3000)
              }}
              onNavigateToAffiliate={() => console.log('Navigate to affiliate')}
            />

          </div>
        </div>
      </div>
    </div>
  )
}
