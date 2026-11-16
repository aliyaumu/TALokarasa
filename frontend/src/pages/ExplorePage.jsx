import { useState, useMemo } from 'react'
import { Sparkles, UtensilsCrossed, RefreshCw, Loader, AlertTriangle } from 'lucide-react'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import AdvancedFilter from '../components/common/AdvancedFilter'
import {
  matchesSearch,
  matchesCategory,
  sortRestaurants,
  extractCategories,
} from '../utils/helpers'

/**
 * ExplorePage — Halaman Utama 1 (List Tempat Makan)
 * Menampilkan seluruh tempat makan dengan fitur pencarian, filter kategori, dan sorting.
 * Setiap item dapat diklik untuk menampilkan halaman detail.
 */
export default function ExplorePage({
  restaurants,
  loading,
  error,
  refetch,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
  onNavigateAdd,
}) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortKey, setSortKey] = useState('rating')
  const [sortOrder, setSortOrder] = useState('desc')

  const categories = useMemo(() => extractCategories(restaurants), [restaurants])

  const filteredRestaurants = useMemo(() => {
    const list = restaurants.filter(
      (item) => matchesSearch(item, search) && matchesCategory(item, activeCategory)
    )
    return sortRestaurants(list, sortKey, sortOrder)
  }, [restaurants, search, activeCategory, sortKey, sortOrder])

  const favMap = useMemo(() => {
    const map = new Set()
    favorites.forEach((fav) => map.add(String(fav.id || fav.name)))
    return map
  }, [favorites])

  return (
    <div className="page-container">
      {/* Hero Welcome Banner */}
      <section className="explore-hero">
        <div className="explore-hero-content">
          <span className="hero-pill">
            <Sparkles size={13} /> Eksplorasi Kuliner Nusantara
          </span>
          <h1 className="hero-title">Temukan Cita Rasa Terbaik di Sekitarmu</h1>
          <p className="hero-subtitle">
            Jelajahi warung legendaris, cafe estetik, hingga hidden gem kuliner khas daerah.
          </p>
        </div>
      </section>

      {/* Advanced Filter: Search, Category Pills, Sort */}
      <AdvancedFilter
        search={search}
        onSearch={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={({ key, order }) => {
          setSortKey(key)
          setSortOrder(order)
        }}
      />

      {/* Results Header */}
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Daftar Tempat Makan</h2>
          <span className="section-count">
            Ditemukan {filteredRestaurants.length} tempat kuliner
          </span>
        </div>
      </div>

      {/* State: Loading */}
      {loading && (
        <div className="state-card">
          <Loader size={32} className="spin state-icon" />
          <p className="state-text">Sedang memuat data tempat makan…</p>
        </div>
      )}

      {/* State: Error */}
      {!loading && error && (
        <div className="state-card state-card--error">
          <AlertTriangle size={32} />
          <p className="state-text">{error}</p>
          <button type="button" className="btn btn--outline btn--sm" onClick={refetch}>
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      )}

      {/* State: Empty */}
      {!loading && filteredRestaurants.length === 0 && !error && (
        <div className="state-card">
          <UtensilsCrossed size={36} className="state-icon" />
          <h3 className="state-title">Tidak ada tempat makan yang sesuai</h3>
          <p className="state-text">
            Coba ubah kata kunci pencarian atau pilih kategori kuliner yang lain.
          </p>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => {
              setSearch('')
              setActiveCategory('Semua')
            }}
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Grid List Tempat Makan */}
      {filteredRestaurants.length > 0 && (
        <div className="resto-grid">
          {filteredRestaurants.map((resto) => (
            <RestaurantCard
              key={resto.id || resto.name}
              restaurant={resto}
              onSelect={onSelectRestaurant}
              isFavorited={favMap.has(String(resto.id || resto.name))}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
