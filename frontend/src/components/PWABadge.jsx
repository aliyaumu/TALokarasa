import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (dismissed) return null

  // Offline status notification
  if (isOffline) {
    return (
      <aside className="pwa-toast pwa-toast--offline" role="status" aria-live="polite">
        <WifiOff size={18} />
        <span>Sedang offline. Data tempat makan diambil dari cache lokal.</span>
      </aside>
    )
  }

  // PWA Install Prompt Banner
  if (installPrompt && !installed) {
    return (
      <aside className="pwa-toast pwa-toast--install" role="region" aria-label="Instal Aplikasi">
        <div className="pwa-toast-body">
          <Download size={18} className="pwa-toast-icon" />
          <span>Pasang <strong>Lokarasa</strong> di layar utama smartphone untuk akses offline cepat!</span>
        </div>
        <div className="pwa-toast-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleInstallClick}
          >
            Instal
          </button>
          <button
            type="button"
            className="pwa-toast-close"
            onClick={() => setDismissed(true)}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}
