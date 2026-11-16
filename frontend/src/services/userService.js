// ---------------------------------------------------------------------------
// userService.js — Identitas pengguna & profil penikmat kuliner
// Menyimpan data nama, avatar, bio foodie, dan ID unik ke localStorage
// ---------------------------------------------------------------------------

const USER_ID_KEY = 'lokarasa_user_id'
const USER_PROFILE_KEY = 'lokarasa_user_profile'

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
    /* fallback to default */
  }

  return {
    name: 'Aliya Foodie',
    role: 'Kuliner Explorer Semarang',
    bio: 'Pencinta kuliner Semarang: Kedai Tinari, Bakmi Serangkai, dan pemburu hidden gem kuliner Tembalang & Banyumanik!',
    avatar: null,
    favoriteCity: 'Semarang',
    userId: getUserIdentifier(),
    joinedDate: 'November 2026',
  }
}

export const saveUserProfile = (profile) => {
  try {
    const data = {
      ...profile,
      userId: getUserIdentifier(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))
    return { success: true, data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export default {
  getUserIdentifier,
  getUserProfile,
  saveUserProfile,
}
