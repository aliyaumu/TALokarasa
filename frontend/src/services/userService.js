// ---------------------------------------------------------------------------
// userService.js — Identitas Pengguna & Fitur Autentikasi (Login/Register)
// Mendukung penyimpanan profil lokal dan integrasi Supabase Auth
// ---------------------------------------------------------------------------

const USER_SESSION_KEY = 'lokarasa_user_session'
const USER_PROFILE_KEY = 'lokarasa_user_profile'
const USER_ID_KEY = 'lokarasa_user_id'

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

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fallback */
  }

  return {
    name: 'Saraswati Putri',
    email: 'saras@lokarasa.id',
    role: 'Kuliner Explorer Semarang',
    bio: 'Pencinta kuliner Semarang: Kedai Tinari, Bakmi Serangkai, dan pemburu hidden gem kuliner Tembalang & Banyumanik!',
    avatar: null,
    favoriteCity: 'Semarang',
    userId: getUserIdentifier(),
    isLoggedIn: true,
    joinedDate: 'November 2026',
  }
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

export const loginUser = async (email, password) => {
  // Simple auth simulation / local persistence
  if (!email || !password) {
    return { success: false, message: 'Email dan kata sandi wajib diisi.' }
  }
  if (password.length < 6) {
    return { success: false, message: 'Kata sandi minimal 6 karakter.' }
  }

  const namePart = email.split('@')[0]
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)

  const currentProfile = getUserProfile()
  const updatedProfile = {
    ...currentProfile,
    email,
    name: currentProfile.name || formattedName,
    isLoggedIn: true,
  }

  saveUserProfile(updatedProfile)
  return { success: true, data: updatedProfile }
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
  const current = getUserProfile()
  const loggedOut = {
    ...current,
    isLoggedIn: false,
  }
  saveUserProfile(loggedOut)
  return { success: true }
}

export default {
  getUserIdentifier,
  getUserProfile,
  getCurrentUser,
  saveUserProfile,
  loginUser,
  registerUser,
  logoutUser,
}
