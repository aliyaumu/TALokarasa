import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Send,
  Loader,
  Share2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Heart,
  Navigation,
} from 'lucide-react'
import { useReviews, useCreateReview } from '../../hooks/useReviews'
import { formatRupiah, calculateAverageRating } from '../../utils/helpers'

export default function RestaurantDetail({
  restaurant,
  onBack,
  onEdit,
  onDelete,
  isFavorited,
  onToggleFavorite,
  userProfile,
  onOpenAuth,
}) {
  const imgSrc =
    restaurant.image_url ||
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80'

  // Reviews
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(restaurant.id)
  const { createReview, loading: submitting } = useCreateReview()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewerName, setReviewerName] = useState(userProfile?.name || 'Saraswati Putri')
  const [reviewMsg, setReviewMsg] = useState({ text: '', type: '' })
  const [showMapModal, setShowMapModal] = useState(false)

  const avgRating = restaurant.rating || calculateAverageRating(reviews)

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setReviewMsg({ text: '', type: '' })

    if (!userProfile?.isLoggedIn) {
      if (onOpenAuth) onOpenAuth()
      return
    }

    if (!comment.trim()) {
      setReviewMsg({ text: 'Mohon tulis ulasan Anda.', type: 'error' })
      return
    }

    const payload = {
      restaurant_id: restaurant.id,
      user_name: reviewerName.trim() || 'Foodie Semarang',
      rating,
      comment: comment.trim(),
    }

    const res = await createReview(payload)
    if (res) {
      setReviewMsg({ text: 'Terima kasih! Ulasan Anda berhasil dikirim ke Supabase.', type: 'success' })
      setComment('')
      setRating(5)
      refetchReviews()
      setTimeout(() => setReviewMsg({ text: '', type: '' }), 4000)
    } else {
      setReviewMsg({ text: 'Gagal mengirim ulasan.', type: 'error' })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lokarasa: ${restaurant.name}`,
          text: `Cek rekomendasi ${restaurant.name} Semarang di Lokarasa!`,
          url: window.location.href,
        })
      } catch {
        /* share dismissed */
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Tautan tempat makan berhasil disalin!')
    }
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurant.name} ${restaurant.address} Semarang`
  )}`

  // Sample photo gallery
  const gallery = [
    imgSrc,
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  ]

  return (
    <div className="dark-detail-view">
      {/* Top Floating App Bar */}
      <div className="detail-top-nav">
        <button
          type="button"
          className="detail-circle-btn"
          onClick={onBack}
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="detail-top-actions">
          <button
            type="button"
            className="detail-circle-btn"
            onClick={handleShare}
            aria-label="Bagikan"
          >
            <Share2 size={18} />
          </button>
          <button
            type="button"
            className={`detail-circle-btn ${isFavorited ? 'detail-circle-btn--active' : ''}`}
            onClick={onToggleFavorite}
            aria-label="Favorit"
          >
            <Heart size={18} fill={isFavorited ? '#f97316' : 'none'} stroke={isFavorited ? '#f97316' : '#ffffff'} />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="detail-hero-frame">
        <img src={imgSrc} alt={restaurant.name} className="detail-hero-picture" />
        <div className="detail-hero-shade" />
      </div>

      {/* Main Sheet Container */}
      <div className="detail-sheet-card">
        {/* Title & Verified Tag */}
        <div className="detail-header-block">
          <div className="detail-name-row">
            <h1 className="detail-resto-name">{restaurant.name}</h1>
            <span className="verified-check" title="Terverifikasi Lokarasa">✓</span>
          </div>

          <div className="detail-rating-distance-row">
            <div className="detail-star-badge">
              <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
              <span className="star-score">{Number(avgRating).toFixed(1)}</span>
              <span className="star-reviews">({reviews.length || restaurant.review_count || 120} ulasan)</span>
            </div>
            <span className="detail-distance-tag">
              <MapPin size={13} /> 1.2 km dari lokasimu
            </span>
          </div>

          {/* Quick Tags (Category, Price, Hours) */}
          <div className="detail-tag-chips">
            <span className="detail-chip-item">{restaurant.category_name || 'Kuliner'}</span>
            <span className="detail-chip-item">{restaurant.price_range || '$$'}</span>
            <span className="detail-chip-item">
              <Clock size={12} className="inline-icon" /> Buka: {restaurant.opening_hours || '10:00 - 21:00 WIB'}
            </span>
          </div>
        </div>

        {/* Description */}
        <section className="detail-block-section">
          <p className="detail-description-p">
            {restaurant.description || 'Spot kuliner favorit di Semarang yang menyajikan cita rasa khas lezat dan bumbu aromatik berlimpah.'}
          </p>
        </section>

        {/* Mini Gallery (Image 4 Screen 4) */}
        <section className="detail-block-section">
          <h3 className="detail-section-label">Galeri Foto</h3>
          <div className="detail-gallery-row">
            {gallery.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`${restaurant.name} foto ${idx + 1}`}
                className="gallery-thumb-item"
                loading="lazy"
              />
            ))}
          </div>
        </section>

        {/* Location & Map Card (Image 4 Screen 4 & 5) */}
        <section className="detail-block-section location-highlight-card">
          <div className="location-info-left">
            <MapPin size={20} className="accent-orange location-pin-icon" />
            <div>
              <span className="location-street">{restaurant.address}</span>
              <span className="location-city">{restaurant.city || 'Semarang'}, Jawa Tengah</span>
            </div>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-open-maps"
          >
            <Navigation size={14} />
            <span>Lihat Peta</span>
          </a>
        </section>

        {/* Signature Menu */}
        {restaurant.signature_menu && restaurant.signature_menu.length > 0 && (
          <section className="detail-block-section">
            <h3 className="detail-section-label">Menu Andalan</h3>
            <div className="signature-menu-wrap">
              {restaurant.signature_menu.map((menu, i) => (
                <div key={i} className="signature-menu-chip">
                  <span className="menu-bullet">✨</span>
                  <span>{menu}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Primary Bottom Action Button (Image 4 Screen 4) */}
        <div className="detail-main-action-wrap">
          <button
            type="button"
            className={`btn-primary-wide ${isFavorited ? 'btn-primary-wide--favorited' : ''}`}
            onClick={onToggleFavorite}
          >
            <Heart size={18} fill={isFavorited ? '#ffffff' : 'none'} stroke="#ffffff" />
            <span>{isFavorited ? 'Tersimpan di Favorit' : 'Tambah ke Favorit'}</span>
          </button>
        </div>

        {/* Reviews Section */}
        <section className="detail-block-section reviews-block">
          <div className="reviews-header-row">
            <h3 className="detail-section-label">Ulasan Pengunjung ({reviews.length})</h3>
            <span className="reviews-avg-pill">⭐ {Number(avgRating).toFixed(1)} / 5.0</span>
          </div>

          {/* Form Tambah Ulasan */}
          <form onSubmit={handleSubmitReview} className="dark-review-form">
            <h4 className="review-form-prompt">Bagikan Pengalaman Kuliner Anda</h4>

            <div className="review-stars-picker">
              <span className="picker-label">Rating:</span>
              <div className="picker-stars">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className="picker-star-btn"
                    onClick={() => setRating(val)}
                  >
                    <Star
                      size={22}
                      fill={val <= rating ? '#f59e0b' : 'none'}
                      stroke={val <= rating ? '#f59e0b' : '#64748b'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan rasa masakan, porsi, suasana tempat, atau saran untuk pengunjung lain..."
              rows={3}
              className="dark-textarea"
              required
            />

            {reviewMsg.text && (
              <div className={`detail-msg-toast detail-msg-toast--${reviewMsg.type}`}>
                {reviewMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                <span>{reviewMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--sm"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={15} className="spin" /> Mengirim…
                </>
              ) : (
                <>
                  <Send size={15} /> Kirim Ulasan
                </>
              )}
            </button>
          </form>

          {/* Reviews List */}
          <div className="dark-reviews-list">
            {reviewsLoading ? (
              <div className="loading-row">
                <Loader size={18} className="spin accent-orange" />
                <span>Memuat ulasan komunitas…</span>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="dark-review-card">
                  <div className="review-card-top-line">
                    <div className="review-user-cell">
                      <div className="review-avatar-ring">
                        {(rev.user_name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="review-person-name">{rev.user_name}</span>
                        <span className="review-time-stamp">
                          {new Date(rev.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="review-stars-show">
                      {Array.from({ length: 5 }, (_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          fill={idx < rev.rating ? '#f59e0b' : 'none'}
                          stroke={idx < rev.rating ? '#f59e0b' : '#475569'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-body-text">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="empty-reviews-hint">Belum ada ulasan. Jadilah orang pertama yang memberi penilaian!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
