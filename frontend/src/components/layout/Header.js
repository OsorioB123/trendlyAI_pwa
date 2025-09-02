import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  ChevronLeft, 
  Menu, 
  Info, 
  Gem, 
  Settings, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';
import { HeaderVariant, User } from '../../types/header';
import { useAuth } from '../../contexts/AuthContext';
import PaywallModal from '../modals/PaywallModal';
import '../styles/header.css';

const Header = ({ variant = HeaderVariant.PRIMARY, onMenuToggle, showMobileSidebar = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreditsTooltip, setShowCreditsTooltip] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const creditsRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: 'Nova trilha de Storytelling disponível!',
      time: 'há 5 min'
    },
    {
      id: 2,
      message: 'Seu projeto "Roteiro para Reels" foi salvo.',
      time: 'há 2 horas'
    }
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Close profile dropdown
      setShowProfile(false);
      
      // Sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Even if there's an error, we'll still redirect to login
      }
      
      // Navigate to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on error
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowProfile(false);
    setShowCreditsTooltip(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !notificationsRef.current?.contains(event.target) &&
        !profileRef.current?.contains(event.target) &&
        !creditsRef.current?.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderLeftSection = () => {
    switch (variant) {
      case HeaderVariant.PRIMARY:
        return (
          <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
              alt="TrendlyAI Logo" 
              className="h-8 w-auto object-cover"
            />
          </button>
        );

      case HeaderVariant.SECONDARY:
        return (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
                alt="TrendlyAI Logo" 
                className="h-8 w-auto object-cover"
              />
            </button>
          </div>
        );

      case HeaderVariant.CHAT:
        return (
          <div className="flex items-center gap-4">
            {/* Desktop: Back button, Mobile: Menu button */}
            <button 
              onClick={variant === HeaderVariant.CHAT && window.innerWidth < 768 ? onMenuToggle : handleBack}
              className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:flex"
              style={{ display: variant === HeaderVariant.CHAT && window.innerWidth < 768 ? 'flex' : 'none' }}
            >
              <Menu className="w-5 h-5 md:hidden" />
              <ChevronLeft className="w-6 h-6 hidden md:block" />
            </button>
            
            {/* Mobile menu button for chat */}
            <button 
              onClick={onMenuToggle}
              className="w-11 h-11 flex md:hidden items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <button onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
                alt="TrendlyAI Logo" 
                className="h-8 w-auto object-cover"
              />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 pt-3 pr-4 pb-3 pl-4 header-fade">
        <div className="max-w-7xl flex sticky top-0 z-40 mr-auto ml-auto items-center justify-between liquid-glass-header rounded-full px-5 py-3">
          
          {/* Left Section */}
          {renderLeftSection()}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  closeAllMenus();
                  setShowNotifications(!showNotifications);
                }}
                className="relative w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="notification-dot absolute inline-flex h-full w-full rounded-full bg-[#2fd159] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2fd159]"></span>
                </span>
              </button>

              {showNotifications && (
                <div className="dropdown-menu show liquid-glass-opaque absolute top-full right-0 mt-2 p-2 w-80 z-50">
                  <div className="p-2 flex justify-between items-center">
                    <h4 className="text-white font-semibold text-sm">Notificações</h4>
                    <button className="text-xs text-white/60 hover:text-white transition-colors">
                      Marcar como lidas
                    </button>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <button 
                        key={notification.id}
                        className="notification-item block p-3 rounded-lg w-full text-left"
                      >
                        <p className="text-sm text-white">{notification.message}</p>
                        <span className="text-xs text-white/60">{notification.time}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button className="block text-center text-xs text-white/70 hover:text-white transition-colors p-2 w-full">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => {
                  closeAllMenus();
                  setShowProfile(!showProfile);
                }}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all ring-2 ring-transparent hover:ring-white/30 liquid-glass-pill"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img 
                    src={User.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {showProfile && (
                <div className="dropdown-menu show liquid-glass-opaque absolute top-full right-0 mt-2 p-4 w-72 z-50">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={profile?.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80'} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">{profile?.display_name || 'Usuário'}</h5>
                      <p className="text-sm text-white/70 flex items-center gap-1.5">
                        ✨ <span>{profile?.level || 'Explorador'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Profile Button */}
                  <button 
                    onClick={() => navigate('/profile')}
                    className="block text-center w-full px-4 py-2.5 mb-5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 liquid-glass-pill"
                  >
                    Meu Perfil
                  </button>

                  {/* Credits Section */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <h6 className="text-xs font-medium text-white/80">Créditos Mensais da Salina</h6>
                      <div className="relative" ref={creditsRef}>
                        <button 
                          onClick={() => {
                            setShowCreditsTooltip(!showCreditsTooltip);
                          }}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {showCreditsTooltip && (
                          <div className="credit-tooltip show liquid-glass absolute bottom-full right-0 mb-2 p-3 w-64">
                            <p className="text-xs text-white/90">
                              Seus créditos são usados para conversas com a Salina e se renovam a cada 24h. Precisa de mais?{' '}
                              <button 
                                onClick={() => setShowPaywall(true)}
                                className="font-semibold text-[#2fd159] hover:underline"
                              >
                                Torne-se um Maestro
                              </button>{' '}
                              para ter acesso ilimitado.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="credits-progress-bar w-full h-3">
                        <div 
                          className="credits-progress-fill" 
                          style={{ width: `${profile?.credits && profile?.max_credits ? (profile.credits / profile.max_credits * 100) : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-right text-white/60 mt-1">
                        {profile?.credits || 0}/{profile?.max_credits || 50}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1 border-t border-white/10 pt-3 mt-4">
                    <button 
                      onClick={() => navigate('/subscription')}
                      className="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left"
                    >
                      <Gem className="w-4 h-4 text-white/70" />
                      <span>Gerenciar Assinatura</span>
                    </button>
                    <button 
                      onClick={() => navigate('/settings')}
                      className="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left"
                    >
                      <Settings className="w-4 h-4 text-white/70" />
                      <span>Configurações da Conta</span>
                    </button>
                    <button 
                      onClick={() => navigate('/help')}
                      className="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-white/70" />
                      <span>Central de Ajuda</span>
                    </button>
                    
                    <div className="border-t border-white/10 my-2" />
                    
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="menu-item flex items-center gap-3 p-2.5 text-red-400 hover:text-red-300 text-sm rounded-lg w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span>{isLoggingOut ? 'Saindo...' : 'Sair da Conta'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Paywall Modal */}
      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </>
  );
};

export default Header;