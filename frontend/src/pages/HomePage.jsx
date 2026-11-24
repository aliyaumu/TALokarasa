import { useState, useMemo } from 'react'
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  BadgePlus,
  Pencil,
  Trash2,
} from 'lucide-react'
import FavoriteButton from '../components/common/FavoriteButton'
import { formatRupiah, truncate } from '../utils/helpers'
import './FilterDropdown.css'

// Tombol Edit & Hapus di bawah kartu (tidak ikut memicu klik kartu / buka detail)
function CardActions({ resto, onEdit, onDelete }) {
  if (!onEdit && !onDelete) return null

  const base = {
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '7px 10px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  }
  const danger = {
    ...base,
    border: '1px solid rgba(239,68,68,0.45)',
    background: 'rgba(239,68,68,0.12)',
    color: '#ef4444',
  }

  return (
    <div
      style={{ display: 'flex', gap: 8, marginTop: 12 }}
      onClick={(e) => e.stopPropagation()}
    >
      {onEdit && (
        <button
          type="button"
          style={base}
          onClick={() => onEdit(resto)}
          aria-label={`Edit ${resto.name}`}
        >
          <Pencil size={13} /> Edit
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          style={danger}
          onClick={() => onDelete(resto)}
          aria-label={`Hapus ${resto.name}`}
        >
          <Trash2 size={13} /> Hapus
        </button>
      )}
    </div>
  )
}

export default function HomePage({
  userProfile,
  restaurants = [],
  favorites = [],
  onSelectRestaurant,
  onToggleFavorite,
  onEditRestaurant,
  onDeleteRestaurant,
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

  // Baru Ditambahkan (Terbaru di Semarang) — Paling atas dari list
  const recentRestaurants = useMemo(() => {
    return safeRestaurants.slice(0, 4)
  }, [safeRestaurants])

  // Most Popular items (Sorted by rating)
  const popularRestaurants = useMemo(() => {
    return [...safeRestaurants]
      .sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0))
      .slice(0, 4)
  }, [safeRestaurants])

  // Recommended for you (Curated picks)
  const recommendedRestaurants = useMemo(() => {
    const recs = safeRestaurants.filter((r) => r?.is_recommended)
    return recs.length > 0 ? recs.slice(0, 6) : safeRestaurants.slice(0, 6)
  }, [safeRestaurants])

  const categories = [
    { name: 'Bakso & Mie', icon: '🍜', tag: 'Bakso & Mie' },
    { name: 'Kuliner Tradisional', icon: '🍲', tag: 'Kuliner Tradisional' },
    { name: 'Sambal & Penyet', icon: '🌶️', tag: 'Aneka Sambal & Penyetan' },
    { name: 'Asian & Donburi', icon: '🍱', tag: 'Asian & Donburi' },
    { name: 'Lumpia & Camilan', icon: '🥟', tag: 'Street Food & Camilan' },
    { name: 'Cafe & Nongkrong', icon: '☕', tag: 'Cafe & Nongkrong' },
  ]

  const [showFilter, setShowFilter] = useState(false)

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

      {/* Search Bar matching Mockup */}
      <form onSubmit={handleSearchSubmit} className="home-search-form">
        <div className="home-search-bar lk-filter-anchor">
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
            onClick={() => setShowFilter((v) => !v)}
            aria-label="Filter"
            aria-expanded={showFilter}
          >
            <SlidersHorizontal size={18} />
          </button>
          {showFilter && (
            <div className="lk-filter-panel lk-filter-panel--float">
              <div className="lk-filter-field">
                <label htmlFor="home-flt-cat">Kategori</label>
                <select
                  id="home-flt-cat"
                  className="lk-select"
                  defaultValue=""
                  onChange={(e) => {
                    setShowFilter(false)
                    if (onNavigateExplore) onNavigateExplore(searchQuery, e.target.value || undefined)
                  }}
                >
                  <option value="">Pilih kategori…</option>
                  {categories.map((cat) => (
                    <option key={cat.tag} value={cat.tag}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Featured Banner "Explore Taste" */}
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

      {/* Category Icons Horizontal Scroll */}
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

      {/* SECTION 1: Baru Ditambahkan / Terbaru (Supaya tempat baru langsung muncul di Beranda!) */}
      {recentRestaurants.length > 0 && (
        <section className="home-section">
          <div className="section-head-bar">
            <div className="section-head-title-wrap">
              <BadgePlus size={18} className="accent-orange" />
              <h3 className="section-title">Baru Ditambahkan</h3>
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
            {recentRestaurants.map((resto, idx) => {
              const isFav = favMap.has(String(resto.id || resto.name))
              const isNewlyCreated = String(resto.id).includes('custom') || String(resto.id).includes('resto-') || idx === 0
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
                    {isNewlyCreated && (
                      <div className="card-new-badge">
                        <span>BARU</span>
                      </div>
                    )}
                    <div className="card-rating-badge">
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                      <span>{Number(resto.rating || 4.9).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="card-details">
                    <h4 className="card-name">{resto.name}</h4>
                    <p className="card-category">{resto.category_name}</p>
                    <div className="card-bottom-row">
                      <span className="card-price">{formatRupiah(resto.avg_price || 25000)}</span>
                      <span className="card-distance">
                        <MapPin size={11} /> {resto.city || 'Semarang'}
                      </span>
                    </div>
                    <CardActions
                      resto={resto}
                      onEdit={onEditRestaurant}
                      onDelete={onDeleteRestaurant}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: Rekomendasi Terpopuler */}
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
                  <CardActions
                    resto={resto}
                    onEdit={onEditRestaurant}
                    onDelete={onDeleteRestaurant}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 3: Pilihan Untukmu di Semarang */}
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
                      <MapPin size={11} /> {resto.city || 'Semarang'}
                    </span>
                  </div>
                  <CardActions
                    resto={resto}
                    onEdit={onEditRestaurant}
                    onDelete={onDeleteRestaurant}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}