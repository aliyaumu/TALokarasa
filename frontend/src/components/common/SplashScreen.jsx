import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react'
import './SplashScreen.css'

export default function SplashScreen({ onFinish, duration = 2800 }) {
  const [isFading, setIsFading] = useState(false)
  const dismissedRef = useRef(false)

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setIsFading(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 500)
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleDismiss])

  return (
    <div
      className={`splash-overlay ${isFading ? 'splash-overlay--fade' : ''}`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div className="splash-ambient-glow" />

      <div className="splash-content">
        <div className="splash-emblem">
          <div className="splash-icon-ring">
            <UtensilsCrossed size={48} className="splash-icon" />
          </div>
          <Sparkles size={24} className="splash-sparkle" />
        </div>

        <h1 className="splash-title">LOKARASA</h1>
        <p className="splash-subtitle">Eksplorasi &amp; Rekomendasi Kuliner Mobile</p>
        <span className="splash-tag">PWA Edition · Modul Praktikum PPB</span>

        <button
          type="button"
          className="splash-cta"
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
        >
          <span>Mulai Eksplorasi</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
