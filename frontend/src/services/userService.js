// ---------------------------------------------------------------------------
// userService.js — Identitas Pengguna & Fitur Autentikasi (Login/Register)
// Mendukung penyimpanan profil lokal (localStorage).
//
// Alur akun:
//  - Tamu (belum masuk)  -> profil "Tamu", tanpa foto/bio.
//  - Masuk / Daftar      -> profil akun aktif (isLoggedIn: true).
//  - Keluar              -> SEMUA data pribadi di perangkat dihapus (profil, favorit,
//                           draft formulir, penanda ulasan, preferensi) dan tampilan
//                           kembali menjadi Tamu.
// ---------------------------------------------------------------------------

const USER_PROFILE_KEY = 'lokarasa_user_profile'
const USER_ID_KEY = 'lokarasa_user_id'

// Akun demo: email -> nama yang dipakai saat masuk pertama kali
const DEMO_NAMES = {
  'aliya@lokarasa.id': 'Aliya Umu',
}

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

// Data pribadi yang dihapus saat keluar (ID perangkat sengaja dipertahankan)
const PERSONAL_KEYS = [
  'lokarasa_favorites',   // daftar favorit
  'lokarasa_my_reviews',  // penanda ulasan milik pengguna
  'lokarasa_radius',      // preferensi radius
  'lokarasa_price',       // preferensi harga
]
const PERSONAL_PREFIXES = ['lokarasa_draft_'] // draft formulir tambah/edit

export const clearPersonalData = () => {
  try {
    const stale = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && PERSONAL_PREFIXES.some((p) => k.startsWith(p))) stale.push(k)
    }
    stale.forEach((k) => localStorage.removeItem(k))
    PERSONAL_KEYS.forEach((k) => localStorage.removeItem(k))
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
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

  // Akun baru di perangkat ini
  const namePart = cleanEmail.split('@')[0]
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)

  const profile = {
    ...buildGuestProfile(),
    name: DEMO_NAMES[key] || formattedName,
    email: cleanEmail,
    bio: 'Penjelajah cita rasa kuliner khas Kota Semarang.',
    joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    isLoggedIn: true,
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
  // Hapus semua data pribadi, lalu kembali menjadi Tamu
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