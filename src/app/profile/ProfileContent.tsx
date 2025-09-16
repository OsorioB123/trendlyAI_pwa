'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'
import { HeaderVariant } from '../../types/header'
import ProfileHeader from '../../components/profile/ProfileHeader'
import NextActionCard from '../../components/profile/NextActionCard'
import ArsenalSection from '../../components/profile/ArsenalSection'
import ReferralSection from '../../components/profile/ReferralSection'
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
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
      <Header 
        variant={HeaderVariant.SECONDARY}
      />

      {/* Toast Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-xl">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-xl">
          <X className="w-5 h-5" />
          {errorMessage}
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
