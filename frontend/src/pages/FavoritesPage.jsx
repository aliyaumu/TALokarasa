import { useState, useMemo } from 'react'
import { Heart, Search, Trash2, MapPin, Star, Compass, ArrowRight } from 'lucide-react'
import OperationalBadge from '../components/common/OperationalBadge'
import { formatRupiah } from '../utils/helpers'

/**
 * FavoritesPage — "Liked Restaurants" / Favorit Saya
 * Sesuai desain Image 2 & Image 4 Screen 6:
 * - Search bar di favorit
 * - List kartu gelap dengan gambar di kiri, nama, lokasi Semarang, rating, dan tombol hapus (Trash)
 */
export default function FavoritesPage({
  favorites,
  onSelectRestaurant,
  onToggleFavorite,
  onNavigateExplore,
}) {
  const [search, setSearch] = useState('')

  const filteredFavorites = useMemo(() => {
    if (!search.trim()) return favorites
    const q = search.toLowerCase()
    return favorites.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.category_name?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q)
    )
  }, [favorites, search])

  return (
    <div className="favorites-page-container">
      {/* Header */}
      <div className="favorites-head-row">
        <div>
          <h1 className="favorites-title">Liked Restaurants</h1>
          <span className="favorites-count-badge">
            {favorites.length} tempat tersimpan
          </span>
        </div>
        {favorites.length > 0 && (
          <div className="favorites-heart-icon-wrap">
            <Heart size={20} fill="#f97316" stroke="#f97316" />
          </div>
        )}
      </div>

      {/* Search Bar inside Favorites (Image 2) */}
      {favorites.length > 0 && (
        <div className="fav-search-wrap">
          <Search size={18} className="fav-search-icon" />
          <input
            type="search"
            placeholder="Cari restoran tersimpan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="fav-search-input"
          />
        </div>
      )}

      {/* List Items */}
      {filteredFavorites.length > 0 ? (
        <div className="favorites-list-column">
          {filteredFavorites.map((resto) => (
            <div
              key={resto.id || resto.name}
              className="fav-item-row"
              onClick={() => onSelectRestaurant(resto)}
            >
              <img
                src={resto.image_url}
                alt={resto.name}
                className="fav-thumb-img"
                loading="lazy"
              />

              <div className="fav-info-col">
                <h3 className="fav-resto-name">{resto.name}</h3>

                <div className="fav-meta-line">
                  <span className="fav-category-pill">{resto.category_name || 'Kuliner'}</span>
                  <span className="fav-city-tag">
                    <MapPin size={11} /> {resto.city || 'Semarang'}
                  </span>
                  <div className="fav-rating-tag">
                    <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                    <span>{Number(resto.rating || 4.8).toFixed(1)}</span>
                  </div>
                </div>

                <div className="fav-price-line">
                  <span>{formatRupiah(resto.avg_price || 25000)}</span>
                </div>

                <OperationalBadge openingHours={resto.opening_hours} variant="compact" />
              </div>

              {/* Trash/Unlike Action (Image 2) */}
              <button
                type="button"
                className="fav-delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(resto)
                }}
                aria-label="Hapus dari favorit"
                title="Hapus dari favorit"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-fav-card">
          <div className="empty-fav-icon-ring">
            <Heart size={36} stroke="#f97316" />
          </div>
          <h3 className="empty-fav-title">Belum ada favorit tersimpan</h3>
          <p className="empty-fav-desc">
            Yuk, simpan tempat makan favoritmu di Semarang seperti Kedai Tinari, Sami Seneng, atau Bakmi Serangkai!
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onNavigateExplore}
          >
            <Compass size={16} /> Jelajahi Sekarang
          </button>
        </div>
      )}
    </div>
  )
}
