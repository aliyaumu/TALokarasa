import { Utensils, Bell, LogIn, WifiOff } from 'lucide-react'

export default function Header({
  activeTab,
  onTabChange,
  userProfile,
  onOpenAuth,
  isOffline,
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left: Brand / Logo */}
        <div
          className="header-brand"
          onClick={() => onTabChange('home')}
          role="button"
          tabIndex={0}
          title="Kembali ke Beranda"
        >
          <div className="header-logo-badge">
            <Utensils size={18} color="#ffffff" />
          </div>
          <div className="header-brand-text">
            <span className="brand-title">Lokarasa</span>
            <span className="brand-subtitle">Kuliner Semarang</span>
          </div>
        </div>

        {/* Right: Actions (Notification & User / Login) */}
        <div className="header-actions">
          {isOffline && (
            <span className="badge-offline" title="Aplikasi berjalan dalam mode offline">
              <WifiOff size={13} />
              <span className="offline-text">Offline</span>
            </span>
          )}

          {/* Quick Notification Bell */}
          <button
            type="button"
            className="header-icon-btn"
            title="Notifikasi &amp; Pengaturan"
            onClick={() => onTabChange('profile')}
            aria-label="Notifikasi"
          >
            <Bell size={18} />
          </button>

          {/* Auth Button / Profile Avatar */}
          {userProfile?.isLoggedIn ? (
            <button
              type="button"
              className="header-user-btn"
              onClick={() => onTabChange('profile')}
              title={`Akun: ${userProfile.name}`}
            >
              <div className="header-avatar-circle">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="header-user-name">
                {userProfile.name ? userProfile.name.split(' ')[0] : 'User'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="header-login-btn"
              onClick={onOpenAuth}
            >
              <LogIn size={15} />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
