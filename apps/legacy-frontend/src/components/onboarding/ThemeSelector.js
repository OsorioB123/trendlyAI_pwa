import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

const ThemeSelector = ({
  themes,
  selectedTheme,
  onThemeSelect
}) => {
  const galleryRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState({});

  useEffect(() => {
    // Simplified mobile handling - remove auto-selection on intersection
    // Only handle manual clicks
  }, []);

  const handleThemeClick = (themeId) => {
    // Apply theme selection immediately
    onThemeSelect(themeId);
    
    // Scroll suave no mobile para centralizar o tema selecionado
    if (window.innerWidth < 1024) {
      const sphere = document.querySelector(`[data-theme-id="${themeId}"]`);
      if (sphere && galleryRef.current) {
        const container = galleryRef.current;
        const sphereRect = sphere.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft = sphereRect.left - containerRect.left - (containerRect.width / 2) + (sphereRect.width / 2);
        
        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="slide-content-theme">
      <section className="text-center pt-8 pb-4 flex-shrink-0">
        <h2 className="text-3xl font-semibold tracking-tight animate-entry font-geist text-white">
          Defina a energia do seu estúdio.
        </h2>
        <p className="mt-2 text-white/80 animate-entry delay-1">
          Escolha o ambiente que inspira seu trabalho hoje.
        </p>
      </section>
      
      <section className="flex-grow flex flex-col items-center justify-center min-h-0 py-8 animate-entry delay-2">
        <div 
          ref={galleryRef}
          className="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible pb-4"
        >
          <ol className="flex items-center gap-6 lg:p-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:max-w-3xl lg:mx-auto themes-track">
            {themes.map((theme, index) => (
              <li
                key={theme.id}
                className="flex-shrink-0 snap-center relative flex justify-center p-4"
              >
                <button
                  className={`theme-sphere ${
                    selectedTheme === theme.id ? 'is-selected' : ''
                  } is-in-view`}
                  data-theme-id={theme.id}
                  style={{
                    '--sphere-bg': `url(${theme.value})`
                  }}
                  onClick={() => handleThemeClick(theme.id)}
                >
                  <div className="check-icon">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </button>
                
                {/* Tag "Padrão Trendly" apenas para o primeiro tema */}
                {index === 0 && (
                  <div className="liquid-glass-tag absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    Padrão Trendly
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
};

export default ThemeSelector;