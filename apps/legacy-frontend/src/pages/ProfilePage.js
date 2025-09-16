import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Navigation, 
  Award, 
  Flame, 
  Lightbulb, 
  Play, 
  Wrench, 
  Compass, 
  Gift, 
  DollarSign, 
  Copy, 
  ArrowRight,
  ChevronDown,
  Edit2,
  Loader,
  Check,
  X
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header'; 
import { HeaderVariant, User } from '../types/header';
import TrackCard from '../components/cards/TrackCard';
import { uploadImage, compressImage } from '../utils/supabaseStorage';

// Mock data for user tracks
const USER_TRACKS = [
  {
    id: 1,
    title: 'IA Generativa Avançada',
    progress: 70,
    backgroundImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
  },
  {
    id: 2,
    title: 'Design para Criadores',
    progress: 35,
    backgroundImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80'
  },
  {
    id: 3,
    title: 'Marketing Digital',
    progress: 90,
    backgroundImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  }
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const { user, profile, updateProfile, updateAvatar, refreshProfile, loading: authLoading } = useAuth();
  const [activeArsenalTab, setActiveArsenalTab] = useState('trails');
  const [activeReferralTab, setActiveReferralTab] = useState('credits');
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    level: 'Explorador'
  });
  const [originalData, setOriginalData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      const profileData = {
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        level: profile.level || 'Explorador'
      };
      setFormData(profileData);
      setOriginalData(profileData);
    }
  }, [profile]);

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
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const handleTrackClick = (track) => {
    console.log('Track clicked:', track);
    navigate(`/track/${track.id}`);
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
    setError('');
    setSuccess('');

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

      setSuccess('Avatar atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Avatar upload error:', error);
      setError('Erro ao atualizar avatar. Tente novamente.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleFieldEdit = (field) => {
    setEditingField(field);
    setOriginalData({ ...formData });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveField = async (field) => {
    if (formData[field] === originalData[field]) {
      setEditingField(null);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updates = { [field]: formData[field] };
      const { error } = await updateProfile(updates);
      
      if (error) {
        throw error;
      }

      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingField(null);

    } catch (error) {
      console.error('Profile update error:', error);
      setError('Erro ao atualizar perfil. Tente novamente.');
      setTimeout(() => setError(''), 5000);
      
      // Revert changes
      setFormData(prev => ({ ...prev, [field]: originalData[field] }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = (field) => {
    setFormData(prev => ({ ...prev, [field]: originalData[field] }));
    setEditingField(null);
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveField(field);
    } else if (e.key === 'Escape') {
      handleCancelEdit(field);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
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
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Header Unificado */}
          <section className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left mb-16 animate-entry">
            <button 
              className="relative flex-shrink-0 group avatar-interactive-wrapper"
              onClick={handleAvatarClick}
              disabled={uploading}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
                <img 
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80'} 
                  alt="Avatar do usuário" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center avatar-overlay bg-black/0 hover:bg-black/60 transition-all duration-300">
                {uploading ? (
                  <Loader className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                className="hidden"
              />
            </button>
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
                      disabled={saving}
                    />
                    <button
                      onClick={() => handleSaveField('display_name')}
                      disabled={saving}
                      className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                      {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCancelEdit('display_name')}
                      disabled={saving}
                      className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="text-5xl font-medium text-white tracking-tight">
                      {formData.display_name || 'Usuário'}
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
              
              <p className="text-white/60 text-lg mb-6">Nível Criativo: {formData.level}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleSaveField('bio');
                        } else if (e.key === 'Escape') {
                          handleCancelEdit('bio');
                        }
                      }}
                      placeholder="Conte um pouco sobre você..."
                      className="w-full p-3 text-white/80 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 resize-none"
                      rows="3"
                      disabled={saving}
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveField('bio')}
                        disabled={saving}
                        className="px-3 py-1 text-green-400 hover:text-green-300 disabled:opacity-50 text-sm flex items-center gap-1"
                      >
                        {saving ? <Loader className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Salvar
                      </button>
                      <button
                        onClick={() => handleCancelEdit('bio')}
                        disabled={saving}
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
                        {formData.bio || 'Adicione uma biografia para contar mais sobre você...'}
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
          </section>

          {/* Próxima Ação */}
          <section className="mb-16 animate-entry delay-1">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"></div>
              <div className="relative bg-white/8 backdrop-blur-lg border border-white/12 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-white/8 border border-white/12">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-medium text-white mb-2">Sua Próxima Jogada</h2>
                  <p className="text-white/70 leading-relaxed">
                    Notei que você dominou IA Generativa. Para elevar seu jogo, a técnica de <strong>prompt engineering avançado</strong> é o passo lógico para seus roteiros.
                  </p>
                </div>
                <button className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 flex-shrink-0 flex items-center gap-3 font-medium w-full md:w-auto justify-center hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <Play className="w-4 h-4" />
                  <span>Aprender esta Técnica</span>
                </button>
              </div>
            </div>
          </section>

          {/* Arsenal */}
          <section className="bg-white/8 backdrop-blur-lg border border-white/12 rounded-2xl p-8 animate-entry delay-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8">
              <h2 className="text-3xl font-medium text-white tracking-tight">Seu Arsenal</h2>
              <div className="relative flex border-b border-white/10">
                <button 
                  onClick={() => setActiveArsenalTab('trails')}
                  className={`text-white px-6 py-3 font-medium transition-colors ${
                    activeArsenalTab === 'trails' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Trilhas Salvas
                </button>
                <button 
                  onClick={() => setActiveArsenalTab('tools')}
                  className={`text-white px-6 py-3 font-medium transition-colors ${
                    activeArsenalTab === 'tools' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Ferramentas
                </button>
                <div 
                  className="absolute bottom-0 h-0.5 bg-white rounded-full transition-all duration-300"
                  style={{
                    width: activeArsenalTab === 'trails' ? '133px' : '108px',
                    left: activeArsenalTab === 'trails' ? '0px' : '133px'
                  }}
                />
              </div>
            </div>

            <div className="relative mt-8 min-h-[400px]">
              {/* Trilhas Salvas */}
              {activeArsenalTab === 'trails' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {USER_TRACKS.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      variant="compact"
                      onClick={handleTrackClick}
                    />
                  ))}
                </div>
              )}

              {/* Ferramentas */}
              {activeArsenalTab === 'tools' && (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                    <Wrench className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-3">Seu arsenal aguarda.</h3>
                  <p className="text-white/60 max-w-md leading-relaxed mb-8">
                    Favorite as ferramentas e prompts que definem seu gênio criativo para encontrá-los aqui.
                  </p>
                  <button 
                    onClick={() => navigate('/tools')}
                    className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-8 py-4 flex items-center gap-3 font-medium hover:bg-white/15 hover:scale-105 transition-all duration-300"
                  >
                    <Compass className="w-5 h-5" />
                    <span>Explorar Ferramentas</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Convidar e Ganhar */}
          <section className="mt-16 animate-entry delay-3">
            <h2 className="text-3xl font-medium text-white tracking-tight mb-8">Convidar e Ganhar</h2>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button 
                onClick={() => setActiveReferralTab('credits')}
                className={`bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 font-medium transition-all flex items-center gap-3 ${
                  activeReferralTab === 'credits' 
                    ? 'bg-white/20 border-white/30 text-white transform scale-100 shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/15'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Indique e Ganhe Créditos</span>
              </button>
              <button 
                onClick={() => setActiveReferralTab('affiliate')}
                className={`bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 font-medium transition-all flex items-center gap-3 ${
                  activeReferralTab === 'affiliate' 
                    ? 'bg-white/20 border-white/30 text-white transform scale-100 shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/15'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Programa de Afiliados</span>
              </button>
            </div>

            <div className="relative min-h-[320px]">
              <div className="bg-white/8 backdrop-blur-lg border border-white/12 rounded-2xl w-full p-8 md:p-10">
                <div className="relative w-full h-full">
                  {/* Conteúdo: Indique e Ganhe Créditos */}
                  {activeReferralTab === 'credits' && (
                    <div className="flex flex-col justify-center h-full">
                      <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
                        Convide um amigo, ganhe 20 créditos.
                      </h3>
                      <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                        Quando seu amigo se cadastra usando seu link, vocês dois ganham créditos para usar na plataforma.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                        <div className="flex-grow w-full sm:w-auto bg-black/30 border border-white/10 rounded-full px-5 py-3 text-white/80 text-center sm:text-left">
                          trendly.ai/ref/joaosilva
                        </div>
                        <button className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 w-full sm:w-auto font-medium flex items-center justify-center gap-2 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                          <Copy className="w-4 h-4" />
                          <span>Copiar Link</span>
                        </button>
                      </div>
                      <p className="text-sm text-white/50">
                        Você já ganhou <strong>60 créditos</strong> com suas indicações.
                      </p>
                    </div>
                  )}

                  {/* Conteúdo: Programa de Afiliados */}
                  {activeReferralTab === 'affiliate' && (
                    <div className="flex flex-col justify-center h-full">
                      <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
                        Torne-se nosso Parceiro.
                      </h3>
                      <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                        Como Maestro, você tem acesso exclusivo ao nosso programa de afiliados. Ganhe <strong>10% de comissão recorrente</strong> para cada novo assinante que indicar.
                      </p>
                      <div className="flex">
                        <button className="bg-white text-black rounded-full px-8 py-4 font-semibold flex items-center gap-3 hover:bg-gray-100 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
                          <span>Acessar Painel de Afiliado</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

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
  );
};

export default ProfilePage;