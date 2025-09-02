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
  Check
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentBackground, changeBackground, availableBackgrounds } = useBackground();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Sofia',
    username: '@sofia',
    bio: 'Explorando o futuro da criação de conteúdo com IA.',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80',
    email: 'sofia@example.com'
  });
  
  const [currentEditingField, setCurrentEditingField] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
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

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target.result }));
        showToastMessage('Foto de perfil atualizada.');
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = (field) => {
    setCurrentEditingField(field);
  };

  const saveField = (field, value) => {
    if (field === 'username' && !value.startsWith('@')) {
      value = '@' + value.replace(/@/g, '');
    }
    
    setProfileData(prev => ({ ...prev, [field]: value }));
    setCurrentEditingField(null);
    
    const fieldNames = {
      name: 'Nome',
      username: 'Nome de usuário',
      bio: 'Bio'
    };
    showToastMessage(`${fieldNames[field]} atualizado.`);
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

  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
    showToastMessage('Configuração atualizada.');
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
                      src={profileData.avatar} 
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
                      value={profileData[field]}
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
          <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-8 md:p-10">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Segurança da Conta</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                    <span className="text-white break-all">{profileData.email}</span>
                  </div>
                  <button 
                    onClick={() => openModal('changeEmail')}
                    className="ml-4 px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all"
                  >
                    Alterar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-white/70 mb-1">Senha</label>
                    <span className="text-white">••••••••</span>
                  </div>
                  <button 
                    onClick={() => openModal('changePassword')}
                    className="ml-4 px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all"
                  >
                    Alterar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Autenticação de Dois Fatores
                    </label>
                    <span className="text-white/80 text-sm">
                      Adicione uma camada extra de segurança
                    </span>
                  </div>
                  <button 
                    onClick={() => openModal('setup2FA')}
                    className="ml-4 px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all"
                  >
                    Configurar
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="border border-red-500/40 bg-red-500/5 p-6 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Zona Perigosa</h4>
                  <p className="text-white/70 text-sm mb-4">
                    Essas ações são irreversíveis. Proceda com cuidado.
                  </p>
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
        );

      case 'notifications':
        return (
          <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-8 md:p-10">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Preferências de Notificação</h3>
              <div className="space-y-6">
                {[
                  { 
                    key: 'email', 
                    title: 'Notificações por email', 
                    description: 'Receba atualizações importantes por email' 
                  },
                  { 
                    key: 'push', 
                    title: 'Notificações push', 
                    description: 'Receba notificações no navegador' 
                  },
                  { 
                    key: 'weekly', 
                    title: 'Relatórios semanais', 
                    description: 'Receba um resumo semanal da sua atividade' 
                  },
                  { 
                    key: 'marketing', 
                    title: 'Marketing', 
                    description: 'Receba dicas e ofertas especiais' 
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex-1 mr-4">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-sm text-white/70">{item.description}</p>
                    </div>
                    <div 
                      className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                        notifications[item.key] ? 'bg-white' : 'bg-white/20 hover:bg-white/30'
                      }`}
                      onClick={() => handleNotificationToggle(item.key)}
                    >
                      <div 
                        className={`w-4 h-4 rounded-full transition-all ${
                          notifications[item.key] 
                            ? 'bg-gray-900 transform translate-x-5' 
                            : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      id="settings-container"
      className="min-h-screen text-white font-['Inter'] antialiased selection:bg-white/20 relative"
      style={{
        backgroundImage: `url("${currentBackground.value}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay with higher opacity */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }}></div>

      <main className="w-full mx-auto pb-32">
        <div id="settings-container" className="max-w-4xl relative mr-auto ml-auto px-4">
          <header className="mb-10 mt-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-semibold text-white tracking-tight">Configurações</h2>
            <p className="text-white/70 mt-2">Gerencie seu perfil, conta e preferências.</p>
          </header>

          {/* Tabs */}
          <div className="w-full overflow-x-auto mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="settings-tabs-list">
              <div id="active-tab-indicator" />
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`settings-tab-trigger ${
                      activeTab === tab.id ? 'is-active' : ''
                    } hover:text-white`}
                    data-tab={tab.id}
                  >
                    <Icon className="w-4 h-4" style={{ strokeWidth: 1.5 }} />
                    <span className="tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="relative space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Modals */}
      {Object.entries(modals).map(([key, isOpen]) => {
        if (!isOpen) return null;
        
        const modalContent = {
          changeEmail: {
            title: 'Alterar seu Email',
            description: 'Digite sua senha atual e o novo email para confirmar a alteração.',
            action: () => { closeModal('changeEmail'); showToastMessage('Email alterado com sucesso.'); }
          },
          changePassword: {
            title: 'Alterar sua Senha',
            description: 'Digite sua senha atual e escolha uma nova senha segura.',
            action: () => { closeModal('changePassword'); showToastMessage('Sua senha foi alterada com sucesso.'); }
          },
          setup2FA: {
            title: 'Configurar Autenticação de Dois Fatores',
            description: 'Configure 2FA para adicionar uma camada extra de segurança à sua conta.',
            action: () => { closeModal('setup2FA'); showToastMessage('Autenticação de dois fatores configurada.'); }
          },
          deleteAccount: {
            title: 'Você tem certeza absoluta?',
            description: 'Esta ação é irreversível. Todos os seus dados, projetos e trilhas serão permanentemente apagados. Não há como voltar atrás.',
            action: () => { closeModal('deleteAccount'); showToastMessage('Conta excluída permanentemente.'); }
          }
        };

        const content = modalContent[key];
        
        return (
          <div key={key} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-2">{content.title}</h3>
              <p className="text-white/70 text-sm mb-6">{content.description}</p>
              
              <div className="space-y-4 mb-6">
                <input 
                  type={key === 'changeEmail' ? 'email' : 'password'} 
                  className="w-full bg-white/8 border border-white/14 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" 
                  placeholder={key === 'deleteAccount' ? "Digite 'EXCLUIR' para confirmar" : "Digite aqui..."}
                />
              </div>

              <button 
                onClick={content.action}
                className={`w-full py-3 px-6 rounded-lg font-semibold mb-3 transition-all ${
                  key === 'deleteAccount' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {key === 'deleteAccount' ? 'Sim, excluir minha conta permanentemente' : 'Confirmar'}
              </button>
              <button 
                onClick={() => closeModal(key)}
                className="w-full text-white/70 hover:text-white text-sm underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        );
      })}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/8 backdrop-blur-lg border border-white/15 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-white">{toastMessage}</span>
        </div>
      )}

      <style jsx>{`
        .settings-tabs-list {
          display: flex;
          position: relative;
          padding: 4px;
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 12px;
          backdrop-filter: blur(20px);
          width: fit-content;
          margin: 0 auto;
        }

        #active-tab-indicator {
          position: absolute;
          top: 4px;
          left: 4px;
          height: calc(100% - 8px);
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: calc(${100/tabs.length}% - 4px);
          transform: translateX(${tabs.findIndex(tab => tab.id === activeTab) * 100}%);
        }

        .settings-tab-trigger {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-weight: 500;
          transition: color 0.2s ease;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .settings-tab-trigger.is-active {
          color: white;
        }

        .tab-label {
          display: none;
        }

        @media (min-width: 640px) {
          .tab-label {
            display: inline;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;