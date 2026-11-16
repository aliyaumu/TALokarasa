// ---------------------------------------------------------------------------
// helpers.js — Fungsi utilitas untuk Lokarasa PWA
// ---------------------------------------------------------------------------

/**
 * Format angka ke mata uang Rupiah (IDR)
 */
export const formatRupiah = (number) => {
  const num = Number(number)
  if (Number.isNaN(num) || num === 0) return 'Gratis / Menyesuaikan'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Pencarian teks case-insensitive pada nama, deskripsi, alamat, dan menu
 */
export const matchesSearch = (item, query) => {
  if (!query) return true
  const q = query.toLowerCase()
  const nameMatch = (item.name || '').toLowerCase().includes(q)
  const descMatch = (item.description || '').toLowerCase().includes(q)
  const addrMatch = (item.address || '').toLowerCase().includes(q)
  const menuMatch = Array.isArray(item.signature_menu) &&
    item.signature_menu.some(m => String(m).toLowerCase().includes(q))
  return nameMatch || descMatch || addrMatch || menuMatch
}

/**
 * Filter berdasarkan kategori
 */
export const matchesCategory = (item, category) => {
  if (!category || category === 'Semua') return true
  return (
    (item.category_name || '').toLowerCase() === category.toLowerCase() ||
    (item.category_id || '').toLowerCase() === category.toLowerCase()
  )
}

/**
 * Pengurutan (sorting) item restoran
 */
export const sortRestaurants = (items, key = 'rating', order = 'desc') => {
  const sorted = [...items].sort((a, b) => {
    if (key === 'rating') {
      return (Number(a.rating) || 0) - (Number(b.rating) || 0)
    }
    if (key === 'avg_price') {
      return (Number(a.avg_price) || 0) - (Number(b.avg_price) || 0)
    }
    if (key === 'name') {
      return String(a.name || '').localeCompare(String(b.name || ''))
    }
    return 0
  })

  return order === 'desc' ? sorted.reverse() : sorted
}

/**
 * Memotong teks dengan elipsis
 */
export const truncate = (str, max = 80) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}

/**
 * Mengambil daftar kategori unik dari list restoran
 */
export const extractCategories = (items) => {
  const set = new Set()
  items.forEach((item) => {
    if (item.category_name) set.add(item.category_name)
  })
  return ['Semua', ...Array.from(set).sort()]
}

/**
 * Menghitung rating rata-rata ulasan
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 4.5
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
