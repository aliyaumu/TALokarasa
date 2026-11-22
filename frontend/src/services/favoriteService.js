// ---------------------------------------------------------------------------
// favoriteService.js — Kelola Restoran Favorit / Tersimpan via localStorage
// ---------------------------------------------------------------------------

const FAV_KEY = 'lokarasa_favorites'

class FavoriteService {
  getFavorites() {
    try {
      const raw = localStorage.getItem(FAV_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  toggleFavorite(restaurant) {
    try {
      const current = this.getFavorites()
      const targetId = restaurant.id || restaurant.name
      const idx = current.findIndex(
        (item) => String(item.id || item.name) === String(targetId)
      )

      let isFavorited = false
      if (idx === -1) {
        current.unshift(restaurant)
        isFavorited = true
      } else {
        current.splice(idx, 1)
        isFavorited = false
      }

      localStorage.setItem(FAV_KEY, JSON.stringify(current))
      return { success: true, isFavorited, total: current.length }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  removeFavorite(restaurantId) {
    try {
      const current = this.getFavorites()
      const filtered = current.filter(
        (item) => String(item.id || item.name) !== String(restaurantId)
      )
      localStorage.setItem(FAV_KEY, JSON.stringify(filtered))
      return { success: true, total: filtered.length }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  isFavorited(restaurantId) {
    const current = this.getFavorites()
    return current.some(
      (item) => String(item.id || item.name) === String(restaurantId)
    )
  }
}

export default new FavoriteService()
