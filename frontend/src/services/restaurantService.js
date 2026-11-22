import { apiClient } from '../config/api'
import { INITIAL_RESTAURANTS } from '../data/initialRestaurants'

const LOCAL_STORAGE_KEY = 'lokarasa_user_added_restaurants'

const getStoredCustomRestaurants = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveCustomRestaurant = (resto) => {
  try {
    const list = getStoredCustomRestaurants()
    const updated = [resto, ...list.filter((r) => r.id !== resto.id && r.name !== resto.name)]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

const deleteStoredCustomRestaurant = (id) => {
  try {
    const list = getStoredCustomRestaurants()
    const updated = list.filter((r) => r.id !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to delete from localStorage:', err)
  }
}

// Fallback in-memory list
let localRestaurants = [...INITIAL_RESTAURANTS]

class RestaurantService {
  async getRestaurants(params = {}) {
    const customRestos = getStoredCustomRestaurants()

    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      )
      const data = await apiClient.get('/api/restaurants', { params: cleanParams })
      const serverList = Array.isArray(data) ? data : []

      // Merge user-created restaurants at the top if not already in serverList
      const existingIds = new Set(serverList.map((r) => String(r.id || r.name)))
      const missingCustom = customRestos.filter((r) => !existingIds.has(String(r.id || r.name)))

      const combined = [...missingCustom, ...serverList]
      return { success: true, data: combined }
    } catch (err) {
      console.warn('[RestaurantService] Beralih ke data lokal:', err.message)
      // Fallback: Combine custom stored with initial restaurants
      const existingIds = new Set(localRestaurants.map((r) => String(r.id || r.name)))
      const missingCustom = customRestos.filter((r) => !existingIds.has(String(r.id || r.name)))

      let result = [...missingCustom, ...localRestaurants]
      if (params.search) {
        const q = params.search.toLowerCase()
        result = result.filter(
          (r) => r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
        )
      }
      if (params.category && params.category !== 'Semua') {
        result = result.filter((r) => r.category_name === params.category)
      }
      if (params.is_recommended !== undefined) {
        result = result.filter(
          (r) =>
            r.is_recommended ===
            (params.is_recommended === 'true' || params.is_recommended === true)
        )
      }
      return { success: true, data: result, isLocalFallback: true }
    }
  }

  async getRestaurantById(id) {
    const customRestos = getStoredCustomRestaurants()
    const inCustom = customRestos.find((r) => String(r.id) === String(id))
    if (inCustom) return { success: true, data: inCustom }

    try {
      const data = await apiClient.get(`/api/restaurants/${id}`)
      return { success: true, data }
    } catch (err) {
      console.warn('[RestaurantService] Gagal getById API, fallback lokal:', err.message)
      const found = localRestaurants.find((r) => String(r.id) === String(id))
      if (found) return { success: true, data: found, isLocalFallback: true }
      throw new Error('Tempat makan tidak ditemukan')
    }
  }

  async createRestaurant(payload) {
    const newPlace = {
      ...payload,
      id: payload.id || `resto-custom-${Date.now()}`,
      created_at: new Date().toISOString(),
      rating: Number(payload.rating) || 4.9,
      review_count: 1,
      is_recommended: payload.is_recommended !== undefined ? Boolean(payload.is_recommended) : true,
    }

    // Always persist to localStorage for instant availability
    saveCustomRestaurant(newPlace)
    localRestaurants.unshift(newPlace)

    try {
      const data = await apiClient.post('/api/restaurants', payload)
      if (data && data.id) {
        saveCustomRestaurant(data)
      }
      return { success: true, data: data || newPlace }
    } catch (err) {
      console.warn('[RestaurantService] Server offline, tersimpan di penyimpanan lokal:', err.message)
      return { success: true, data: newPlace, isLocalFallback: true }
    }
  }

  async updateRestaurant(id, payload) {
    saveCustomRestaurant({ ...payload, id })

    try {
      const data = await apiClient.put(`/api/restaurants/${id}`, payload)
      return { success: true, data }
    } catch (err) {
      console.warn('[RestaurantService] Update di memori lokal:', err.message)
      const idx = localRestaurants.findIndex((r) => String(r.id) === String(id))
      if (idx !== -1) {
        localRestaurants[idx] = { ...localRestaurants[idx], ...payload }
        return { success: true, data: localRestaurants[idx], isLocalFallback: true }
      }
      return { success: true, data: { ...payload, id }, isLocalFallback: true }
    }
  }

  async deleteRestaurant(id) {
    deleteStoredCustomRestaurant(id)
    localRestaurants = localRestaurants.filter((r) => String(r.id) !== String(id))

    try {
      await apiClient.delete(`/api/restaurants/${id}`)
      return { success: true }
    } catch (err) {
      console.warn('[RestaurantService] Hapus dari cache lokal:', err.message)
      return { success: true, isLocalFallback: true }
    }
  }
}

export default new RestaurantService()
