import { Star, MapPin } from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import OperationalBadge from '../common/OperationalBadge'
import { formatRupiah, truncate } from '../../utils/helpers'

export default function RestaurantCard({
  restaurant,
  onSelect,
  isFavorited,
  onToggleFavorite,
}) {
  const imgSrc =
    restaurant.image_url ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="resto-card" onClick={() => onSelect(restaurant)}>
      {/* Thumbnail Banner */}
      <div className="resto-card-img-wrap">
        <img
          src={imgSrc}
          alt={restaurant.name}
          className="resto-card-img"
          loading="lazy"
        />

        <div className="resto-card-top-badges">
          <span className="badge-category">{restaurant.category_name || 'Kuliner'}</span>
          {restaurant.is_recommended && (
            <span className="badge-recommended">🔥 Pilihan Terbaik</span>
          )}
        </div>

        <div className="resto-card-fav">
          <FavoriteButton
            isFavorited={isFavorited}
            onToggle={() => onToggleFavorite(restaurant)}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="resto-card-content">
        <div className="resto-card-head">
          <h3 className="resto-card-name">{restaurant.name}</h3>
          <div className="resto-card-rating">
            <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
            <span className="rating-num">
              {Number(restaurant.rating || 4.5).toFixed(1)}
            </span>
            <span className="rating-count">
              ({restaurant.review_count || 10})
            </span>
          </div>
        </div>

        <p className="resto-card-desc">
          {truncate(restaurant.description || 'Pilihan tempat makan favorit dengan menu autentik.', 75)}
        </p>

        <div className="resto-card-foot">
          <div className="resto-card-price">
            <span className="price-tag">{formatRupiah(restaurant.avg_price || 25000)}</span>
            <span className="price-sub">/ porsi</span>
          </div>
          <div className="resto-card-loc">
            <MapPin size={13} />
            <span>{restaurant.city || 'Yogyakarta'}</span>
          </div>
        </div>

        <OperationalBadge openingHours={restaurant.opening_hours} openingDate={restaurant.opening_date} variant="compact" />
      </div>
    </div>
  )
}
