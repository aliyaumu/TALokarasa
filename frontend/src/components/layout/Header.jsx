import { Utensils, Bell, LayoutGrid, Heart, Compass, Home, User, PlusCircle, LogIn, WifiOff } from 'lucide-react'

export default function Header({
  activeTab,
  onTabChange,
  favCount = 0,
  userProfile,
  onOpenAuth,
  isOffline,
  onNavigateAdd,
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left: Brand / Logo */}
        <div className="header-brand" onClick={() => onTabChange('home')} role="button" tabIndex={0}>
          <div className="header-logo-badge">
            <Utensils size={18} color="#ffffff" />
          </div>
          <div className="header-brand-text">
            <span className="brand-title">Lokarasa</span>
            <span className="brand-subtitle">Semarang Foodie</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar (Visible on Web / Desktop >= 768px) */}
        <nav className="desktop-nav" aria-label="Navigasi Desktop">
          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            <Home size={16} />
            <span>Beranda</span>
          </button>
          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => onTabChange('explore')}
          >
            <Compass size={16} />
            <span>Explore</span>
          </button>
          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => onTabChange('favorites')}
          >
            <Heart size={16} />
            <span>Favorit</span>
            {favCount > 0 && <span className="nav-pill-badge">{favCount}</span>}
          </button>
          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => onTabChange('add')}
          >
            <PlusCircle size={16} />
            <span>Tambah Rekomendasi</span>
          </button>
          <button
            type="button"
            className={`desktop-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => onTabChange('profile')}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
        </nav>

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
            title="Notifikasi"
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
