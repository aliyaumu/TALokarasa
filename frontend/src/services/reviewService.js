import { apiClient } from '../config/api'

// In-memory fallback reviews
let localReviews = [
  {
    id: "rev-1",
    restaurant_id: "r2010000-0000-0000-0000-000000000001",
    user_name: "Budi Santoso",
    rating: 5,
    comment: "Gudegnya manis gurih pas banget di lidah, kreceknya pedas nikmat! Wajib mampir kalau ke Jogja.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "rev-2",
    restaurant_id: "r2010000-0000-0000-0000-000000000001",
    user_name: "Siti Rahmawati",
    rating: 5,
    comment: "Packaging rapi dan tahan dibawa keluar kota. Rasanya konsisten sejak dulu.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "rev-3",
    restaurant_id: "r2010000-0000-0000-0000-000000000002",
    user_name: "Dimas Pratama",
    rating: 5,
    comment: "Pisang gorengnya legendaris, kopi klotok panas sambil lihat sawah bener-bener healing!",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-4",
    restaurant_id: "r2010000-0000-0000-0000-000000000002",
    user_name: "Ayu Lestari",
    rating: 4,
    comment: "Suasananya juara, antreannya memang ramai tapi sebanding dengan rasa makanannya.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "rev-5",
    restaurant_id: "r2010000-0000-0000-0000-000000000003",
    user_name: "Hendra Gunawan",
    rating: 5,
    comment: "Daging kambingnya empuk banget dan bumbu meresap sempurna karena tusuk jerujinya.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev-6",
    restaurant_id: "r2010000-0000-0000-0000-000000000007",
    user_name: "Rina Wulandari",
    rating: 5,
    comment: "Pilihan sambalnya banyak banget, pedasnya mantap dan harganya sangat ramah di kantong mahasiswa!",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
]

class ReviewService {
  async getReviews(restaurantId) {
    try {
      const data = await apiClient.get(`/api/reviews/restaurant/${restaurantId}`)
      return { success: true, data: Array.isArray(data) ? data : [] }
    } catch {
      const filtered = localReviews.filter(r => String(r.restaurant_id) === String(restaurantId))
      return { success: true, data: filtered, isLocalFallback: true }
    }
  }

  async createReview(payload) {
    try {
      const data = await apiClient.post('/api/reviews', payload)
      return { success: true, data }
    } catch {
      const newReview = {
        id: `rev-${Date.now()}`,
        restaurant_id: payload.restaurant_id,
        user_name: payload.user_name || 'Penjelajah Rasa',
        rating: Number(payload.rating) || 5,
        comment: payload.comment || '',
        created_at: new Date().toISOString(),
      }
      localReviews.unshift(newReview)
      return { success: true, data: newReview, isLocalFallback: true }
    }
  }
}

export default new ReviewService()
