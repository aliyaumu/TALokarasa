import { Home, Compass, Plus, Heart, User } from 'lucide-react'

/**
 * BottomNav — Bottom Navigation Bar khusus PWA
 * Memenuhi syarat: "2. Memiliki Bottom Navigation Bar."
 * Memiliki 5 Tab utama: Beranda, Explore, + Tambah (CRUD), Favorit, Profile
 */
export default function BottomNav({ activeTab, onTabChange, favCount = 0 }) {
  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'add',
      label: 'Tambah',
      icon: Plus,
      isAction: true,
    },
    {
      id: 'favorites',
      label: 'Favorit',
      icon: Heart,
      badge: favCount,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ]

  return (
    <nav className="bottom-nav" aria-label="Navigasi Utama PWA">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                type="button"
                className={`bottom-nav-action-btn ${isActive ? 'bottom-nav-action-btn--active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-label="Tambah Rekomendasi Tempat Makan (CRUD)"
                title="Tambah Tempat Makan"
              >
                <div className="bottom-action-circle">
                  <Icon size={24} strokeWidth={2.8} />
                </div>
                <span className="bottom-nav-label">Tambah</span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              type="button"
              className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-selected={isActive}
            >
              <div className="bottom-nav-icon-wrap">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="bottom-nav-badge">{tab.badge}</span>
                )}
              </div>
              <span className="bottom-nav-label">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
