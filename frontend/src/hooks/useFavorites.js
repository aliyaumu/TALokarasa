import { useState, useEffect, useCallback } from 'react'
import favoriteService from '../services/favoriteService'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(() => {
    try {
      setLoading(true)
      const data = favoriteService.getFavorites()
      setFavorites(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const toggleFavorite = (restaurant) => {
    const res = favoriteService.toggleFavorite(restaurant)
    if (res.success) {
      fetchFavorites()
    }
    return res
  }

  const isFavorited = (id) => favoriteService.isFavorited(id)

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited,
    refetch: fetchFavorites,
  }
}
