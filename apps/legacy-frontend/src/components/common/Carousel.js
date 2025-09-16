import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ 
  children, 
  id, 
  className = '', 
  showNavigation = true 
}) => {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const scrollLeft = track.scrollLeft;
    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScrollLeft - 10);

    // If no overflow, disable both buttons
    if (track.scrollWidth <= track.clientWidth) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  };

  const scrollNext = () => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    const items = Array.from(track.children);
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight || 0);
    track.scrollBy({ left: itemWidth * 2, behavior: 'smooth' });
  };

  const scrollPrev = () => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    const items = Array.from(track.children);
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight || 0);
    track.scrollBy({ left: -(itemWidth * 2), behavior: 'smooth' });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Set up intersection observer to enable scroll tracking only when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          track.addEventListener('scroll', updateScrollState, { passive: true });
          window.addEventListener('resize', updateScrollState);
          updateScrollState();
        } else {
          track.removeEventListener('scroll', updateScrollState);
          window.removeEventListener('resize', updateScrollState);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(track);
    
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {showNavigation && (
        <>
          <button 
            className={`carousel-nav-btn liquid-glass-pill absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center z-10 ${!canScrollLeft ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={scrollPrev}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className={`carousel-nav-btn liquid-glass-pill absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center z-10 ${!canScrollRight ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={scrollNext}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      <div className="carousel-container overflow-x-auto overflow-y-visible hide-scrollbar -mx-2 px-2 pt-4 pb-8">
        <ol 
          ref={trackRef}
          className="carousel-track flex gap-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {React.Children.map(children, (child, index) => (
            <li 
              key={index} 
              className="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              {child}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Carousel;