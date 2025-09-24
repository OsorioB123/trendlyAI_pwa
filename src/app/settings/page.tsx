'use client'

import { useRouter } from 'next/navigation'
import { useSettings } from '../../hooks/useSettings'
import { useBackground } from '../../contexts/BackgroundContext'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'
import SettingsTabs from '../../components/settings/SettingsTabs'
import { ToastContainer } from '../../components/settings/ToastNotification'
import ProfileTab from '../../components/settings/ProfileTab'
import SecurityTab from '../../components/settings/SecurityTab'
import NotificationsTab from '../../components/settings/NotificationsTab'
import Header from '../../components/layout/Header'


export default function SettingsPage() {
  const router = useRouter()
  const settings = useSettings()
  const { currentBackground } = useBackground()

  if (settings.isLoading) {
    return (
      <div
        className="min-h-screen text-white"
        style={{
          backgroundImage: `url("${currentBackground.value}?w=1600&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <BackgroundOverlay />
        <Header />
        <main className="max-w-4xl mx-auto px-4 pb-24 pt-20 sm:pt-24">
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
      <div
        className="min-h-screen text-white"
        style={{
          backgroundImage: `url("${currentBackground.value}?w=1600&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <BackgroundOverlay />
        <Header />
        <div className="flex min-h-screen items-center justify-center px-4 pt-24">
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
      </div>
    )
  }

  const renderTabContent = () => {
    switch (settings.uiState.activeTab) {
      case 'profile':
        return (
          <ProfileTab
            profile={settings.profile as any}
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
            security={settings.security as any}
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
            preferences={settings.notifications as any}
            onUpdatePreferences={settings.updateNotifications}
            isLoading={settings.isLoading}
          />
        )
      default:
        return (
          <ProfileTab
            profile={settings.profile as any}
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
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=1600&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <BackgroundOverlay />
      <Header />

      <main className="w-full mx-auto pb-24 pt-20 sm:pt-24">
        <div className="max-w-4xl relative mx-auto px-4">
          {/* Header */}
          <header
            className="mb-10 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <h2 className="text-3xl font-semibold tracking-tight font-geist">Configurações</h2>
            <p className="text-white/70 mt-2">Gerencie seu perfil, conta e preferências.</p>
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
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={settings.toasts} onClose={settings.dismissToast} />
    </div>
  )
}


