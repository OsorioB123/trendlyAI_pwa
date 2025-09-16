import React from 'react';
import { Heart, Copy, ChevronDown, ArrowRight } from 'lucide-react';

const ToolCard = ({ 
  tool, 
  variant = 'full', 
  onClick,
  onFavorite,
  onCopy 
}) => {
  if (variant === 'compact') {
    return (
      <div 
        className="prompt-card" 
        data-prompt={tool.content}
        onClick={() => onClick?.(tool)}
      >
        <div className="border-glow"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold mb-1 text-white">{tool.title}</h3>
              <p className="text-sm text-white/70">{tool.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="prompt-action-icon favorite-btn" 
                aria-label="Favoritar"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.(tool);
                }}
              >
                <Heart style={{ width: '20px', height: '20px' }} />
              </button>
              <button 
                className="prompt-action-icon copy-btn" 
                aria-label="Copiar prompt"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy?.(tool);
                }}
              >
                <Copy style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <ChevronDown className="chevron text-white/60" style={{ width: '18px', height: '18px' }} />
          </div>
        </div>
        <div className="prompt-card-content">
          <div>
            <div className="content-card rounded-lg p-4 bg-black/30">
              <p className="text-sm text-white/90 font-mono leading-relaxed">
                {tool.content?.substring(0, 100)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (for recommendations and main sections)
  return (
    <div 
      className="prompt-card relative cursor-pointer"
      onClick={() => onClick?.(tool)}
    >
      <div className="border-glow"></div>
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 flex-grow">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-2 leading-snug font-geist">
              {tool.title}
            </h3>
            <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags?.map(tag => (
            <span key={tag} className="liquid-glass-tag">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-white/50 mt-auto">
          <span>Clique para abrir</span>
          <div className="flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;