import React, { useEffect, useRef } from 'react';
import { SlideProps } from '../../types';

const SlideContent: React.FC<SlideProps> = ({ slide, isActive }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isActive) {
      // Reiniciar animações quando o slide se torna ativo
      const elements = [titleRef.current, descriptionRef.current];
      elements.forEach(el => {
        if (el) {
          el.style.animation = 'none';
          el.offsetHeight; // Trigger reflow
          el.style.animation = '';
        }
      });
    }
  }, [isActive]);

  return (
    <div>
      <h1 
        ref={titleRef}
        className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 fade-in-up font-geist"
      >
        {slide.title}
      </h1>
      <p 
        ref={descriptionRef}
        className="fade-in-up max-w-md text-base text-white/80"
        style={{ animationDelay: '0.15s' }}
      >
        {slide.description}
      </p>
    </div>
  );
};

export default SlideContent;