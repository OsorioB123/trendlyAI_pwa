'use client'

import { useState, useEffect, useCallback } from 'react'
import { Track, UserTrackProgress, TracksFilters } from '../types/track'
import { TrackService } from '../lib/services/trackService'
import { useAuth } from '../contexts/AuthContext'

export interface UseTracksReturn {
  tracks: Track[]
  loading: boolean
  error: string | null
  favorites: string[]
  userProgress: Record<string, UserTrackProgress>
  filteredTracks: Track[]
  loadTracks: () => Promise<void>
  toggleFavorite: (trackId: string) => Promise<void>
  filterTracks: (filters: TracksFilters) => Track[]
  getTrackProgress: (trackId: string) => number
  getTrackStatus: (trackId: string) => 'nao_iniciado' | 'em_andamento' | 'concluido'
  isTrackFavorited: (trackId: string) => boolean
  refreshTracks: () => Promise<void>
}

export function useTracks(initialLimit: number = 50): UseTracksReturn {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [userProgress, setUserProgress] = useState<Record<string, UserTrackProgress>>({})
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])
  
  const { user, isAuthenticated } = useAuth()

  // Load tracks from Supabase
  const loadTracks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get recommended tracks from TrackService
      const tracksData = await TrackService.getRecommendedTracks(
        isAuthenticated ? user?.id : undefined, 
        initialLimit
      )
      
      // Handle case where no tracks are returned
      if (!tracksData || tracksData.length === 0) {
        console.log('No tracks returned from TrackService')
        setTracks([])
        setFilteredTracks([])
        setUserProgress({})
        setFavorites([])
        return
      }
      
      // If user is authenticated, load their progress and favorites
      let progressData: Record<string, UserTrackProgress> = {}
      let favoritesData: string[] = []
      
      if (isAuthenticated && user?.id) {
        // Load user progress for all tracks
        const progressPromises = tracksData.map(async (track) => {
          const progress = await TrackService.getUserTrackProgress(user.id, track.id.toString())
          if (progress) {
            return { [track.id.toString()]: progress }
          }
          return {}
        })
        
        const progressResults = await Promise.all(progressPromises)
        progressData = progressResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        
        // Extract favorites from progress data
        favoritesData = Object.entries(progressData)
          .filter(([, progress]) => progress.isFavorite)
          .map(([trackId]) => trackId)
      }
      
      // Enhance tracks with user data
      const enhancedTracks = tracksData.map(track => {
        const progress = progressData[track.id.toString()]

        return {
          ...track,
          progress: progress?.progressPercentage || 0,
          backgroundImage: track.thumbnailUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
          status: progress ? 
            (progress.completedAt ? 'concluido' as const : 'em_andamento' as const) : 
            'nao_iniciado' as const,
          tags: track.categories || []
        }
      })
      
      setTracks(enhancedTracks)
      setFilteredTracks(enhancedTracks)
      setUserProgress(progressData)
      setFavorites(favoritesData)
      
    } catch (err) {
      console.error('Error loading tracks:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tracks')
    } finally {
      setLoading(false)
    }
  }, [user?.id, isAuthenticated, initialLimit])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (trackId: string) => {
    if (!isAuthenticated || !user?.id) {
      setError('You must be logged in to favorite tracks')
      return
    }

    const isFavorited = favorites.includes(trackId)
    
    // Optimistic update
    setFavorites(prev => 
      isFavorited 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )

    try {
      const newFavoriteStatus = await TrackService.toggleFavoriteTrack(user.id, trackId)
      
      // Update local state to match server response
      setFavorites(prev => 
        newFavoriteStatus
          ? [...prev.filter(id => id !== trackId), trackId]
          : prev.filter(id => id !== trackId)
      )
      
      // Update user progress state
      setUserProgress(prev => {
        const existing = prev[trackId]
        if (existing) {
          return {
            ...prev,
            [trackId]: { ...existing, isFavorite: newFavoriteStatus }
          }
        }
        return prev
      })
      
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      
      // Revert optimistic update on error
      setFavorites(prev => 
        isFavorited 
          ? [...prev, trackId]
          : prev.filter(id => id !== trackId)
      )
      
      setError('Failed to update favorite status')
      setTimeout(() => setError(null), 3000)
    }
  }, [isAuthenticated, user?.id, favorites])

  // Get track progress percentage
  const getTrackProgress = useCallback((trackId: string): number => {
    const progress = userProgress[trackId]
    return progress?.progressPercentage || 0
  }, [userProgress])

  // Get track status
  const getTrackStatus = useCallback((trackId: string): 'nao_iniciado' | 'em_andamento' | 'concluido' => {
    const progress = userProgress[trackId]
    if (!progress) return 'nao_iniciado'
    if (progress.completedAt) return 'concluido'
    if (progress.progressPercentage > 0) return 'em_andamento'
    return 'nao_iniciado'
  }, [userProgress])

  // Filter tracks based on filters
  const filterTracks = useCallback((filters: TracksFilters): Track[] => {
    let result = [...tracks]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.subtitle?.toLowerCase().includes(searchTerm) ||
        track.categories.some(cat => cat.toLowerCase().includes(searchTerm))
      )
    }

    // Categories filter
    if (filters.categories.length > 0) {
      result = result.filter(track => 
        track.categories.some(cat => filters.categories.includes(cat)) ||
        (track.category && filters.categories.includes(track.category))
      )
    }

    // Levels filter
    if (filters.levels.length > 0) {
      result = result.filter(track => filters.levels.includes(track.level))
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(track => {
        const status = getTrackStatus(track.id.toString())
        return filters.status.includes(status)
      })
    }

    // Sort
    if (filters.sort === 'recent') {
      result.sort((a, b) => {
        const aDate = a.createdAt || new Date(0)
        const bDate = b.createdAt || new Date(0)
        return bDate.getTime() - aDate.getTime()
      })
    } else {
      // 'top' - sort by progress and favorites
      result.sort((a, b) => {
        const aFavorited = favorites.includes(a.id.toString()) ? 1 : 0
        const bFavorited = favorites.includes(b.id.toString()) ? 1 : 0
        
        if (aFavorited !== bFavorited) return bFavorited - aFavorited
        
        const aProgress = a.progress || 0
        const bProgress = b.progress || 0
        return bProgress - aProgress
      })
    }

    setFilteredTracks(result)
    return result
  }, [tracks, favorites, getTrackStatus])

  // Check if track is favorited
  const isTrackFavorited = useCallback((trackId: string): boolean => {
    return favorites.includes(trackId)
  }, [favorites])

  // Refresh tracks data
  const refreshTracks = useCallback(async () => {
    await loadTracks()
  }, [loadTracks])

  // Load tracks on mount and when authentication changes
  useEffect(() => {
    loadTracks()
  }, [loadTracks])

  // Update filtered tracks when tracks or favorites change
  useEffect(() => {
    setFilteredTracks([...tracks])
  }, [tracks])

  return {
    tracks,
    loading,
    error,
    favorites,
    userProgress,
    filteredTracks,
    loadTracks,
    toggleFavorite,
    filterTracks,
    getTrackProgress,
    getTrackStatus,
    isTrackFavorited,
    refreshTracks
  }
}
