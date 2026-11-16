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
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Utensils,
} from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { useReviews, useCreateReview } from '../../hooks/useReviews'
import { formatRupiah, calculateAverageRating } from '../../utils/helpers'
import { getUserProfile } from '../../services/userService'

export default function RestaurantDetail({
  restaurant,
  onBack,
  onEdit,
  onDelete,
  isFavorited,
  onToggleFavorite,
}) {
  const imgSrc =
    restaurant.image_url ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'

  const userProfile = getUserProfile()

  // Reviews
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(restaurant.id)
  const { createReview, loading: submitting } = useCreateReview()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewerName, setReviewerName] = useState(userProfile.name || 'Aliya Foodie')
  const [reviewMsg, setReviewMsg] = useState({ text: '', type: '' })

  const avgRating = restaurant.rating || calculateAverageRating(reviews)

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setReviewMsg({ text: '', type: '' })

    if (!comment.trim()) {
      setReviewMsg({ text: 'Mohon tulis ulasan Anda.', type: 'error' })
      return
    }

    const payload = {
      restaurant_id: restaurant.id,
      user_name: reviewerName.trim() || 'Foodie Explorer',
      rating,
      comment: comment.trim(),
    }

    const res = await createReview(payload)
    if (res) {
      setReviewMsg({ text: 'Terima kasih! Ulasan Anda berhasil dikirim.', type: 'success' })
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
          text: `Cek tempat makan ${restaurant.name} di Lokarasa!`,
          url: window.location.href,
        })
      } catch {
        /* user cancelled share */
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Tautan tempat makan disalin ke clipboard!')
    }
  }

  return (
    <div className="detail-view">
      {/* Top Floating App Bar */}
      <div className="detail-top-bar">
        <button type="button" className="icon-back-btn" onClick={onBack} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>

        <div className="detail-top-actions">
          <button type="button" className="icon-share-btn" onClick={handleShare} aria-label="Bagikan">
            <Share2 size={18} />
          </button>
          <FavoriteButton
            isFavorited={isFavorited}
            onToggle={() => onToggleFavorite(restaurant)}
            size={20}
          />
        </div>
      </div>

      {/* Hero Image */}
      <div className="detail-hero">
        <img src={imgSrc} alt={restaurant.name} className="detail-hero-img" />
        <div className="detail-hero-overlay" />
      </div>

      {/* Sheet Content */}
      <div className="detail-sheet">
        {/* Main Title & Rating */}
        <div className="detail-main-header">
          <div className="detail-category-row">
            <span className="badge-category">{restaurant.category_name || 'Kuliner'}</span>
            {restaurant.is_recommended && (
              <span className="badge-recommended">🔥 Pilihan Terbaik</span>
            )}
          </div>
          <h1 className="detail-title">{restaurant.name}</h1>
          <div className="detail-rating-row">
            <div className="rating-pill">
              <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
              <span className="rating-val">{Number(avgRating).toFixed(1)}</span>
              <span className="rating-total">({reviews.length || restaurant.review_count || 12} ulasan)</span>
            </div>
            <span className="detail-price-text">{formatRupiah(restaurant.avg_price || 25000)} / porsi</span>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="detail-info-grid">
          <div className="info-grid-item">
            <Clock size={16} className="info-icon" />
            <div>
              <span className="info-label">Jam Operasional</span>
              <span className="info-val">{restaurant.opening_hours || '09:00 - 21:00 WIB'}</span>
            </div>
          </div>
          <div className="info-grid-item">
            <Phone size={16} className="info-icon" />
            <div>
              <span className="info-label">Kontak / Reservasi</span>
              <span className="info-val">{restaurant.phone || '0812-3456-7890'}</span>
            </div>
          </div>
          <div className="info-grid-item full-width">
            <MapPin size={16} className="info-icon" />
            <div>
              <span className="info-label">Alamat Lengkap</span>
              <span className="info-val">{restaurant.address}, {restaurant.city || 'Yogyakarta'}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <section className="detail-card-section">
          <h2 className="section-title">Tentang Tempat Makan</h2>
          <p className="detail-desc-text">
            {restaurant.description || 'Tempat makan khas dengan resep turun temurun yang menyajikan kelezatan otentik untuk memanjakan lidah Anda.'}
          </p>
        </section>

        {/* Signature Menu */}
        {restaurant.signature_menu && restaurant.signature_menu.length > 0 && (
          <section className="detail-card-section">
            <h2 className="section-title">
              <Utensils size={18} className="inline-icon" /> Menu Andalan
            </h2>
            <div className="menu-pills">
              {restaurant.signature_menu.map((menu, i) => (
                <span key={i} className="menu-pill">
                  ✨ {menu}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Actions Bar (Edit / Delete) */}
        <div className="detail-management-bar">
          {onEdit && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => onEdit(restaurant)}
            >
              <Edit3 size={14} /> Edit Data
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => onDelete(restaurant)}
            >
              <Trash2 size={14} /> Hapus Tempat
            </button>
          )}
        </div>

        {/* Reviews Section */}
        <section className="detail-card-section reviews-section">
          <h2 className="section-title">Ulasan &amp; Penilaian Pengunjung</h2>

          {/* Toast Message */}
          {reviewMsg.text && (
            <div className={`toast toast--${reviewMsg.type}`}>
              {reviewMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{reviewMsg.text}</span>
            </div>
          )}

          {/* Form Tambah Ulasan */}
          <form onSubmit={handleSubmitReview} className="review-box-form">
            <h3 className="review-form-title">Tulis Ulasan Anda</h3>

            <div className="review-rating-select">
              <span className="rating-select-label">Beri Bintang:</span>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    className="star-click-btn"
                    onClick={() => setRating(starVal)}
                    aria-label={`Bintang ${starVal}`}
                  >
                    <Star
                      size={24}
                      fill={starVal <= rating ? '#f59e0b' : 'none'}
                      stroke={starVal <= rating ? '#f59e0b' : '#a0aec0'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Nama Anda (Foodie)"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagaimana rasa hidangannya, pelayanan, dan suasananya? Bagikan pengalaman Anda di sini..."
                rows={3}
                className="form-textarea"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={16} className="spin" /> Mengirim Ulasan…
                </>
              ) : (
                <>
                  <Send size={16} /> Kirim Ulasan
                </>
              )}
            </button>
          </form>

          {/* Existing Reviews List */}
          <div className="review-list-wrap">
            <h3 className="review-list-title">Ulasan Komunitas ({reviews.length})</h3>

            {reviewsLoading ? (
              <div className="loading-state">
                <Loader size={20} className="spin" />
                <p>Memuat ulasan…</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="review-cards">
                {reviews.map((rev) => (
                  <div key={rev.id} className="review-item-card">
                    <div className="review-card-head">
                      <div className="review-user-info">
                        <div className="review-avatar">
                          {(rev.user_name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="review-user-name">{rev.user_name}</span>
                          <span className="review-date">
                            {new Date(rev.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="review-stars-display">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < rev.rating ? '#f59e0b' : 'none'}
                            stroke={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment-text">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-sub">Belum ada ulasan untuk tempat makan ini. Jadilah yang pertama memberikan ulasan!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
