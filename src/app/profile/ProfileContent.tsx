'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import { HeaderVariant } from '../../types/header'
import ProfileHeader from '../../components/profile/ProfileHeader'
import NextActionCard from '../../components/profile/NextActionCard'
import ArsenalSection from '../../components/profile/ArsenalSection'
import ReferralSection from '../../components/profile/ReferralSection'
import type { ArsenalTab, ReferralTab } from '../../types/profile'

// Mock background for now - in production this would come from user settings
const CURRENT_BACKGROUND = {
  value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
}

export default function ProfileContent() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const profile = useProfile()

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
    if (profile.error) {
      setErrorMessage(profile.error)
      setTimeout(() => {
        setErrorMessage('')
        profile.clearError()
      }, 5000)
    }
  }, [profile.error, profile.clearError])

  // Show loading state
  if (authLoading || profile.isLoading || !user || !profile.profile) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("${CURRENT_BACKGROUND.value}?w=800&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  const handleProfileUpdate = async (data: any) => {
    try {
      const result = await profile.updateProfile(data)
      if (result.success) {
        setSuccessMessage('Perfil atualizado com sucesso!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage(result.error || 'Erro ao atualizar perfil')
        setTimeout(() => setErrorMessage(''), 5000)
      }
    } catch (error) {
      setErrorMessage('Erro inesperado ao atualizar perfil')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleAvatarUpdate = async (file: File) => {
    try {
      const result = await profile.updateAvatar(file)
      if (result.success) {
        setSuccessMessage('Avatar atualizado com sucesso!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage(result.error || 'Erro ao atualizar avatar')
        setTimeout(() => setErrorMessage(''), 5000)
      }
    } catch (error) {
      setErrorMessage('Erro inesperado ao atualizar avatar')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url("${CURRENT_BACKGROUND.value}?w=1920&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent -z-10" />

      {/* Header */}
      <Header 
        variant={HeaderVariant.Profile}
        user={user}
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
            user={user}
            profile={profile.profile}
            metrics={profile.metrics}
            onProfileUpdate={handleProfileUpdate}
            onAvatarUpdate={handleAvatarUpdate}
            isUpdating={profile.isUpdating}
          />

          {/* Next Action Card */}
          {profile.nextAction && (
            <NextActionCard 
              recommendation={profile.nextAction}
              onActionTaken={(actionType) => {
                console.log('Action taken:', actionType)
                // Could trigger analytics or profile update here
              }}
            />
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Arsenal Section */}
            <ArsenalSection
              arsenal={profile.arsenal}
              activeTab={activeArsenalTab}
              onTabChange={setActiveArsenalTab}
              isLoading={profile.isLoading}
            />

            {/* Referral Section */}
            <ReferralSection
              referralInfo={profile.referralInfo}
              activeTab={activeReferralTab}
              onTabChange={setActiveReferralTab}
              onReferralCodeCopy={() => {
                setSuccessMessage('Código de referência copiado!')
                setTimeout(() => setSuccessMessage(''), 3000)
              }}
            />

          </div>
        </div>
      </div>
    </div>
  )
}