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

const MONTH_NAME_MAP = {
  jan: 0, januari: 0, january: 0,
  feb: 1, februari: 1, february: 1,
  mar: 2, maret: 2, march: 2,
  apr: 3, april: 3,
  mei: 4, may: 4,
  jun: 5, juni: 5, june: 5,
  jul: 6, juli: 6, july: 6,
  agu: 7, ags: 7, agustus: 7, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  okt: 9, oktober: 9, oct: 9, october: 9,
  nov: 10, november: 10,
  des: 11, desember: 11, dec: 11, december: 11,
}

const SHORT_MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

/**
 * Mengurai tanggal dari input YYYY-MM-DD atau teks seperti "05 Des 2026" / "05/12/2026"
 */
export const parseDateFromText = (text) => {
  const str = String(text || '').trim()
  if (!str) return null

  const isoMatch = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10)
    const m = parseInt(isoMatch[2], 10) - 1
    const d = parseInt(isoMatch[3], 10)
    const dt = new Date(y, m, d)
    if (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) return dt
  }

  const dmyMatch = str.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10)
    const m = parseInt(dmyMatch[2], 10) - 1
    const y = parseInt(dmyMatch[3], 10)
    const dt = new Date(y, m, d)
    if (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) return dt
  }

  const wordMatch = str.match(
    /(\d{1,2})\s+(Jan(?:uari|uary)?|Feb(?:ruari|ruary)?|Mar(?:et|ch)?|Apr(?:il)?|Mei|May|Jun(?:i|e)?|Jul(?:i|y)?|Agu(?:stus)?|Ags|Aug(?:ust)?|Sep(?:t|tember)?|Okt(?:ober)?|Oct(?:ober)?|Nov(?:ember)?|Des(?:ember)?|Dec(?:ember)?)\s+(\d{4})/i
  )
  if (wordMatch) {
    const d = parseInt(wordMatch[1], 10)
    const m = MONTH_NAME_MAP[wordMatch[2].toLowerCase()]
    const y = parseInt(wordMatch[3], 10)
    if (m !== undefined) {
      const dt = new Date(y, m, d)
      if (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) return dt
    }
  }

  return null
}

export const toIsoDateString = (dt) => {
  if (!(dt instanceof Date) || Number.isNaN(dt.getTime())) return ''
  return `${dt.getFullYear()}-${padTime(dt.getMonth() + 1)}-${padTime(dt.getDate())}`
}

export const formatIndonesianDate = (dateOrStr) => {
  const dt = dateOrStr instanceof Date ? dateOrStr : parseDateFromText(dateOrStr)
  if (!dt) return ''
  return `${padTime(dt.getDate())} ${SHORT_MONTHS_ID[dt.getMonth()]} ${dt.getFullYear()}`
}

export const stripOpeningDatePrefix = (hoursStr) => {
  return String(hoursStr || '')
    .replace(/^(?:Coming Soon(?:\s*\([^)]*\))?|Buka\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}|Buka\s+\d{4}-\d{2}-\d{2}|Buka\s+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\s*[•\-–]?\s*/i, '')
    .trim()
}

export const applyOpeningDateToHours = (hoursStr, isoDate) => {
  const cleanHours = stripOpeningDatePrefix(hoursStr)
  if (!isoDate) return cleanHours || '10:00 - 21:00 WIB'
  const dateText = formatIndonesianDate(isoDate)
  if (!dateText) return cleanHours || '10:00 - 21:00 WIB'
  return cleanHours ? `Buka ${dateText} • ${cleanHours}` : `Buka ${dateText}`
}

/**
 * Menentukan status operasional tempat makan secara real-time berdasarkan jam buka & tanggal buka
 * - Open Now (hijau): sedang buka saat ini berdasarkan jam operasional harian
 * - Closed (merah): sedang tutup (di luar jam buka harian, sebelum jam buka hari ini, atau setelah jam tutup)
 * - Coming Soon (kuning): toko baru yang akan buka di tanggal mendatang (> hari ini) atau bertanda Coming Soon
 */
export const getOperationalStatus = (openingHours, now = new Date(), openingDate = null) => {
  const raw = String(openingHours || '').trim()
  const lower = raw.toLowerCase()

  const parsedTargetDate = parseDateFromText(openingDate) || parseDateFromText(raw)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // 1. Jika ada tanggal buka di masa depan (> hari ini) -> Coming Soon
  if (parsedTargetDate) {
    const targetMidnight = new Date(
      parsedTargetDate.getFullYear(),
      parsedTargetDate.getMonth(),
      parsedTargetDate.getDate()
    )
    if (targetMidnight > todayMidnight) {
      const dateText = formatIndonesianDate(parsedTargetDate)
      return {
        status: 'coming_soon',
        label: 'Coming Soon',
        detail: `Buka ${dateText}`,
        hoursText: raw || `Buka ${dateText}`,
      }
    }
  }

  if (!raw) {
    return {
      status: 'closed',
      label: 'Closed',
      detail: 'Jam buka belum tersedia',
      hoursText: 'Jam belum diatur',
    }
  }

  // 2. Jika eksplisit bertuliskan Coming Soon / Segera Buka tanpa tanggal masa lalu/hari ini
  if (
    !parsedTargetDate &&
    (lower.includes('coming soon') || lower.includes('segera') || lower.includes('akan buka'))
  ) {
    return {
      status: 'coming_soon',
      label: 'Coming Soon',
      detail: 'Segera dibuka',
      hoursText: raw,
    }
  }

  // 3. Buka 24 Jam
  if (lower.includes('24 jam') || lower === '24h') {
    return {
      status: 'open',
      label: 'Open Now',
      detail: 'Buka 24 Jam',
      hoursText: raw,
    }
  }

  // 4. Evaluasi rentang jam operasional harian (Open Now vs Closed)
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
        status: 'closed',
        label: 'Closed',
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
