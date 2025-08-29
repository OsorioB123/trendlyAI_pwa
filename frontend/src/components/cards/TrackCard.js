import React from 'react';

const TrackCard = ({ 
  track, 
  variant = 'full', 
  onClick 
}) => {
  if (variant === 'compact') {
    return (
      <div 
        className="arsenal-card group rounded-2xl overflow-hidden relative h-80 cursor-pointer"
        style={{ 
          backgroundImage: `url('${track.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={() => onClick?.(track)}
      >
        <div className="card-overlay absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="font-medium text-white text-xl mb-4">{track.title}</h3>
          <div className="flex items-center justify-between text-sm mb-2 text-white/80 progress-bar-label">
            <span>Progresso</span>
            <span>{track.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500" 
              style={{ width: `${track.progress}%` }}
            />
          </div>
          <div className="card-hover-actions">
            <button className="liquid-glass-pill w-full py-3 font-medium">
              {track.progress === 100 ? 'Finalizar Trilha' : 
               track.progress >= 90 ? 'Finalizar Trilha' : 
               'Continuar Trilha'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (for recommendations)
  return (
    <div className="animate-entry">
      <div 
        className="interactive-card rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.28)] relative h-64 card-glow cursor-pointer"
        onClick={() => onClick?.(track)}
      >
        <img 
          src={track.backgroundImage} 
          alt={track.title}
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 p-5 flex items-start gap-2 flex-wrap">
          {track.tags?.map(tag => (
            <span key={tag} className="liquid-glass-tag">{tag}</span>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
          <div className="p-5">
            <h3 className="font-semibold text-white text-lg clamp-2">{track.title}</h3>
          </div>
        </div>
      </div>
      {track.progress !== undefined && (
        <div className="progress-bar-container mt-2">
          <div 
            className="progress-bar-fill bg-white/20 h-1 rounded-full" 
            data-progress={track.progress} 
            style={{ width: `${track.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TrackCard;