import axios from 'axios'

// ---------------------------------------------------------------------------
// Base URL Configuration
// Mengambil dari .env (VITE_API_BASE_URL), fallback ke localhost:5000
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 detik timeout
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response Interceptor — normalisasi respons dan error
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Terjadi kendala pada jaringan.'
    let status = null

    if (error.response) {
      status = error.response.status
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${status})`
    } else if (error.request) {
      message = 'Tidak dapat menghubungi server backend. Menjalankan mode offline.'
    } else {
      message = error.message || message
    }

    return Promise.reject({
      message,
      status,
      raw: error.response?.data,
    })
  }
)

export { apiClient, BASE_URL }
