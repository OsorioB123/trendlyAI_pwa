'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface Background {
  id: string
  name: string
  value: string
}

interface BackgroundContextType {
  currentBackground: Background
  changeBackground: (backgroundId: string) => Promise<void>
  setCurrentBackground: (backgroundObject: Background) => void
  availableBackgrounds: Background[]
  loadUserBackground: () => Promise<void>
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

// Lista dos backgrounds disponíveis
const BACKGROUNDS: Background[] = [
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

interface BackgroundProviderProps {
  children: ReactNode
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [currentBackground, setCurrentBackground] = useState<Background>(BACKGROUNDS[0])

  // Carregar background do localStorage na inicialização
  useEffect(() => {
    const savedBackgroundId = localStorage.getItem('trendlyai-background')
    if (savedBackgroundId) {
      const savedBackground = BACKGROUNDS.find(bg => bg.id === savedBackgroundId)
      if (savedBackground) {
        setCurrentBackground(savedBackground)
      }
    }
  }, [])

  // Carregar background das preferências do usuário no Supabase
  const loadUserBackground = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single()

      if (profile?.preferences?.background) {
        const savedBackground = BACKGROUNDS.find(bg => bg.id === profile.preferences.background)
        if (savedBackground) {
          setCurrentBackground(savedBackground)
          localStorage.setItem('trendlyai-background', profile.preferences.background)
        }
      }
    } catch (error) {
      console.error('Error loading user background:', error)
    }
  }

  // Salvar no localStorage e Supabase quando alterar o background
  const changeBackground = async (backgroundId: string) => {
    const newBackground = BACKGROUNDS.find(bg => bg.id === backgroundId)
    if (!newBackground) return

    // Update local state and localStorage immediately
    setCurrentBackground(newBackground)
    localStorage.setItem('trendlyai-background', backgroundId)

    // Save to Supabase profile preferences
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Get current preferences
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single()

        const currentPreferences = profile?.preferences || {}
        const updatedPreferences = {
          ...currentPreferences,
          background: backgroundId
        }

        // Update preferences
        await supabase
          .from('profiles')
          .update({ preferences: updatedPreferences })
          .eq('id', user.id)

        console.log('Background preference saved to profile')
      }
    } catch (error) {
      console.error('Error saving background preference:', error)
      // Don't fail silently, but don't throw either
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