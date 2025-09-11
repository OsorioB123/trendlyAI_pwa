'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSettings } from '../../hooks/useSettings'
import SettingsTabs from '../../components/settings/SettingsTabs'
import { ToastContainer } from '../../components/settings/ToastNotification'
import ProfileTab from '../../components/settings/ProfileTab'
import SecurityTab from '../../components/settings/SecurityTab'
import NotificationsTab from '../../components/settings/NotificationsTab'


export default function SettingsPage() {
  const router = useRouter()
  const settings = useSettings()
  const [toasts, setToasts] = useState<any[]>([])

  if (settings.isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="h-20" />
        <main className="max-w-4xl mx-auto px-4 pb-32">
          <div className="mb-10 mt-12">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/10 rounded w-64" />
              <div className="h-4 bg-white/10 rounded w-96" />
            </div>
          </div>
          
          <div className="mb-10">
            <div className="h-12 bg-white/10 rounded-xl w-full max-w-md" />
          </div>

          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </main>
      </div>
    )
  }

  if (settings.error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao Carregar Configurações</h1>
          <p className="text-white/70 mb-6">{settings.error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const renderTabContent = () => {
    switch (settings.uiState.activeTab) {
      case 'profile':
        return (
          <ProfileTab
            profile={settings.profile}
            themes={[]}
            isLoading={settings.isLoading}
            onUpdateProfile={settings.updateProfile}
            onUploadAvatar={settings.uploadAvatar}
            onUpdateTheme={settings.updateStudioTheme}
            editingField={settings.uiState.editingField}
            onEditField={settings.setEditingField}
          />
        )
      case 'security':
        return (
          <SecurityTab
            security={settings.security}
            onChangeEmail={settings.changeEmail}
            onChangePassword={settings.changePassword}
            onSetup2FA={settings.setup2FA}
            onDeleteAccount={settings.deleteAccount}
            activeModal={settings.uiState.activeModal}
            onSetActiveModal={settings.setActiveModal}
          />
        )
      case 'notifications':
        return (
          <NotificationsTab
            notifications={settings.notifications}
            onUpdateNotifications={settings.updateNotifications}
            isLoading={settings.isLoading}
          />
        )
      default:
        return (
          <ProfileTab
            profile={settings.profile}
            themes={[]}
            isLoading={settings.isLoading}
            onUpdateProfile={settings.updateProfile}
            onUploadAvatar={settings.uploadAvatar}
            onUpdateTheme={settings.updateStudioTheme}
            editingField={settings.uiState.editingField}
            onEditField={settings.setEditingField}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Spacer for header */}
      <div className="h-20" />

      <main className="max-w-4xl mx-auto px-4 pb-32">
        {/* Header */}
        <header className="mb-10 mt-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
              <p className="text-white/70 mt-2">Gerencie seu perfil, conta e preferências.</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <SettingsTabs
          activeTab={settings.uiState.activeTab}
          onTabChange={settings.setActiveTab}
        />

        {/* Content */}
        <div className="relative">
          <div
            key={settings.uiState.activeTab}
            className="animate-fade-in"
          >
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

// Global styles
const globalStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }

  .liquid-glass {
    backdrop-filter: blur(20px);
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  }
`