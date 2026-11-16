import { useState, useEffect, useCallback } from 'react'
import reviewService from '../services/reviewService'

export function useReviews(restaurantId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await reviewService.getReviews(restaurantId)
      if (res.success) {
        setReviews(res.data || [])
      } else {
        setError('Gagal memuat ulasan.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat ulasan.')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, loading, error, refetch: fetchReviews }
}

export function useCreateReview() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createReview = async (payload) => {
    try {
      setLoading(true)
      setError(null)
      const res = await reviewService.createReview(payload)
      if (res.success) {
        return res.data
      }
      throw new Error('Gagal mengirim ulasan')
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulasan')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createReview, loading, error }
}
