import { apiClient } from '../config/api'

// ID ulasan yang ditulis dari perangkat ini (hanya ini yang boleh dihapus)
const MY_REVIEWS_KEY = 'lokarasa_my_reviews'

const readMine = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(MY_REVIEWS_KEY))
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

const writeMine = (ids) => {
  try {
    localStorage.setItem(MY_REVIEWS_KEY, JSON.stringify(ids))
  } catch {
    /* penyimpanan penuh / diblokir: abaikan */
  }
}

const rememberMine = (id) => {
  if (id == null) return
  const ids = readMine()
  if (!ids.includes(String(id))) writeMine([...ids, String(id)])
}

const forgetMine = (id) => writeMine(readMine().filter((x) => x !== String(id)))

// In-memory fallback reviews (Semarang Edition)
let localReviews = [
  {
    id: "rev-1",
    restaurant_id: "d2010000-0000-0000-0000-000000000001",
    user_name: "Aliya Putri",
    rating: 5,
    comment: "Creamy mala-nya juara banget! Bumbunya medok dan pedas chili oil-nya nagih, porsinya pas untuk makan siang.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "rev-2",
    restaurant_id: "d2010000-0000-0000-0000-000000000001",
    user_name: "Bagus Wicaksono",
    rating: 5,
    comment: "Dimsum kuah creamy sama mie chili oil Singapore wajib dipesan. Tempatnya estetik dan pelayanannya cepat.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "rev-3",
    restaurant_id: "d2010000-0000-0000-0000-000000000002",
    user_name: "Dinda Larasati",
    rating: 5,
    comment: "Misoa kuah komplit bener-bener comforting! Kuah kaldunya gurih segar dan pangsit cabainya mantap.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-4",
    restaurant_id: "d2010000-0000-0000-0000-000000000003",
    user_name: "Rian Hidayat",
    rating: 4,
    comment: "Warung Budhe selalu jadi penyelamat akhir bulan anak Tembalang. Masakan mangut ikan sama opor ayamnya mantap.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "rev-5",
    restaurant_id: "d2010000-0000-0000-0000-000000000004",
    user_name: "Siti Nurhaliza",
    rating: 5,
    comment: "Kremesannya melimpah ruah dan super renyah! Sambal korek bawangnya nampol abis, ayamnya empuk gurih.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev-6",
    restaurant_id: "d2010000-0000-0000-0000-000000000005",
    user_name: "Fajar Ramadhan",
    rating: 5,
    comment: "Bakmi Serangkai salah satu mie yamin terenak di Semarang. Tekstur mienya kenyal dan charsiu ayamnya gurih manis.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "rev-7",
    restaurant_id: "d2010000-0000-0000-0000-000000000006",
    user_name: "Kevin Sanjaya",
    rating: 5,
    comment: "Gyu Nikudon dagingnya lembut bumbunya meresap sampai ke nasi. Telur onsennya meleleh sempurna!",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "rev-8",
    restaurant_id: "d2010000-0000-0000-0000-000000000007",
    user_name: "Ibu Ratna",
    rating: 5,
    comment: "Lumpia Gang Lombok memang nomor satu di Semarang, rebungnya manis tidak pesing sama sekali.",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
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
      rememberMine(data?.id)
      return { success: true, data }
    } catch {
      const newReview = {
        id: `rev-${Date.now()}`,
        restaurant_id: payload.restaurant_id,
        user_name: payload.user_name || 'Penjelajah Rasa Semarang',
        rating: Number(payload.rating) || 5,
        comment: payload.comment || '',
        created_at: new Date().toISOString(),
      }
      localReviews.unshift(newReview)
      rememberMine(newReview.id)
      return { success: true, data: newReview, isLocalFallback: true }
    }
  }

  // Apakah ulasan ini ditulis dari perangkat ini?
  isMine(id) {
    return readMine().includes(String(id))
  }

  async deleteReview(id) {
    // Ulasan lokal (dibuat saat offline / data contoh) tidak ada di server
    if (String(id).startsWith('rev-')) {
      localReviews = localReviews.filter((r) => String(r.id) !== String(id))
      forgetMine(id)
      return { success: true, isLocalFallback: true }
    }
    try {
      await apiClient.delete(`/api/reviews/${id}`)
      forgetMine(id)
      return { success: true }
    } catch (err) {
      // Server menjawab dengan error (404/500, dll): jangan pura-pura berhasil
      if (err?.status) throw new Error(err.message || 'Gagal menghapus ulasan')
      // Server tidak terjangkau: hapus dari cache lokal saja
      localReviews = localReviews.filter((r) => String(r.id) !== String(id))
      forgetMine(id)
      return { success: true, isLocalFallback: true }
    }
  }
}

export default new ReviewService()