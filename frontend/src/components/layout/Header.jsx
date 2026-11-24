
import { Utensils, LogIn } from 'lucide-react'

export default function Header({
  activeTab,
  onTabChange,
  userProfile,
  onOpenAuth,
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onTabChange('home')
            }
          }}
        >
          <div className="header-logo-badge">
            <Utensils size={18} color="#ffffff" />
          </div>

          <div className="header-brand-text">
            <span className="brand-title">
              Lokarasa
            </span>

            <span className="brand-subtitle">
              Kuliner Semarang
            </span>
          </div>
        </div>

        {/* Right: User / Login */}
        <div className="header-actions">

          {userProfile?.isLoggedIn ? (
            <button
              type="button"
              className="header-user-btn"
              onClick={() => onTabChange('profile')}
              title={`Akun: ${userProfile.name}`}
            >
              <div className="header-avatar-circle">
                {userProfile.name
                  ? userProfile.name.charAt(0).toUpperCase()
                  : 'U'}
              </div>

              <span className="header-user-name">
                {userProfile.name
                  ? userProfile.name.split(' ')[0]
                  : 'User'}
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
