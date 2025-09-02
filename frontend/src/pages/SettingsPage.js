import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle2, 
  Lock, 
  Bell, 
  Camera, 
  Edit2, 
  CheckCircle,
  X,
  Check,
  Loader
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';
import { uploadImage, compressImage } from '../utils/supabaseStorage';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentBackground, changeBackground, availableBackgrounds } = useBackground();
  const { user, profile, updateProfile, updateAvatar, refreshProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form data using real profile data
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    email: ''
  });
  const [originalData, setOriginalData] = useState({});
  
  const [currentEditingField, setCurrentEditingField] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [modals, setModals] = useState({
    changeEmail: false,
    changePassword: false,
    setup2FA: false,
    deleteAccount: false
  });
  
  // Form states for modals
  const [emailForm, setEmailForm] = useState({ currentPassword: '', newEmail: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [twoFAForm, setTwoFAForm] = useState({ password: '' });
  const [deleteForm, setDeleteForm] = useState({ confirmation: '' });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: false,
    push: true,
    weekly: true,
    marketing: false
  });
  
  const fileInputRef = useRef(null);

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      const profileFormData = {
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        email: profile.email || user?.email || ''
      };
      setFormData(profileFormData);
      setOriginalData(profileFormData);
      
      // Load notification preferences from profile
      if (profile.preferences?.notifications) {
        setNotifications(prev => ({ ...prev, ...profile.preferences.notifications }));
      }
    }
  }, [profile, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Show loading state
  if (authLoading || !user || !profile) {
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
        <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }
  const indicatorRef = useRef(null);

  const themes = [
    { id: 'default', value: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
    { id: 'theme-2', value: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
    { id: 'theme-3', value: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
    { id: 'theme-4', value: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
    { id: 'theme-5', value: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
    { id: 'theme-6', value: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
    { id: 'theme-7', value: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
    { id: 'theme-8', value: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
    { id: 'theme-9', value: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
    { id: 'theme-10', value: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
    { id: 'theme-11', value: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
    { id: 'theme-12', value: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' }
  ];

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: UserCircle2 },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  // Initialize tab indicator position
  useEffect(() => {
    updateTabIndicator(activeTab);
  }, [activeTab]);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const updateTabIndicator = (tabId) => {
    const activeTabElement = document.querySelector(`[data-tab="${tabId}"]`);
    const indicator = indicatorRef.current;
    
    if (activeTabElement && indicator) {
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = activeTabElement.parentElement.getBoundingClientRect();
      const position = tabRect.left - containerRect.left;
      const width = tabRect.width;
      
      indicator.style.transform = `translateX(${position}px)`;
      indicator.style.width = `${width}px`;
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    updateTabIndicator(tabId);
  };

  const handleThemeChange = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      changeBackground(themeId);
      showToastMessage('Ambiente atualizado.');
    }
  };

  const handleAvatarClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Compress image before upload
      const compressedFile = await compressImage(file, 400, 0.8);
      
      // Upload to Supabase Storage
      const { data: avatarUrl, error: uploadError } = await uploadImage(
        compressedFile, 
        'avatars', 
        user.id
      );

      if (uploadError) {
        throw uploadError;
      }

      // Update profile with new avatar URL
      const { error: updateError } = await updateAvatar(avatarUrl);
      
      if (updateError) {
        throw updateError;
      }

      showToastMessage('Foto de perfil atualizada com sucesso!', 'success');

    } catch (error) {
      console.error('Avatar upload error:', error);
      showToastMessage('Erro ao atualizar avatar. Tente novamente.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (field) => {
    setCurrentEditingField(field);
  };

  const saveField = async (field, value) => {
    if (!value || value === originalData[field]) {
      setCurrentEditingField(null);
      return;
    }

    setSaving(true);
    
    try {
      const updates = { [field]: value };
      const { error } = await updateProfile(updates);
      
      if (error) {
        throw error;
      }

      // Update form data
      setFormData(prev => ({ ...prev, [field]: value }));
      setOriginalData(prev => ({ ...prev, [field]: value }));
      
      const fieldNames = {
        display_name: 'Nome',
        bio: 'Biografia'
      };
      showToastMessage(`${fieldNames[field]} atualizado com sucesso!`, 'success');
      
    } catch (error) {
      console.error('Profile update error:', error);
      showToastMessage('Erro ao atualizar perfil. Tente novamente.', 'error');
    } finally {
      setSaving(false);
      setCurrentEditingField(null);
    }
  };

  const handleNotificationToggle = async (type) => {
    const newNotifications = { ...notifications, [type]: !notifications[type] };
    setNotifications(newNotifications);
    
    try {
      // Save notification preferences to profile
      const preferences = {
        ...profile.preferences,
        notifications: newNotifications
      };
      
      const { error } = await updateProfile({ preferences });
      
      if (error) {
        throw error;
      }
      
      showToastMessage('Preferência de notificação atualizada!', 'success');
      
    } catch (error) {
      console.error('Notification update error:', error);
      showToastMessage('Erro ao atualizar preferências.', 'error');
      // Revert change
      setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
    }
  };

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    // Reset form data
    setEmailForm({ currentPassword: '', newEmail: '' });
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTwoFAForm({ password: '' });
    setDeleteForm({ confirmation: '' });
  };



  const isEmailFormValid = () => {
    return emailForm.currentPassword.length > 0 && 
           emailForm.newEmail.includes('@') && 
           emailForm.newEmail.length > 5;
  };

  const isPasswordFormValid = () => {
    return passwordForm.current.length > 0 && 
           passwordForm.new.length >= 6 && 
           passwordForm.new === passwordForm.confirm;
  };

  const is2FAFormValid = () => {
    return twoFAForm.password.length > 0;
  };

  const isDeleteFormValid = () => {
    return deleteForm.confirmation === 'EXCLUIR';
  };

  const handleSaveEmail = () => {
    closeModal('changeEmail');
    showToastMessage('Email alterado com sucesso.');
  };

  const handleSavePassword = () => {
    closeModal('changePassword');
    showToastMessage('Sua senha foi alterada com sucesso.');
  };

  const handleSetup2FA = () => {
    closeModal('setup2FA');
    showToastMessage('Autenticação de dois fatores configurada.');
  };

  const handleDeleteAccount = () => {
    closeModal('deleteAccount');
    showToastMessage('Conta excluída permanentemente.');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <section className="settings-panel is-active animate-fade-in">
            <div className="liquid-glass p-8 md:p-10">
              <div className="grid grid-cols-1 gap-y-10">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <label className="group relative flex-shrink-0 cursor-pointer">
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleAvatarChange}
                    />
                    <img 
                      src={profile?.avatar_url || '/default-avatar.png'} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full object-cover transition-all duration-300 ring-1 ring-white/10 group-hover:ring-white/20"
                    />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                      <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </label>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sua Foto de Perfil</h3>
                    <p className="text-sm text-white/70">Clique na imagem para alterar.</p>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-6">
                  {['name', 'username', 'bio'].map((field) => (
                    <ProfileField
                      key={field}
                      field={field}
                      value={formData[field]}
                      isEditing={currentEditingField === field}
                      onStartEdit={() => startEditing(field)}
                      onSave={(value) => saveField(field, value)}
                      onCancel={() => setCurrentEditingField(null)}
                    />
                  ))}
                </div>

                {/* Theme Selection */}
                <div className="border-t border-white/10 pt-10">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white font-['Geist']">Ambiente do Estúdio</h3>
                    <p className="mt-1 text-sm text-white/70">Escolha o gradiente que define seu espaço de trabalho.</p>
                  </div>

                  <div className="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible mt-4 py-4">
                    <div className="flex items-center gap-4 py-4 lg:grid lg:grid-cols-6 lg:gap-x-4 lg:gap-y-6 lg:p-0">
                      {themes.map((theme) => (
                        <ThemeSphere
                          key={theme.id}
                          theme={theme}
                          isSelected={currentBackground.id === theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'security':
        return (
          <section className="settings-panel is-active">
            <div className="liquid-glass p-8 md:p-10">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white font-['Geist']">Segurança da Conta</h3>
                <div className="space-y-4">
                  <SecurityField
                    label="Email"
                    value={profileData.email}
                    onAction={() => openModal('changeEmail')}
                    actionLabel="Alterar"
                  />
                  
                  <SecurityField
                    label="Senha"
                    value="••••••••"
                    onAction={() => openModal('changePassword')}
                    actionLabel="Alterar"
                  />
                  
                  <SecurityField
                    label="Autenticação de Dois Fatores"
                    value="Adicione uma camada extra de segurança"
                    onAction={() => openModal('setup2FA')}
                    actionLabel="Configurar"
                    isDescription
                  />
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="danger-zone p-6 rounded-lg border border-red-500/40 bg-red-500/5">
                    <h4 className="text-white font-semibold mb-2">Zona Perigosa</h4>
                    <p className="text-white/70 text-sm mb-4">Essas ações são irreversíveis. Proceda com cuidado.</p>
                    <button 
                      onClick={() => openModal('deleteAccount')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Excluir Conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'notifications':
        return (
          <section className="settings-panel is-active">
            <div className="liquid-glass p-8 md:p-10">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white font-['Geist']">Preferências de Notificação</h3>
                <div className="space-y-6">
                  <NotificationToggle
                    title="Notificações por email"
                    description="Receba atualizações importantes por email"
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle('email')}
                  />
                  
                  <NotificationToggle
                    title="Notificações push"
                    description="Receba notificações no navegador"
                    checked={notifications.push}
                    onChange={() => handleNotificationToggle('push')}
                  />
                  
                  <NotificationToggle
                    title="Relatórios semanais"
                    description="Receba um resumo semanal da sua atividade"
                    checked={notifications.weekly}
                    onChange={() => handleNotificationToggle('weekly')}
                  />
                  
                  <NotificationToggle
                    title="Marketing"
                    description="Receba dicas e ofertas especiais"
                    checked={notifications.marketing}
                    onChange={() => handleNotificationToggle('marketing')}
                  />
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-950 text-white overflow-x-hidden antialiased selection:bg-white/10 selection:text-white"
      style={{
        backgroundImage: `url("${currentBackground.value}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }} />

      <main className="w-full mx-auto pb-32 relative z-10">
        <div className="max-w-4xl relative mr-auto ml-auto px-4">
          <header className="mb-10 mt-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-semibold text-white tracking-tight font-['Geist']">Configurações</h2>
            <p className="text-white/70 mt-2">Gerencie seu perfil, conta e preferências.</p>
          </header>

          <div className="w-full overflow-x-auto hide-scrollbar mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="settings-tabs-list relative inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
              <div 
                ref={indicatorRef}
                className="absolute z-1 top-1 left-0 h-[calc(100%-8px)] rounded-lg bg-white/10 transition-all duration-300 ease-in-out"
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`settings-tab-trigger relative z-2 border-none bg-none px-5 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id ? 'is-active text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" strokeWidth={1.5} />
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={modals.changeEmail}
        onClose={() => closeModal('changeEmail')}
        title="Alterar seu Email"
        description="Digite sua senha atual e o novo email para confirmar a alteração."
      >
        <input
          type="password"
          placeholder="Senha atual"
          value={emailForm.currentPassword}
          onChange={(e) => setEmailForm(prev => ({ ...prev, currentPassword: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <input
          type="email"
          placeholder="Novo email"
          value={emailForm.newEmail}
          onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleSaveEmail}
          disabled={!isEmailFormValid()}
          className="btn-primary w-full bg-white text-black border-none rounded-lg p-3 font-semibold cursor-pointer transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
        >
          Salvar Novo Email
        </button>
        <button
          onClick={() => closeModal('changeEmail')}
          className="btn-secondary w-full bg-none border-none text-white/70 p-2 cursor-pointer underline text-sm transition-all hover:text-white"
        >
          Cancelar
        </button>
      </Modal>

      <Modal
        isOpen={modals.changePassword}
        onClose={() => closeModal('changePassword')}
        title="Alterar sua Senha"
        description="Digite sua senha atual e escolha uma nova senha segura."
      >
        <input
          type="password"
          placeholder="Senha atual"
          value={passwordForm.current}
          onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={passwordForm.new}
          onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={passwordForm.confirm}
          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleSavePassword}
          disabled={!isPasswordFormValid()}
          className="btn-primary w-full bg-white text-black border-none rounded-lg p-3 font-semibold cursor-pointer transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
        >
          Salvar Nova Senha
        </button>
        <button
          onClick={() => closeModal('changePassword')}
          className="btn-secondary w-full bg-none border-none text-white/70 p-2 cursor-pointer underline text-sm transition-all hover:text-white"
        >
          Cancelar
        </button>
      </Modal>

      <Modal
        isOpen={modals.setup2FA}
        onClose={() => closeModal('setup2FA')}
        title="Configurar Autenticação de Dois Fatores"
        description="Configure 2FA para adicionar uma camada extra de segurança à sua conta."
      >
        <input
          type="password"
          placeholder="Digite sua senha atual"
          value={twoFAForm.password}
          onChange={(e) => setTwoFAForm(prev => ({ ...prev, password: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleSetup2FA}
          disabled={!is2FAFormValid()}
          className="btn-primary w-full bg-white text-black border-none rounded-lg p-3 font-semibold cursor-pointer transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
        >
          Configurar 2FA
        </button>
        <button
          onClick={() => closeModal('setup2FA')}
          className="btn-secondary w-full bg-none border-none text-white/70 p-2 cursor-pointer underline text-sm transition-all hover:text-white"
        >
          Cancelar
        </button>
      </Modal>

      <Modal
        isOpen={modals.deleteAccount}
        onClose={() => closeModal('deleteAccount')}
        title="Você tem certeza absoluta?"
        description="Esta ação é irreversível. Todos os seus dados, projetos e trilhas serão permanentemente apagados. Não há como voltar atrás."
      >
        <input
          type="text"
          placeholder="Digite 'EXCLUIR' para confirmar"
          value={deleteForm.confirmation}
          onChange={(e) => setDeleteForm(prev => ({ ...prev, confirmation: e.target.value }))}
          className="modal-input w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white text-sm mb-4 placeholder-white/50 focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleDeleteAccount}
          disabled={!isDeleteFormValid()}
          className="btn-danger w-full bg-red-600 text-white border-none rounded-lg p-3 font-semibold cursor-pointer transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
        >
          Sim, excluir minha conta permanentemente
        </button>
        <button
          onClick={() => closeModal('deleteAccount')}
          className="btn-secondary w-full bg-none border-none text-white/70 p-2 cursor-pointer underline text-sm transition-all hover:text-white"
        >
          Cancelar
        </button>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-200 transition-all duration-500 backdrop-blur-16 bg-gray-800/85 border border-white/15 shadow-lg rounded-xl p-3 text-white flex items-center gap-4">
          <CheckCircle className={`w-5 h-5 ${toastType === 'success' ? 'text-green-400' : 'text-blue-400'}`} strokeWidth={1.5} />
          <span>{toastMessage}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar { 
          display: none; 
        }
        
        .hide-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        
        .liquid-glass { 
          backdrop-filter: blur(20px); 
          background-color: rgba(255, 255, 255, 0.08); 
          border: 1px solid rgba(255, 255, 255, 0.14); 
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28); 
          border-radius: 20px; 
        }
        
        .settings-tabs-list { 
          position: relative; 
          display: inline-flex; 
          padding: 4px; 
          border-radius: 12px; 
          background-color: rgba(255, 255, 255, 0.05); 
          border: 1px solid rgba(255, 255, 255, 0.1); 
        }
      `}</style>
    </div>
  );
};

// Profile Field Component
const ProfileField = ({ field, value, isEditing, onStartEdit, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);
  const fieldRef = useRef(null);

  useEffect(() => {
    if (isEditing && fieldRef.current) {
      fieldRef.current.focus();
      fieldRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(value);
      onCancel();
    }
  };

  const fieldLabels = {
    name: 'Nome',
    username: 'Nome de Usuário',
    bio: 'Bio'
  };

  return (
    <div className="profile-field p-3 rounded-lg transition-all cursor-pointer min-h-[60px] flex flex-col justify-center hover:bg-white/4">
      <label className="block text-sm font-medium text-white/70 mb-2">{fieldLabels[field]}</label>
      <div className="profile-text relative flex justify-between items-center w-full">
        <div className="profile-field-content relative flex-1 cursor-pointer p-1">
          {isEditing ? (
            <input
              ref={fieldRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="profile-field-text w-full bg-transparent text-white text-base leading-6 outline-none border-b-2 border-white pb-1"
            />
          ) : (
            <div 
              onClick={onStartEdit}
              className="profile-field-text text-white text-base leading-6 transition-all cursor-pointer"
            >
              {value}
            </div>
          )}
        </div>
        {!isEditing && (
          <Edit2 
            onClick={onStartEdit}
            className="edit-icon w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
            strokeWidth={1.5}
          />
        )}
      </div>
    </div>
  );
};

// Security Field Component
const SecurityField = ({ label, value, onAction, actionLabel, isDescription = false }) => {
  return (
    <div className="security-field p-4 rounded-lg transition-all flex justify-between items-center flex-wrap gap-2 hover:bg-white/5">
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-white/70 mb-1">{label}</label>
        <span className={`text-white ${isDescription ? 'text-white/80 text-sm' : 'break-all'}`}>
          {value}
        </span>
      </div>
      <button
        onClick={onAction}
        className="change-btn bg-none border border-white/20 text-white/80 px-4 py-1.5 rounded-md text-sm cursor-pointer transition-all flex-shrink-0 hover:bg-white/10 hover:text-white"
      >
        {actionLabel}
      </button>
    </div>
  );
};

// Notification Toggle Component
const NotificationToggle = ({ title, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between info-group p-4 rounded-lg transition-all hover:bg-white/5">
      <div className="flex-1 mr-4">
        <p className="text-white font-medium">{title}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <div 
        onClick={onChange}
        className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-all flex-shrink-0 ${
          checked ? 'bg-white' : 'bg-white/20 hover:bg-white/30'
        }`}
      >
        <div 
          className={`w-4 h-4 rounded-full transition-transform ${
            checked ? 'bg-gray-900 transform translate-x-5' : 'bg-white'
          }`}
        />
      </div>
    </div>
  );
};

// Theme Sphere Component
const ThemeSphere = ({ theme, isSelected, onClick }) => {
  return (
    <div className="flex-shrink-0 snap-center lg:flex lg:justify-center">
      <button
        onClick={onClick}
        className={`theme-sphere relative w-20 h-20 rounded-full cursor-pointer border-2 overflow-hidden transition-all duration-300 hover:scale-110 ${
          isSelected ? 'border-white scale-110' : 'border-transparent'
        }`}
        style={{
          backgroundImage: `url(${theme.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {isSelected && (
          <div className="check-icon absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-all duration-300">
            <Check className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        )}
      </button>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, description, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-8 z-100 flex items-center justify-center p-4 transition-all duration-300">
      <div className="modal bg-white/8 backdrop-blur-20 border border-white/14 rounded-2xl p-8 max-w-md w-full transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 font-['Geist']">{title}</h3>
            <p className="text-white/70 text-sm mb-6">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SettingsPage;