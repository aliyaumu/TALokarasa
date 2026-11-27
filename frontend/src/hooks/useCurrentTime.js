import { useState, useEffect } from 'react'

/**
 * Hook waktu real-time agar indikator status buka/tutup tempat makan
 * otomatis diperbarui sesuai jam lokal pengguna tanpa perlu refresh halaman.
 */
export function useCurrentTime(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const updateClock = () => setNow(new Date())

    const timer = setInterval(updateClock, intervalMs)
    window.addEventListener('focus', updateClock)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateClock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', updateClock)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [intervalMs])

  return now
}
