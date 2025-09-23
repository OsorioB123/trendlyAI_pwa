import { StudioTheme } from '@/types/settings'

export const STUDIO_THEMES: StudioTheme[] = [
  {
    id: 'default',
    name: 'Padrão Trendly',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)',
    imageUrl: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp'
  },
  {
    id: 'theme-2',
    name: 'Vidro',
    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), rgba(0,0,0,0) 60%), linear-gradient(135deg, #0b0b0b, #171717)',
    imageUrl: 'https://i.ibb.co/TBV2V62G/grad-2.webp'
  },
  {
    id: 'theme-3',
    name: 'Nevoa',
    background: 'radial-gradient(60% 60% at 20% 20%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 100%), linear-gradient(160deg, #0a0a0a, #101010)',
    imageUrl: 'https://i.ibb.co/dsNWJkJf/grad-3.webp'
  },
  {
    id: 'theme-4',
    name: 'Carbono',
    background: 'repeating-linear-gradient(45deg, #0c0c0c 0, #0c0c0c 10px, #101010 10px, #101010 20px)',
    imageUrl: 'https://i.ibb.co/HfKNrwFH/grad-4.webp'
  },
  {
    id: 'theme-5',
    name: 'Grafite',
    background: 'linear-gradient(180deg, #111 0%, #0b0b0b 100%)',
    imageUrl: 'https://i.ibb.co/RT6rQFKx/grad-5.webp'
  },
  {
    id: 'theme-6',
    name: 'Chumbo',
    background: 'radial-gradient(50% 50% at 50% 50%, #1a1a1a 0%, #0f0f0f 100%)',
    imageUrl: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp'
  },
  {
    id: 'theme-7',
    name: 'Slate',
    background: 'linear-gradient(200deg, #0d0d0d 0%, #161616 100%)',
    imageUrl: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp'
  },
  {
    id: 'theme-8',
    name: 'Onix',
    background: 'conic-gradient(from 180deg at 50% 50%, #101010, #0a0a0a, #101010)',
    imageUrl: 'https://i.ibb.co/BJ4stZv/grad-8.webp'
  },
  {
    id: 'theme-9',
    name: 'Cinzento',
    background: 'linear-gradient(145deg, #0e0e0e 0%, #121212 100%)',
    imageUrl: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp'
  },
  {
    id: 'theme-10',
    name: 'Nebulosa',
    background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.10), rgba(0,0,0,0) 50%), linear-gradient(145deg, #0b0b0b, #151515)',
    imageUrl: 'https://i.ibb.co/d49qW7f6/grad-10.webp'
  },
  {
    id: 'theme-11',
    name: 'Aço',
    background: 'linear-gradient(125deg, #131313 0%, #0e0e0e 100%)',
    imageUrl: 'https://i.ibb.co/TD15qTjy/grad-11.webp'
  },
  {
    id: 'theme-12',
    name: 'Midnight',
    background: 'linear-gradient(160deg, #0a0a0a 0%, #101010 50%, #0a0a0a 100%)',
    imageUrl: 'https://i.ibb.co/JwVj3XGH/grad-12.webp'
  }
]

export const studioThemeMap = STUDIO_THEMES.reduce<Record<string, StudioTheme>>((acc, theme) => {
  acc[theme.id] = theme
  return acc
}, {})

export const DEFAULT_STUDIO_THEME_ID = STUDIO_THEMES[0]?.id ?? 'default'
