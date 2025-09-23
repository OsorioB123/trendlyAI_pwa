'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_STUDIO_THEME_ID, STUDIO_THEMES, studioThemeMap } from '@/data/studioThemes'

interface Background {
  id: string
  name: string
  value: string
}

interface BackgroundContextType {
  currentBackground: Background
  changeBackground: (backgroundId: string, options?: { persist?: boolean }) => Promise<void>
  setCurrentBackground: (backgroundObject: Background) => void
  availableBackgrounds: Background[]
  loadUserBackground: () => Promise<void>
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

// Lista dos backgrounds disponíveis
const BACKGROUNDS: Background[] = STUDIO_THEMES.map((theme) => ({
  id: theme.id,
  name: theme.name,
  value: theme.imageUrl
}))

interface BackgroundProviderProps {
  children: ReactNode
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const getThemeById = (themeId: string | null | undefined): Background => {
    const fallbackTheme = studioThemeMap[DEFAULT_STUDIO_THEME_ID]
    if (!themeId) {
      return {
        id: fallbackTheme.id,
        name: fallbackTheme.name,
        value: fallbackTheme.imageUrl
      }
    }

    const theme = studioThemeMap[themeId]
    return theme
      ? { id: theme.id, name: theme.name, value: theme.imageUrl }
      : {
          id: fallbackTheme.id,
          name: fallbackTheme.name,
          value: fallbackTheme.imageUrl
        }
  }

  const [currentBackground, setCurrentBackground] = useState<Background>(() => {
    const savedBackgroundId = typeof window !== 'undefined'
      ? localStorage.getItem('trendlyai-background')
      : null
    return getThemeById(savedBackgroundId)
  })

  // Carregar background do localStorage na inicialização
  useEffect(() => {
    const savedBackgroundId = localStorage.getItem('trendlyai-background')
    if (savedBackgroundId) {
      setCurrentBackground(getThemeById(savedBackgroundId))
    }
  }, [])

  // Carregar background das preferências do usuário no Supabase
  const loadUserBackground = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('preferences')
        .eq('id', user.id)
        .single()

      const pref: any = profile?.preferences || {}
      const bgId: string | undefined = pref.background || pref.studio_theme
      if (bgId) {
        const background = getThemeById(bgId)
        setCurrentBackground(background)
        localStorage.setItem('trendlyai-background', background.id)
      }
    } catch (error) {
      console.error('Error loading user background:', error)
    }
  }

  // Salvar no localStorage e Supabase quando alterar o background
  const changeBackground = async (backgroundId: string, options?: { persist?: boolean }) => {
    const shouldPersist = options?.persist !== false
    const theme = studioThemeMap[backgroundId]
    if (!theme) return

    // Update local state and localStorage immediately
    const background = {
      id: theme.id,
      name: theme.name,
      value: theme.imageUrl
    }

    setCurrentBackground(background)
    localStorage.setItem('trendlyai-background', background.id)

    if (shouldPersist) {
      // Save to Supabase profile preferences
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Get current preferences
          const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('preferences')
            .eq('id', user.id)
            .single()

          const currentPreferences = profile?.preferences || {}
          const updatedPreferences = {
            ...currentPreferences,
            background: background.id,
            studio_theme: background.id
          }

          // Update preferences
          await (supabase
            .from('profiles') as any)
            .update({ preferences: updatedPreferences })
            .eq('id', user.id)

          console.log('Background preference saved to profile')
        }
      } catch (error) {
        console.error('Error saving background preference:', error)
        // Don't fail silently, but don't throw either
      }
    }
  }

  // Função adicional para mudanças diretas (compatibilidade)
  const setCurrentBackgroundDirect = (backgroundObject: Background) => {
    setCurrentBackground(backgroundObject)
    localStorage.setItem('trendlyai-background', backgroundObject.id)
  }

  return (
    <BackgroundContext.Provider value={{
      currentBackground,
      changeBackground,
      setCurrentBackground: setCurrentBackgroundDirect,
      availableBackgrounds: BACKGROUNDS,
      loadUserBackground
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}
