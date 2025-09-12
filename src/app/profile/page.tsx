// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'

'use client'

import dynamic from 'next/dynamic'
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

export default function ProfilePage() {
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

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleTrackClick = (track: any) => {
    console.log('Track clicked:', track)
    router.push(`/tracks/${track.id}`)
  }

  const handleToolClick = (tool: any) => {
    console.log('Tool clicked:', tool)
    router.push(`/tools/${tool.id}`)
  }

  const handleNavigateToTools = () => {
    router.push('/tools')
  }

  const handleNavigateToAffiliate = () => {
    // In production, this would navigate to affiliate dashboard
    console.log('Navigate to affiliate dashboard')
  }

  const handleCopyReferralLink = () => {
    setSuccessMessage('Link de indicação copiado!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleNextActionClick = () => {
    if (profile.nextAction?.action_url) {
      router.push(profile.nextAction.action_url)
    }
  }

  const handleSaveField = async (field: string, value: string): Promise<boolean> => {
    const success = await profile.saveField(field, value)
    if (success) {
      setSuccessMessage('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    return success
  }

  const handleAvatarUpload = async (file: File): Promise<boolean> => {
    const success = await profile.uploadAvatar(file)
    if (success) {
      setSuccessMessage('Avatar atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
    return success
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${CURRENT_BACKGROUND.value}?w=800&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }}></div>

      <main className="w-full mx-auto">
        <div className="max-w-6xl relative mx-auto px-6 py-10">

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {errorMessage}
            </div>
          )}

          {/* Profile Header */}
          <ProfileHeader
            profile={profile.profile}
            isEditing={!!profile.editingField}
            editingField={profile.editingField}
            onEditField={profile.setEditingField}
            onSaveField={handleSaveField}
            onAvatarUpload={handleAvatarUpload}
            isUploading={profile.isUploading}
            isSaving={profile.isSaving}
          />

          {/* Next Action */}
          {profile.nextAction && (
            <NextActionCard
              recommendation={profile.nextAction}
              onActionClick={handleNextActionClick}
            />
          )}

          {/* Arsenal */}
          <ArsenalSection
            arsenalData={profile.arsenalData}
            activeTab={activeArsenalTab}
            onTabChange={setActiveArsenalTab}
            onTrackClick={handleTrackClick}
            onToolClick={handleToolClick}
            onNavigateToTools={handleNavigateToTools}
          />

          {/* Referral Section */}
          {profile.referralInfo && (
            <ReferralSection
              referralInfo={profile.referralInfo}
              activeTab={activeReferralTab}
              onTabChange={setActiveReferralTab}
              onCopyReferralLink={handleCopyReferralLink}
              onNavigateToAffiliate={handleNavigateToAffiliate}
            />
          )}
        </div>
      </main>

      {/* Global styles */}
      <style jsx>{`
        .animate-entry {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-1 { animation-delay: 0.15s; }
        .animate-entry.delay-2 { animation-delay: 0.3s; }
        .animate-entry.delay-3 { animation-delay: 0.45s; }
        
        @keyframes slideInFade {
          to { opacity: 1; transform: translateY(0); }
        }
        
        .avatar-interactive-wrapper {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .avatar-interactive-wrapper:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}