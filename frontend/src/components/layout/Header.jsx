import { MapPin, Utensils } from 'lucide-react'

export default function Header({ isOffline }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-logo-badge">
            <Utensils size={20} color="#ffffff" />
          </div>
          <div className="header-brand-text">
            <span className="brand-title">LOKARASA</span>
            <span className="brand-subtitle">
              <MapPin size={11} className="inline-icon" /> Kuliner Semarang &amp; Sekitarnya
            </span>
          </div>
        </div>

        {isOffline && (
          <span className="badge-offline">Offline Mode</span>
        )}
      </div>
    </header>
  )
}
