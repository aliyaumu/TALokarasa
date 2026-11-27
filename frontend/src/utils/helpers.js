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

const padTime = (n) => String(n).padStart(2, '0')

/**
 * Menentukan status operasional tempat makan secara real-time berdasarkan jam buka
 * Mengembalikan:
 * - status: 'open' | 'closed' | 'coming_soon'
 * - label: 'Open Now' | 'Closed' | 'Coming Soon'
 * - detail: keterangan singkat waktu buka/tutup
 * - hoursText: teks jam operasional untuk ditampilkan
 */
export const getOperationalStatus = (openingHours, now = new Date()) => {
  const raw = String(openingHours || '').trim()
  const lower = raw.toLowerCase()

  if (!raw) {
    return {
      status: 'closed',
      label: 'Closed',
      detail: 'Jam buka belum tersedia',
      hoursText: 'Jam belum diatur',
    }
  }

  if (
    lower.includes('coming soon') ||
    lower.includes('segera') ||
    lower.includes('akan buka')
  ) {
    return {
      status: 'coming_soon',
      label: 'Coming Soon',
      detail: 'Segera dibuka',
      hoursText: raw,
    }
  }

  if (lower.includes('24 jam') || lower === '24h') {
    return {
      status: 'open',
      label: 'Open Now',
      detail: 'Buka 24 Jam',
      hoursText: raw,
    }
  }

  const rangeMatch = raw.match(
    /(\d{1,2})[:.](\d{2})\s*(?:-|–|—|s\/d|sd|to)\s*(\d{1,2})[:.](\d{2})/i
  )

  if (rangeMatch) {
    const openH = parseInt(rangeMatch[1], 10)
    const openM = parseInt(rangeMatch[2], 10)
    const closeH = parseInt(rangeMatch[3], 10)
    const closeM = parseInt(rangeMatch[4], 10)

    if (
      openH >= 0 &&
      openH <= 23 &&
      openM >= 0 &&
      openM <= 59 &&
      closeH >= 0 &&
      closeH <= 24 &&
      closeM >= 0 &&
      closeM <= 59
    ) {
      const openMin = openH * 60 + openM
      let closeMin = closeH * 60 + closeM
      if (closeMin === 0 && openMin > 0) {
        closeMin = 1440
      }

      const nowMin = now.getHours() * 60 + now.getMinutes()
      const openStr = `${padTime(openH)}:${padTime(openM)}`
      const closeStr = `${padTime(closeH)}:${padTime(closeM)}`

      if (closeMin > openMin) {
        if (nowMin >= openMin && nowMin < closeMin) {
          return {
            status: 'open',
            label: 'Open Now',
            detail: `Tutup ${closeStr}`,
            hoursText: raw,
          }
        }
        if (nowMin < openMin) {
          const diff = openMin - nowMin
          if (diff <= 120) {
            return {
              status: 'coming_soon',
              label: 'Coming Soon',
              detail: `Buka ${openStr}`,
              hoursText: raw,
            }
          }
          return {
            status: 'closed',
            label: 'Closed',
            detail: `Buka ${openStr}`,
            hoursText: raw,
          }
        }
        return {
          status: 'closed',
          label: 'Closed',
          detail: `Buka besok ${openStr}`,
          hoursText: raw,
        }
      }

      // Jadwal lintas tengah malam (misal 18:00 - 02:00)
      if (nowMin >= openMin || nowMin < closeMin) {
        return {
          status: 'open',
          label: 'Open Now',
          detail: `Tutup ${closeStr}`,
          hoursText: raw,
        }
      }
      if (openMin - nowMin <= 120) {
        return {
          status: 'coming_soon',
          label: 'Coming Soon',
          detail: `Buka ${openStr}`,
          hoursText: raw,
        }
      }
      return {
        status: 'closed',
        label: 'Closed',
        detail: `Buka ${openStr}`,
        hoursText: raw,
      }
    }
  }

  if (lower.includes('tutup') || lower.includes('closed')) {
    return {
      status: 'closed',
      label: 'Closed',
      detail: raw,
      hoursText: raw,
    }
  }

  // Fallback jika ada format jam tunggal misalnya "Buka 11:00 WIB"
  const singleMatch = raw.match(/(\d{1,2})[:.](\d{2})/)
  if (singleMatch) {
    const h = parseInt(singleMatch[1], 10)
    const m = parseInt(singleMatch[2], 10)
    const openMin = h * 60 + m
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const timeStr = `${padTime(h)}:${padTime(m)}`
    if (nowMin < openMin) {
      return {
        status: 'coming_soon',
        label: 'Coming Soon',
        detail: `Buka ${timeStr}`,
        hoursText: raw,
      }
    }
    return {
      status: 'open',
      label: 'Open Now',
      detail: `Buka sejak ${timeStr}`,
      hoursText: raw,
    }
  }

  return {
    status: 'open',
    label: 'Open Now',
    detail: raw,
    hoursText: raw,
  }
}
