// ---------------------------------------------------------------------------
// userService.js — Identitas Pengguna & Fitur Autentikasi (Login/Register)
// Mendukung penyimpanan profil lokal (localStorage).
//
// Alur akun (data milik akun, bukan milik perangkat):
//  - Tamu (belum masuk)  -> profil "Tamu", daftar favorit & draft kosong.
//  - Masuk / Daftar      -> profil akun aktif (isLoggedIn: true). Jika akun itu pernah
//                           dipakai di perangkat ini, profil + favorit + draft + preferensi
//                           DIPULIHKAN. Favorit yang disimpan saat masih Tamu digabungkan.
//  - Keluar              -> data akun DISIMPAN (tidak dihapus) lalu tampilan kembali ke Tamu.
// ---------------------------------------------------------------------------

const USER_PROFILE_KEY = 'lokarasa_user_profile'
const USER_ID_KEY = 'lokarasa_user_id'
const FAVORITES_KEY = 'lokarasa_favorites'
const ACCOUNT_DATA_PREFIX = 'lokarasa_account_data::' // simpanan data per akun

// Akun demo: email -> nama yang dipakai saat masuk pertama kali
const DEMO_NAMES = {
  'aliya@lokarasa.id': 'Aliya Umu',
}

// Data pribadi yang mengikuti akun (ID perangkat sengaja tidak termasuk)
const PERSONAL_KEYS = [
  FAVORITES_KEY,          // daftar favorit
  'lokarasa_my_reviews',  // penanda ulasan milik pengguna
  'lokarasa_radius',      // preferensi radius
  'lokarasa_price',       // preferensi harga
]
const PERSONAL_PREFIXES = ['lokarasa_draft_'] // draft formulir tambah/edit

export const getUserIdentifier = () => {
  try {
    let id = localStorage.getItem(USER_ID_KEY)
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
      localStorage.setItem(USER_ID_KEY, id)
    }
    return id
  } catch {
    return 'user_lokarasa_guest'
  }
}

const buildGuestProfile = () => ({
  name: 'Tamu',
  email: '',
  role: 'Kuliner Explorer Semarang',
  bio: '',
  nim: '',
  avatar: null,
  favoriteCity: 'Semarang',
  userId: getUserIdentifier(),
  isLoggedIn: false,
  joinedDate: '',
})

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fallback */
  }
  return buildGuestProfile()
}

export const getCurrentUser = getUserProfile

export const saveUserProfile = (profile) => {
  try {
    const data = {
      ...profile,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))
    return { success: true, data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// ---------------------------------------------------------------------------
// Data pribadi per akun
// ---------------------------------------------------------------------------
const accountIdOf = (profile) =>
  String(profile?.email || profile?.userId || 'akun').trim().toLowerCase()

const accountDataKey = (id) => ACCOUNT_DATA_PREFIX + id

const isPersonalKey = (k) =>
  PERSONAL_KEYS.includes(k) || PERSONAL_PREFIXES.some((p) => k.startsWith(p))

// Ambil semua data pribadi yang sedang aktif: { kunci: nilai }
const collectPersonalEntries = () => {
  const entries = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && isPersonalKey(k)) entries[k] = localStorage.getItem(k)
  }
  return entries
}

// Hapus data pribadi yang sedang aktif dari tampilan (tidak menyentuh simpanan akun)
export const clearPersonalData = () => {
  try {
    Object.keys(collectPersonalEntries()).forEach((k) => localStorage.removeItem(k))
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

const readAccountData = (id) => {
  try {
    const raw = localStorage.getItem(accountDataKey(id))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const parseList = (raw) => {
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

// Gabungkan dua daftar favorit tanpa duplikat (kunci: id, atau nama)
const mergeFavorites = (primaryRaw, extraRaw) => {
  const seen = new Set()
  const out = []
  ;[...parseList(primaryRaw), ...parseList(extraRaw)].forEach((item) => {
    const key = String(item?.id ?? item?.name ?? '')
    if (key && !seen.has(key)) {
      seen.add(key)
      out.push(item)
    }
  })
  return JSON.stringify(out)
}

export const loginUser = async (email, password) => {
  // Simulasi autentikasi (tersimpan lokal)
  if (!email || !password) {
    return { success: false, message: 'Email dan kata sandi wajib diisi.' }
  }
  if (password.length < 6) {
    return { success: false, message: 'Kata sandi minimal 6 karakter.' }
  }

  const cleanEmail = email.trim()
  const key = cleanEmail.toLowerCase()
  const saved = readAccountData(key)

  // Favorit yang disimpan saat masih Tamu
  const guestFavorites = localStorage.getItem(FAVORITES_KEY)

  let profile
  if (saved?.profile) {
    // Akun lama di perangkat ini -> pulihkan data
    profile = { ...saved.profile, isLoggedIn: true }
    try {
      Object.entries(saved.entries || {}).forEach(([k, v]) => {
        if (k === FAVORITES_KEY) {
          localStorage.setItem(k, mergeFavorites(v, guestFavorites))
        } else {
          localStorage.setItem(k, v)
        }
      })
      localStorage.removeItem(accountDataKey(key)) // data aktif jadi sumber utama
    } catch {
      /* penyimpanan penuh: lanjutkan dengan profil saja */
    }
  } else {
    // Akun baru di perangkat ini (favorit Tamu ikut terbawa)
    const namePart = cleanEmail.split('@')[0]
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)
    profile = {
      ...buildGuestProfile(),
      name: DEMO_NAMES[key] || formattedName,
      email: cleanEmail,
      bio: 'Penjelajah cita rasa kuliner khas Kota Semarang.',
      joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      isLoggedIn: true,
    }
  }

  saveUserProfile(profile)
  return { success: true, data: profile }
}

export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    return { success: false, message: 'Semua field pendaftaran wajib diisi.' }
  }
  if (password.length < 6) {
    return { success: false, message: 'Kata sandi minimal 6 karakter.' }
  }

  const newProfile = {
    name: name.trim(),
    email: email.trim(),
    role: 'Kuliner Explorer Semarang',
    bio: 'Penjelajah cita rasa kuliner khas Kota Semarang.',
    nim: '',
    avatar: null,
    favoriteCity: 'Semarang',
    userId: getUserIdentifier(),
    isLoggedIn: true,
    joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
  }

  saveUserProfile(newProfile)
  return { success: true, data: newProfile }
}

export const logoutUser = () => {
  const current = getUserProfile()

  // Sudah Tamu: tidak ada yang perlu disimpan atau dibersihkan
  if (!current.isLoggedIn) return { success: true, data: current }

  // 1) Simpan data akun (profil + favorit + draft + preferensi)
  try {
    localStorage.setItem(
      accountDataKey(accountIdOf(current)),
      JSON.stringify({
        profile: current,
        entries: collectPersonalEntries(),
        savedAt: new Date().toISOString(),
      })
    )
  } catch {
    // Jangan keluar kalau datanya gagal disimpan (mencegah data hilang)
    return {
      success: false,
      message: 'Penyimpanan perangkat penuh, data akun gagal disimpan. Hapus foto profil atau draft lalu coba lagi.',
    }
  }

  // 2) Kosongkan tampilan: kembali menjadi Tamu
  clearPersonalData()
  const res = saveUserProfile(buildGuestProfile())
  return { success: res.success, data: res.data }
}

export default {
  getUserIdentifier,
  getUserProfile,
  getCurrentUser,
  saveUserProfile,
  loginUser,
  registerUser,
  logoutUser,
  clearPersonalData,
}