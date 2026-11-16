import { apiClient } from '../config/api'
import { INITIAL_RESTAURANTS } from '../data/initialRestaurants'

// Fallback local memory list
let localRestaurants = [...INITIAL_RESTAURANTS]

class RestaurantService {
  async getRestaurants(params = {}) {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      )
      const data = await apiClient.get('/api/restaurants', { params: cleanParams })
      return { success: true, data: Array.isArray(data) ? data : [] }
    } catch (err) {
      console.warn('[RestaurantService] Gagal memuat dari API, beralih ke cache lokal:', err.message)
      // Fallback
      let result = [...localRestaurants]
      if (params.search) {
        const q = params.search.toLowerCase()
        result = result.filter(r => r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
      }
      if (params.category && params.category !== 'Semua') {
        result = result.filter(r => r.category_name === params.category)
      }
      if (params.is_recommended !== undefined) {
        result = result.filter(r => r.is_recommended === (params.is_recommended === 'true' || params.is_recommended === true))
      }
      return { success: true, data: result, isLocalFallback: true }
    }
  }

  async getRestaurantById(id) {
    try {
      const data = await apiClient.get(`/api/restaurants/${id}`)
      return { success: true, data }
    } catch (err) {
      console.warn('[RestaurantService] Gagal getById API, fallback lokal:', err.message)
      const found = localRestaurants.find(r => r.id === id)
      if (found) return { success: true, data: found, isLocalFallback: true }
      throw new Error('Tempat makan tidak ditemukan')
    }
  }

  async createRestaurant(payload) {
    try {
      const data = await apiClient.post('/api/restaurants', payload)
      return { success: true, data }
    } catch (err) {
      console.warn('[RestaurantService] Server offline, simpan ke lokal state:', err.message)
      const newPlace = {
        ...payload,
        id: `local-place-${Date.now()}`,
        created_at: new Date().toISOString(),
        rating: 4.8,
        review_count: 1,
      }
      localRestaurants.unshift(newPlace)
      return { success: true, data: newPlace, isLocalFallback: true }
    }
  }

  async updateRestaurant(id, payload) {
    try {
      const data = await apiClient.put(`/api/restaurants/${id}`, payload)
      return { success: true, data }
    } catch (err) {
      console.warn('[RestaurantService] Server offline, update di memori lokal:', err.message)
      const idx = localRestaurants.findIndex(r => r.id === id)
      if (idx !== -1) {
        localRestaurants[idx] = { ...localRestaurants[idx], ...payload }
        return { success: true, data: localRestaurants[idx], isLocalFallback: true }
      }
      throw new Error('Gagal memperbarui data')
    }
  }

  async deleteRestaurant(id) {
    try {
      await apiClient.delete(`/api/restaurants/${id}`)
      return { success: true }
    } catch (err) {
      console.warn('[RestaurantService] Hapus dari cache lokal:', err.message)
      localRestaurants = localRestaurants.filter(r => r.id !== id)
      return { success: true, isLocalFallback: true }
    }
  }
}

export default new RestaurantService()
