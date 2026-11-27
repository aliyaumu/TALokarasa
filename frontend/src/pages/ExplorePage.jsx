import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Star, MapPin, X, UtensilsCrossed, Loader, AlertTriangle, Pencil, Trash2 } from 'lucide-react'
import FavoriteButton from '../components/common/FavoriteButton'
import OperationalBadge from '../components/common/OperationalBadge'
import { useCurrentTime } from '../hooks/useCurrentTime'
import './FilterDropdown.css'
import { matchesSearch, matchesCategory, sortRestaurants, getOperationalStatus } from '../utils/helpers'

// Gaya tombol ikon Edit / Hapus pada baris kartu
const iconBtn = {
  width: 30,
  height: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: 'inherit',
  padding: 0,
}
const iconBtnDanger = {
  ...iconBtn,
  border: '1px solid rgba(239,68,68,0.45)',
  background: 'rgba(239,68,68,0.12)',
  color: '#ef4444',
}

export default function ExplorePage({
  restaurants,
  loading,
  error,
  refetch,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
  onEditRestaurant,
  onDeleteRestaurant,
  initialQuery = '',
  initialCategory = 'Semua',
}) {
  const [search, setSearch] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [sortKey, setSortKey] = useState('rating')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(initialCategory !== 'Semua')
  const [priceFilter, setPriceFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('0')
  const [statusFilter, setStatusFilter] = useState('all')
  const now = useCurrentTime()

  const priceOk = (item) => {
    if (priceFilter === 'all') return true
    const p = Number(item?.avg_price) || 0
    if (priceFilter === 'low') return p > 0 && p < 20000
    if (priceFilter === 'mid') return p >= 20000 && p <= 50000
    return p > 50000
  }
  const activeFilterCount =
    (activeCategory !== 'Semua' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (ratingFilter !== '0' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0)
  const resetFilters = () => {
    setActiveCategory('Semua')
    setPriceFilter('all')
    setRatingFilter('0')
    setStatusFilter('all')
  }

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
    const list = restaurants.filter((item) => {
      if (!matchesSearch(item, search)) return false
      if (!matchesCategory(item, activeCategory)) return false
      if (!priceOk(item)) return false
      if (Number(item?.rating || 0) < Number(ratingFilter)) return false
      if (statusFilter !== 'all') {
        const op = getOperationalStatus(item?.opening_hours, now, item?.opening_date)
        if (op.status !== statusFilter) return false
      }
      return true
    })
    return sortRestaurants(list, sortKey, sortOrder)
  }, [restaurants, search, activeCategory, priceFilter, ratingFilter, statusFilter, now, sortKey, sortOrder])

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
          <button
            type="button"
            className={`lk-filter-btn ${showFilters ? 'lk-filter-btn--on' : ''}`}
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Filter"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={17} />
            {activeFilterCount > 0 && <span className="lk-filter-badge">{activeFilterCount}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="lk-filter-panel">
            <div className="lk-filter-field">
              <label htmlFor="flt-cat">Kategori</label>
              <select id="flt-cat" className="lk-select" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="lk-filter-field">
              <label htmlFor="flt-price">Kisaran Harga</label>
              <select id="flt-price" className="lk-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                <option value="all">Semua harga</option>
                <option value="low">Hemat (&lt; 20 rb)</option>
                <option value="mid">Menengah (20 - 50 rb)</option>
                <option value="high">Mewah (&gt; 50 rb)</option>
              </select>
            </div>
            <div className="lk-filter-field">
              <label htmlFor="flt-rating">Rating Minimal</label>
              <select id="flt-rating" className="lk-select" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <option value="0">Semua rating</option>
                <option value="3">3.0 ke atas</option>
                <option value="4">4.0 ke atas</option>
                <option value="4.5">4.5 ke atas</option>
              </select>
            </div>
            <div className="lk-filter-field">
              <label htmlFor="flt-status">Status Operasional</label>
              <select id="flt-status" className="lk-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Semua status</option>
                <option value="open">🟢 Open Now (Buka)</option>
                <option value="coming_soon">🟡 Coming Soon</option>
                <option value="closed">🔴 Closed (Tutup)</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button type="button" className="lk-filter-reset" onClick={resetFilters}>Reset filter</button>
            )}
          </div>
        )}
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
            onClick={() => { setSearch(''); resetFilters() }}
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
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEditRestaurant && (
                      <button
                        type="button"
                        style={iconBtn}
                        title="Edit tempat makan"
                        aria-label={`Edit ${resto.name}`}
                        onClick={() => onEditRestaurant(resto)}
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {onDeleteRestaurant && (
                      <button
                        type="button"
                        style={iconBtnDanger}
                        title="Hapus tempat makan"
                        aria-label={`Hapus ${resto.name}`}
                        onClick={() => onDeleteRestaurant(resto)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                    <div className="explore-card-fav">
                      <FavoriteButton
                        isFavorited={isFav}
                        onToggle={() => onToggleFavorite(resto)}
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                <div className="explore-card-rating-row">
                  <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                  <span className="rating-val">{Number(resto.rating || 4.8).toFixed(1)}</span>
                  <span className="review-num">({resto.review_count || 120}+)</span>
                </div>

                <OperationalBadge openingHours={resto.opening_hours} openingDate={resto.opening_date} variant="compact" />

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