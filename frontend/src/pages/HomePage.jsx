import { useState, useMemo } from 'react'
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react'
import FavoriteButton from '../components/common/FavoriteButton'
import { formatRupiah, truncate } from '../utils/helpers'

export default function HomePage({
  userProfile,
  restaurants = [],
  favorites = [],
  onSelectRestaurant,
  onToggleFavorite,
  onNavigateExplore,
  onOpenAuth,
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const safeRestaurants = Array.isArray(restaurants) ? restaurants : []
  const safeFavorites = Array.isArray(favorites) ? favorites : []

  const favMap = useMemo(() => {
    const map = new Set()
    safeFavorites.forEach((fav) => map.add(String(fav?.id || fav?.name)))
    return map
  }, [safeFavorites])

  // Most Popular items (rating >= 4.8)
  const popularRestaurants = useMemo(() => {
    return safeRestaurants
      .filter((r) => Number(r?.rating || 0) >= 4.7)
      .slice(0, 4)
  }, [safeRestaurants])

  // Recommended for you (curated picks)
  const recommendedRestaurants = useMemo(() => {
    const recs = safeRestaurants.filter((r) => r?.is_recommended)
    return recs.length > 0 ? recs.slice(0, 4) : safeRestaurants.slice(0, 4)
  }, [safeRestaurants])

  const categories = [
    { name: 'Bakso & Mie', icon: '🍜', tag: 'Bakso & Mie' },
    { name: 'Kuliner Tradisional', icon: '🍲', tag: 'Kuliner Tradisional' },
    { name: 'Sambal & Penyet', icon: '🌶️', tag: 'Aneka Sambal & Penyetan' },
    { name: 'Asian & Donburi', icon: '🍱', tag: 'Asian & Donburi' },
    { name: 'Lumpia & Camilan', icon: '🥟', tag: 'Street Food & Camilan' },
    { name: 'Cafe & Nongkrong', icon: '☕', tag: 'Cafe & Nongkrong' },
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onNavigateExplore) onNavigateExplore(searchQuery)
  }

  const displayName = userProfile?.isLoggedIn
    ? userProfile?.name?.split(' ')[0] || 'Saras'
    : 'Foodie'

  return (
    <div className="home-page-container">
      {/* Top Greeting Header */}
      <section className="home-hero-header">
        <div className="greeting-text-wrap">
          <h1 className="greeting-title">Hi {displayName}!</h1>
          <p className="greeting-sub">Jelajahi Kuliner Lezat di Semarang</p>
        </div>

        {!userProfile?.isLoggedIn && (
          <button
            type="button"
            className="btn-quick-login"
            onClick={onOpenAuth}
          >
            Masuk Akun
          </button>
        )}
      </section>

      {/* Search Bar matching Image 1 & Image 4 */}
      <form onSubmit={handleSearchSubmit} className="home-search-form">
        <div className="home-search-bar">
          <Search size={18} className="home-search-icon" />
          <input
            type="search"
            placeholder="Cari makanan, resto, atau area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="home-search-input"
          />
          <button
            type="button"
            className="home-search-filter-btn"
            onClick={() => onNavigateExplore && onNavigateExplore(searchQuery)}
            aria-label="Filter"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </form>

      {/* Featured Banner "Explore Taste" (Image 1 & Image 4) */}
      <section className="home-featured-banner">
        <div className="banner-text-side">
          <span className="banner-badge">
            <Sparkles size={12} /> Explore Taste
          </span>
          <h2 className="banner-title">Jelajahi Kuliner Semarang bersama Lokarasa!</h2>
          <p className="banner-desc">
            Temukan sajian lezat mulai dari Kedai Tinari, Bakmie Serangkai, hingga warung legendaris.
          </p>
          <button
            type="button"
            className="banner-cta-btn"
            onClick={() => onNavigateExplore && onNavigateExplore()}
          >
            <span>Mulai Jelajah</span>
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="banner-img-side">
          <div className="banner-food-circle">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
              alt="Kuliner Nusantara"
              className="banner-food-img"
            />
          </div>
        </div>
      </section>

      {/* Category Icons Horizontal Scroll (Image 4 Screen 2) */}
      <section className="home-section">
        <div className="section-head-bar">
          <h3 className="section-title">Kategori Kuliner</h3>
        </div>
        <div className="category-circle-row">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              className="cat-circle-card"
              onClick={() => onNavigateExplore && onNavigateExplore('', cat.tag)}
            >
              <div className="cat-circle-icon">{cat.icon}</div>
              <span className="cat-circle-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section 1: Most Popular (Image 1 & Image 4) */}
      <section className="home-section">
        <div className="section-head-bar">
          <div className="section-head-title-wrap">
            <Flame size={18} className="accent-orange" />
            <h3 className="section-title">Rekomendasi Terpopuler</h3>
          </div>
          <button
            type="button"
            className="section-link-more"
            onClick={() => onNavigateExplore && onNavigateExplore()}
          >
            Lihat Semua &gt;
          </button>
        </div>

        <div className="home-card-grid">
          {popularRestaurants.map((resto) => {
            const isFav = favMap.has(String(resto.id || resto.name))
            return (
              <div
                key={resto.id || resto.name}
                className="dark-food-card"
                onClick={() => onSelectRestaurant(resto)}
              >
                <div className="card-thumb-wrap">
                  <img
                    src={resto.image_url}
                    alt={resto.name}
                    className="card-thumb-img"
                    loading="lazy"
                  />
                  <div className="card-fav-corner">
                    <FavoriteButton
                      isFavorited={isFav}
                      onToggle={() => onToggleFavorite(resto)}
                      size={16}
                    />
                  </div>
                  <div className="card-rating-badge">
                    <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                    <span>{Number(resto.rating || 4.8).toFixed(1)}</span>
                  </div>
                </div>

                <div className="card-details">
                  <h4 className="card-name">{resto.name}</h4>
                  <p className="card-category">{resto.category_name}</p>
                  <div className="card-bottom-row">
                    <span className="card-price">{formatRupiah(resto.avg_price || 25000)}</span>
                    <span className="card-distance">
                      <MapPin size={11} /> 1.2 km
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 2: Recommended for You (Image 1 & Image 4) */}
      <section className="home-section">
        <div className="section-head-bar">
          <div className="section-head-title-wrap">
            <Sparkles size={18} className="accent-orange" />
            <h3 className="section-title">Pilihan Untukmu di Semarang</h3>
          </div>
          <button
            type="button"
            className="section-link-more"
            onClick={() => onNavigateExplore && onNavigateExplore()}
          >
            Lihat Semua &gt;
          </button>
        </div>

        <div className="home-card-grid">
          {recommendedRestaurants.map((resto) => {
            const isFav = favMap.has(String(resto.id || resto.name))
            return (
              <div
                key={resto.id || resto.name}
                className="dark-food-card"
                onClick={() => onSelectRestaurant(resto)}
              >
                <div className="card-thumb-wrap">
                  <img
                    src={resto.image_url}
                    alt={resto.name}
                    className="card-thumb-img"
                    loading="lazy"
                  />
                  <div className="card-fav-corner">
                    <FavoriteButton
                      isFavorited={isFav}
                      onToggle={() => onToggleFavorite(resto)}
                      size={16}
                    />
                  </div>
                  <div className="card-rating-badge">
                    <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                    <span>{Number(resto.rating || 4.8).toFixed(1)}</span>
                  </div>
                </div>

                <div className="card-details">
                  <h4 className="card-name">{resto.name}</h4>
                  <p className="card-category">{truncate(resto.description || resto.category_name, 45)}</p>
                  <div className="card-bottom-row">
                    <span className="card-price">{formatRupiah(resto.avg_price || 25000)}</span>
                    <span className="card-distance">
                      <MapPin size={11} /> Tembalang
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
