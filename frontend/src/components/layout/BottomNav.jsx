import { Home, Compass, Heart, User } from 'lucide-react'

/**
 * BottomNav — Bottom Navigation Bar khusus aplikasi mobile PWA
 * Memenuhi syarat: "2. Memiliki Bottom Navigation Bar."
 * Tampilan & Ikon disesuaikan dengan Mockup UI (Beranda, Explore, Favorit, Profile)
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
    <nav className="bottom-nav" aria-label="Navigasi Utama">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

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
