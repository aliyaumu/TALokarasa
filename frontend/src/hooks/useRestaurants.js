import { useState, useEffect, useCallback } from 'react'
import restaurantService from '../services/restaurantService'

export function useRestaurants(params = {}) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLocal, setIsLocal] = useState(false)

  const paramKey = JSON.stringify(params)

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await restaurantService.getRestaurants(params)
      if (res.success) {
        setRestaurants(res.data || [])
        setIsLocal(Boolean(res.isLocalFallback))
      } else {
        setError('Gagal memuat daftar tempat makan.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.')
      setRestaurants([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  return { restaurants, loading, error, isLocal, refetch: fetchRestaurants }
}

export function useRestaurantById(id) {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRestaurant = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await restaurantService.getRestaurantById(id)
      if (res.success) {
        setRestaurant(res.data)
      } else {
        setError('Tempat makan tidak ditemukan.')
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data detail tempat makan.')
      setRestaurant(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRestaurant()
  }, [fetchRestaurant])

  return { restaurant, loading, error, refetch: fetchRestaurant }
}
