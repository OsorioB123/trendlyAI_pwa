
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { MOTION_CONSTANTS, respectReducedMotion } from '../../lib/motion'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'
import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBackground } from '../../contexts/BackgroundContext'
import { markOnboardingComplete } from '../../lib/onboarding'

interface Theme {
  id: string
  name: string
  value: string
}

const THEMES: Theme[] = [
  { id: 'default', name: 'Padrão Trendly', value: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
  { id: 'theme-2', name: 'Ambiente 2', value: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
  { id: 'theme-3', name: 'Ambiente 3', value: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
  { id: 'theme-4', name: 'Ambiente 4', value: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
  { id: 'theme-5', name: 'Ambiente 5', value: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
  { id: 'theme-6', name: 'Ambiente 6', value: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
  { id: 'theme-7', name: 'Ambiente 7', value: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
  { id: 'theme-8', name: 'Ambiente 8', value: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
  { id: 'theme-9', name: 'Ambiente 9', value: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
  { id: 'theme-10', name: 'Ambiente 10', value: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
  { id: 'theme-11', name: 'Ambiente 11', value: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
  { id: 'theme-12', name: 'Ambiente 12', value: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' },
]

// Theme Sphere Component
interface ThemeSphereProps {
  theme: Theme
  isSelected: boolean
  isInView: boolean
  onSelect: (themeId: string) => void
  isDefault?: boolean
}

function ThemeSphere({ theme, isSelected, isInView, onSelect, isDefault }: ThemeSphereProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect(theme.id)
  }

  return (
    <li className="relative flex flex-col items-center gap-3 p-4 pb-8 snap-center lg:items-start">
      {isDefault && (
        <div className="liquid-glass-tag absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          Padrão Trendly
        </div>
      )}
      <button
        id={`theme-${theme.id}`}
        className={`theme-sphere ${isSelected ? 'is-selected' : ''} ${isInView ? 'is-in-view' : ''}`}
        style={{ '--sphere-bg': `url(${theme.value})` } as CSSProperties}
        data-theme-id={theme.id}
        onClick={handleClick}
        aria-label={`Selecionar tema ${theme.name}`}
        type="button"
      >
        <div className="check-icon">
          <Check className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
      </button>
      <span className="text-sm text-white/75 text-center lg:text-left">{theme.name}</span>
    </li>
  )
}

// Slide Background Component
interface SlideBackgroundProps {
  slideNumber: number
  currentSlide: number
  backgroundUrl?: string
}

function SlideBackground({ slideNumber, currentSlide, backgroundUrl }: SlideBackgroundProps) {
  if (!backgroundUrl) return null
  
  return (
    <div 
      className={`slide-background ${currentSlide === slideNumber ? 'active' : ''}`}
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    />
  )
}

// Theme Background Component
interface ThemeBackgroundProps {
  themes: Theme[]
  selectedThemeId: string
  isVisible: boolean
}

function ThemeBackground({ themes, selectedThemeId, isVisible }: ThemeBackgroundProps) {
  return (
    <div className={isVisible ? '' : 'hidden'}>
      {themes.map((theme) => (
        <div
          key={theme.id}
          className={`background-layer ${selectedThemeId === theme.id ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${theme.value})` }}
        />
      ))}
    </div>
  )
}

// Main Onboarding Component
export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [selectedThemeId, setSelectedThemeId] = useState('default')
  const [themesInitialized, setThemesInitialized] = useState(false)
  const [inViewThemeId, setInViewThemeId] = useState<string>('default')
  
  const router = useRouter()
  const { changeBackground } = useBackground()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollCleanupRef = useRef<(() => void) | null>(null)
  const scrollAnimationIdRef = useRef<number | null>(null)
  const initializedRef = useRef(false)
  
  const totalSlides = 4
  const transitionSafe = respectReducedMotion({ transition: { duration: MOTION_CONSTANTS.DURATION.normal } }).transition as any

  // Setup intersection observer for mobile theme selection - exact from HTML reference
  const setupMobileThemeSync = useCallback(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth >= 1024) {
      scrollCleanupRef.current?.()
      observerRef.current?.disconnect()
      return
    }

    const themesGallery = document.getElementById('themes-gallery')
    if (!themesGallery) return

    scrollCleanupRef.current?.()
    observerRef.current?.disconnect()

    const containers = Array.from(document.querySelectorAll('#themes-track li'))
    if (containers.length === 0) return

    const calculateClosestTheme = () => {
      const galleryRect = themesGallery.getBoundingClientRect()
      const galleryCenter = galleryRect.left + galleryRect.width / 2
      let closestId: string | null = null
      let closestDistance = Number.POSITIVE_INFINITY

      containers.forEach((container) => {
        const button = container.querySelector('.theme-sphere') as HTMLElement | null
        if (!button) return
        const rect = container.getBoundingClientRect()
        const center = rect.left + rect.width / 2
        const distance = Math.abs(center - galleryCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = button.dataset.themeId ?? null
        }
      })

      if (closestId) {
        const nextId = closestId
        setInViewThemeId((prev) => (prev === nextId ? prev : nextId))
        setSelectedThemeId((prev) => (prev === nextId ? prev : nextId))
      }
    }

    const handleScroll = () => {
      if (scrollAnimationIdRef.current) {
        cancelAnimationFrame(scrollAnimationIdRef.current)
      }
      scrollAnimationIdRef.current = requestAnimationFrame(calculateClosestTheme)
    }

    themesGallery.addEventListener('scroll', handleScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        let bestId: string | null = null
        let bestRatio = 0

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const button = entry.target.querySelector('.theme-sphere') as HTMLElement | null
          const themeId = button?.dataset.themeId
          if (themeId && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = themeId
          }
        })

        if (bestId) {
          const nextId = bestId
          setInViewThemeId((prev) => (prev === nextId ? prev : nextId))
          setSelectedThemeId((prev) => (prev === nextId ? prev : nextId))
        }
      },
      {
        root: themesGallery,
        threshold: [0.5, 0.75]
      }
    )

    containers.forEach((container) => observer.observe(container))

    observerRef.current = observer
    scrollCleanupRef.current = () => {
      themesGallery.removeEventListener('scroll', handleScroll)
      if (scrollAnimationIdRef.current) {
        cancelAnimationFrame(scrollAnimationIdRef.current)
        scrollAnimationIdRef.current = null
      }
      observer.disconnect()
      observerRef.current = null
    }

    calculateClosestTheme()
  }, [])

  // Handle slide navigation - exact match from HTML reference
  const showSlide = useCallback((slideNumber: number) => {
    setCurrentSlide(slideNumber)

    // Initialize theme selector on slide 3 - ONLY when actually navegating to slide 3
    if (slideNumber === 3) {
      if (!themesInitialized) {
        setThemesInitialized(true)
      }

      setInViewThemeId((prev) => (prev === selectedThemeId ? prev : selectedThemeId))

      setTimeout(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
          const selectedElement = document.getElementById(`theme-${selectedThemeId}`)
          selectedElement?.parentElement?.scrollIntoView({ behavior: 'auto', inline: 'center' })
          setupMobileThemeSync()
        }
      }, 100)
    } else {
      scrollCleanupRef.current?.()
      observerRef.current?.disconnect()
    }

    // Framer Motion handles entrance animations; no manual CSS restart needed
  }, [selectedThemeId, themesInitialized, setupMobileThemeSync])

  // Handle theme selection - CRITICAL: Must NOT trigger slide navigation
  const handleThemeSelect = useCallback((themeId: string) => {
    setSelectedThemeId(themeId)
    setInViewThemeId(themeId)

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const selectedElement = document.getElementById(`theme-${themeId}`)
      selectedElement?.parentElement?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  }, [])

  // Handle next button click
  const handleNext = useCallback(async () => {
    if (currentSlide < totalSlides) {
      showSlide(currentSlide + 1)
    } else {
      // Persist completion flag (localStorage + cookie for middleware)
      markOnboardingComplete()
      
      // Save selected theme preference
      await changeBackground(selectedThemeId)
      
      // Navigate to dashboard
      router.push('/dashboard')
    }
  }, [currentSlide, totalSlides, selectedThemeId, changeBackground, router, showSlide])

  // Handle skip
  const handleSkip = useCallback(() => {
    // Mark onboarding as complete when skipping as well
    markOnboardingComplete()
    router.push('/dashboard')
  }, [router])

  // Handle dot navigation
  const handleDotClick = useCallback((slideNumber: number) => {
    if (currentSlide !== slideNumber) {
      showSlide(slideNumber)
    }
  }, [currentSlide, showSlide])

  // Initialize first slide - only once on mount
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    showSlide(1)
  }, [showSlide])

  // Cleanup intersection observer
  useEffect(() => {
    return () => {
      scrollCleanupRef.current?.()
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Fixed slide backgrounds for slides 1, 2, 4 */}
      <SlideBackground 
        slideNumber={1} 
        currentSlide={currentSlide}
        backgroundUrl="https://i.ibb.co/602fn0G5/tela-1.webp"
      />
      <SlideBackground 
        slideNumber={2} 
        currentSlide={currentSlide}
        backgroundUrl="https://i.ibb.co/0j3FZ1fm/tela-2.webp"
      />
      <SlideBackground 
        slideNumber={4} 
        currentSlide={currentSlide}
        backgroundUrl="https://i.ibb.co/zTV6nP2q/tela-4.webp"
      />

      {/* Dynamic theme backgrounds for slide 3 */}
      <ThemeBackground 
        themes={THEMES}
        selectedThemeId={selectedThemeId}
        isVisible={currentSlide === 3}
      />

      {/* Gradient overlay */}
      <BackgroundOverlay />

      {/* Main content - Exact layout match from HTML reference */}
      <main className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-8 pb-10">
        <motion.div
          id="slides-container"
          key={`slide-${currentSlide}`}
          className="relative flex-1 min-h-0"
          variants={MOTION_CONSTANTS.VARIANTS.staggerContainer as any}
          initial="initial"
          animate="animate"
          transition={transitionSafe}
        >
          
          {/* Slide 1 - Bottom-left positioning on desktop, centered on mobile */}
          <div id="slide-1" className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
            <motion.div className="lg:max-w-md">
              <motion.h1
                className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 font-geist"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                A tela em branco. O maior inimigo da criatividade.
              </motion.h1>
              <motion.p
                className="max-w-md text-base text-white/80"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                Por anos, as ferramentas nos deram mais botões, mas nunca uma direção. Elas nos deixaram sozinhos com o nosso maior desafio.
              </motion.p>
            </motion.div>
          </div>
          
          {/* Slide 2 - Bottom-left positioning on desktop, centered on mobile */}
          <div id="slide-2" className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
            <motion.div className="lg:max-w-md">
              <motion.h1
                className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 font-geist"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                E se você tivesse um gênio como co-piloto?
              </motion.h1>
              <motion.p
                className="text-base text-white/80 mb-6 max-w-md"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                Apresentando Salina, sua mente estratégica pessoal. Ela não te dá ferramentas. Ela conversa, guia e co-cria com você, transformando intenção em excelência.
              </motion.p>
            </motion.div>
          </div>
          
          {/* Slide 3 - Theme Selection - Centered layout for this slide */}
          <div id="slide-3" className={`slide ${currentSlide === 3 ? 'active' : ''}` + " !justify-center"}>
            <div className="slide-content-theme">
              <motion.section
                className="text-center pt-8 pb-4 flex-shrink-0 lg:pt-10"
                variants={MOTION_CONSTANTS.VARIANTS.staggerContainer as any}
              >
                <motion.h2
                  className="text-3xl font-semibold tracking-tight font-geist"
                  variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
                >
                  Defina a energia do seu estúdio.
                </motion.h2>
                <motion.p
                  className="mt-2 text-white/80"
                  variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
                >
                  Escolha o ambiente que inspira seu trabalho hoje.
                </motion.p>
              </motion.section>

              <motion.section
                className="flex-grow flex flex-col items-center justify-center min-h-0 py-8 lg:py-12"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                <div id="themes-gallery" className="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible pb-4">
                  <ol id="themes-track" className="flex items-center gap-6 lg:grid lg:grid-cols-4 lg:gap-10 lg:max-w-5xl lg:mx-auto lg:px-6">
                    {THEMES.map((theme, index) => (
                      <ThemeSphere
                        key={theme.id}
                        theme={theme}
                        isSelected={selectedThemeId === theme.id}
                        isInView={inViewThemeId === theme.id}
                        onSelect={handleThemeSelect}
                        isDefault={index === 0}
                      />
                    ))}
                  </ol>
                </div>
              </motion.section>
            </div>
          </div>

          {/* Slide 4 - Bottom-left positioning on desktop, centered on mobile */}
          <div id="slide-4" className={`slide ${currentSlide === 4 ? 'active' : ''}`}>
            <motion.div className="lg:max-w-md">
              <motion.h1
                className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 font-geist"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                Bem-vindo ao seu novo estúdio criativo.
              </motion.h1>
              <motion.p
                className="text-base text-white/80 mb-6 max-w-md"
                variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
              >
                Explore trilhas de aprendizado, domine ferramentas de precisão e converse com a Salina para transformar qualquer ideia em seu próximo grande projeto. O poder é seu.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Bottom Controls */}
        <div className="flex-shrink-0 mt-8">
          {/* Progress Dots */}
          <motion.div
            className="flex items-center space-x-2 mb-10"
            variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
          >
            {Array.from({ length: totalSlides }, (_, i) => {
              const slideNumber = i + 1
              const isActive = currentSlide === slideNumber
              
              return (
                <button
                  key={slideNumber}
                  type="button"
                  className="slide-dot"
                  style={{
                    width: isActive ? '24px' : '6px',
                    backgroundColor: isActive ? 'white' : 'rgba(255, 255, 255, 0.3)'
                  }}
                  aria-label={`Ir para o slide ${slideNumber}`}
                  aria-current={isActive ? 'true' : undefined}
                  aria-controls={`slide-${slideNumber}`}
                  onClick={() => handleDotClick(slideNumber)}
                />
              )
            })}
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            className="flex items-center justify-between"
            variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
          >
            <button
              onClick={handleSkip}
              className="text-white/70 hover:text-white px-6 py-3.5 rounded-full font-medium transition-colors"
            >
              Pular
            </button>
            
            <button
              onClick={handleNext}
              className="primary-button-glow"
            >
              <div className="border-glow" />
              <span className="relative z-10 flex items-center">
                {currentSlide === totalSlides ? (
                  <>
                    Começar <Check className="ml-2 h-5 w-5" strokeWidth={1.75} />
                  </>
                ) : (
                  <>
                    Próximo <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.75} />
                  </>
                )}
              </span>
            </button>
          </motion.div>
          
          {/* Home Indicator */}
          <div className="w-[134px] h-[5px] bg-white/40 rounded-full mx-auto mt-8" />
        </div>
      </main>
    </div>
  )
}
