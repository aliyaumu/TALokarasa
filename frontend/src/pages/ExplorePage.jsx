import { useState, useMemo } from 'react'
import { Search, Star, MapPin, X, UtensilsCrossed, Loader, AlertTriangle } from 'lucide-react'
import FavoriteButton from '../components/common/FavoriteButton'
import { matchesSearch, matchesCategory, sortRestaurants, formatRupiah } from '../utils/helpers'

export default function ExplorePage({
  restaurants,
  loading,
  error,
  refetch,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
  initialQuery = '',
  initialCategory = 'Semua',
}) {
  const [search, setSearch] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [sortKey, setSortKey] = useState('rating')
  const [sortOrder, setSortOrder] = useState('desc')

  const categories = [
    'Semua',
    'Bakso & Mie',
    'Kuliner Tradisional',
    'Aneka Sambal & Penyetan',
    'Asian & Donburi',
    'Street Food & Camilan',
    'Cafe & Nongkrong',
  ]

  const favMap = useMemo(() => {
    const map = new Set()
    favorites.forEach((fav) => map.add(String(fav.id || fav.name)))
    return map
  }, [favorites])

  const filteredRestaurants = useMemo(() => {
    const list = restaurants.filter(
      (item) => matchesSearch(item, search) && matchesCategory(item, activeCategory)
    )
    return sortRestaurants(list, sortKey, sortOrder)
  }, [restaurants, search, activeCategory, sortKey, sortOrder])

  return (
    <div className="explore-page-wrap">
      {/* Search Input Bar (Matching Image 4) */}
      <div className="explore-search-container">
        <div className="explore-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            placeholder="Cari makanan, restoran di Semarang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="explore-search-input"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="explore-pill-bar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              className={`explore-pill ${isActive ? 'explore-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Result Status */}
      <div className="explore-meta-row">
        <span className="explore-count">
          Menampilkan {filteredRestaurants.length} tempat kuliner
        </span>
        <select
          value={`${sortKey}_${sortOrder}`}
          onChange={(e) => {
            const [k, ord] = e.target.value.split('_')
            setSortKey(k)
            setSortOrder(ord)
          }}
          className="explore-sort-select"
        >
          <option value="rating_desc">⭐ Rating Tertinggi</option>
          <option value="avg_price_asc">💵 Harga Terendah</option>
          <option value="avg_price_desc">💵 Harga Tertinggi</option>
          <option value="name_asc">Nama (A - Z)</option>
        </select>
      </div>

      {/* State: Loading */}
      {loading && (
        <div className="dark-state-box">
          <Loader size={30} className="spin accent-orange" />
          <p>Memuat tempat makan Semarang…</p>
        </div>
      )}

      {/* State: Error */}
      {!loading && error && (
        <div className="dark-state-box dark-state-box--error">
          <AlertTriangle size={32} />
          <p>{error}</p>
          <button type="button" className="btn btn--outline btn--sm" onClick={refetch}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* State: Empty */}
      {!loading && filteredRestaurants.length === 0 && !error && (
        <div className="dark-state-box">
          <UtensilsCrossed size={36} className="state-icon-muted" />
          <h4>Tidak ada tempat makan ditemukan</h4>
          <p>Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.</p>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => { setSearch(''); setActiveCategory('Semua'); }}
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* List of Restaurants (Horizontal Card Style matching Image 4) */}
      <div className="explore-list-grid">
        {filteredRestaurants.map((resto) => {
          const isFav = favMap.has(String(resto.id || resto.name))
          return (
            <div
              key={resto.id || resto.name}
              className="explore-row-card"
              onClick={() => onSelectRestaurant(resto)}
            >
              <div className="explore-card-thumb-wrap">
                <img
                  src={resto.image_url}
                  alt={resto.name}
                  className="explore-card-thumb"
                  loading="lazy"
                />
              </div>

              <div className="explore-card-info">
                <div className="explore-card-top">
                  <h3 className="explore-card-name">{resto.name}</h3>
                  <div className="explore-card-fav">
                    <FavoriteButton
                      isFavorited={isFav}
                      onToggle={() => onToggleFavorite(resto)}
                      size={18}
                    />
                  </div>
                </div>

                <div className="explore-card-rating-row">
                  <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                  <span className="rating-val">{Number(resto.rating || 4.8).toFixed(1)}</span>
                  <span className="review-num">({resto.review_count || 120}+)</span>
                </div>

                <div className="explore-card-bottom">
                  <span className="explore-card-category">{resto.category_name}</span>
                  <div className="explore-card-distance">
                    <MapPin size={12} />
                    <span>{resto.address?.split(',')[1] || 'Semarang'} · 1.2 km</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
