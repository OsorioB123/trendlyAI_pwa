import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { ThemeSelectorProps } from '../../types';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeSelect
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Configurar Intersection Observer para mobile
    if (window.innerWidth < 1024) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const themeId = entry.target.getAttribute('data-theme-id');
            if (themeId) {
              setIsIntersecting(prev => ({
                ...prev,
                [themeId]: entry.isIntersecting
              }));

              if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
                onThemeSelect(themeId);
              }
            }
          });
        },
        {
          root: galleryRef.current,
          rootMargin: '0px',
          threshold: 0.8
        }
      );

      // Observar todas as esferas de tema
      const spheres = galleryRef.current?.querySelectorAll('.theme-sphere');
      spheres?.forEach(sphere => observer.observe(sphere));

      return () => observer.disconnect();
    }
  }, [onThemeSelect]);

  const handleThemeClick = (themeId: string) => {
    onThemeSelect(themeId);
    
    // Scroll suave no mobile
    if (window.innerWidth < 1024) {
      const sphere = document.querySelector(`[data-theme-id="${themeId}"]`) as HTMLElement;
      sphere?.parentElement?.scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center' 
      });
    }
  };

  return (
    <div className="slide-content-theme">
      <section className="text-center pt-8 pb-4 flex-shrink-0">
        <h2 className="text-3xl font-semibold tracking-tight animate-entry font-geist">
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
                  } ${
                    window.innerWidth >= 1024 || isIntersecting[theme.id] ? 'is-in-view' : ''
                  }`}
                  data-theme-id={theme.id}
                  style={{
                    '--sphere-bg': `url(${theme.value})`
                  } as React.CSSProperties}
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