import { apiClient } from '../config/api'
import { INITIAL_CATEGORIES } from '../data/initialRestaurants'

class CategoryService {
  async getCategories() {
    try {
      const data = await apiClient.get('/api/categories')
      return { success: true, data: Array.isArray(data) ? data : [] }
    } catch {
      return { success: true, data: INITIAL_CATEGORIES, isLocalFallback: true }
    }
  }
}

export default new CategoryService()
