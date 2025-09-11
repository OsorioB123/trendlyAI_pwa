'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  children: ReactNode
  id?: string
  className?: string
  showNavigation?: boolean
}

export default function Carousel({ 
  children, 
  id, 
  className = '', 
  showNavigation = true 
}: CarouselProps) {
  const trackRef = useRef<HTMLOListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    if (!trackRef.current) return

    const track = trackRef.current
    const scrollLeft = track.scrollLeft
    const maxScrollLeft = track.scrollWidth - track.clientWidth

    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < maxScrollLeft - 5)

    // If no overflow, disable both buttons
    if (track.scrollWidth <= track.clientWidth) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
    }
  }

  const scrollNext = () => {
    if (!trackRef.current) return
    
    const track = trackRef.current
    const items = Array.from(track.children) as HTMLElement[]
    if (items.length === 0) return

    // Calculate viewport width and scroll amount
    const containerWidth = track.clientWidth
    const gap = 24 // 6 * 4px (gap-6 = 1.5rem = 24px)
    
    // On mobile (< 640px): scroll by 85% + gap
    // On tablet (640-1024px): scroll by 50% + gap  
    // On desktop (> 1024px): scroll by 33.333% + gap
    let scrollAmount: number
    
    if (window.innerWidth < 640) {
      scrollAmount = containerWidth * 0.85 + gap
    } else if (window.innerWidth < 1024) {
      scrollAmount = containerWidth * 0.5 + gap
    } else {
      scrollAmount = containerWidth * 0.333 + gap
    }
    
    // Scroll by calculated amount
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    
    // Update scroll state after a delay to account for smooth scrolling
    setTimeout(updateScrollState, 150)
  }

  const scrollPrev = () => {
    if (!trackRef.current) return
    
    const track = trackRef.current
    const items = Array.from(track.children) as HTMLElement[]
    if (items.length === 0) return

    // Calculate viewport width and scroll amount  
    const containerWidth = track.clientWidth
    const gap = 24 // 6 * 4px (gap-6 = 1.5rem = 24px)
    
    // On mobile (< 640px): scroll by 85% + gap
    // On tablet (640-1024px): scroll by 50% + gap
    // On desktop (> 1024px): scroll by 33.333% + gap
    let scrollAmount: number
    
    if (window.innerWidth < 640) {
      scrollAmount = containerWidth * 0.85 + gap
    } else if (window.innerWidth < 1024) {
      scrollAmount = containerWidth * 0.5 + gap
    } else {
      scrollAmount = containerWidth * 0.333 + gap
    }
    
    // Scroll by calculated amount
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    
    // Update scroll state after a delay to account for smooth scrolling
    setTimeout(updateScrollState, 150)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Set up intersection observer to enable scroll tracking only when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          track.addEventListener('scroll', updateScrollState, { passive: true })
          window.addEventListener('resize', updateScrollState)
          // Initial state update
          updateScrollState()
        } else {
          track.removeEventListener('scroll', updateScrollState)
          window.removeEventListener('resize', updateScrollState)
        }
      })
    }, { threshold: 0.1 })

    observer.observe(track)
    
    // Initial scroll state setup
    setTimeout(updateScrollState, 100)
    
    return () => {
      observer.disconnect()
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  // Update scroll state on children change
  useEffect(() => {
    if (trackRef.current) {
      setTimeout(updateScrollState, 100)
    }
  }, [children])

  return (
    <div className={`relative ${className}`} id={id}>
      {showNavigation && (
        <>
          <button 
            className={`absolute top-1/2 -left-4 lg:-left-6 transform -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full hidden md:flex items-center justify-center z-20 liquid-glass-pill text-white transition-all duration-300 ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            aria-label="Scroll to previous items"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <button 
            className={`absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full hidden md:flex items-center justify-center z-20 liquid-glass-pill text-white transition-all duration-300 ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
            onClick={scrollNext}
            disabled={!canScrollRight}
            aria-label="Scroll to next items"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </>
      )}
      
      {/* FIXED: Increased padding to accommodate shadow overflow - pt-12 pb-16 (48px top, 64px bottom) */}
      <div className="overflow-x-auto overflow-y-visible scrollbar-hide -mx-2 px-2 pt-2 pb-4">
        <ol 
          ref={trackRef}
          className="flex gap-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {Array.isArray(children) ? children.map((child, index) => (
            <li 
              key={index} 
              className="w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              {child}
            </li>
          )) : (
            <li 
              className="w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              {children}
            </li>
          )}
        </ol>
      </div>
    </div>
  )
}