import { useState, useMemo } from 'react'
import { Flame, Award, Heart, Compass } from 'lucide-react'
import RestaurantCard from '../components/restaurant/RestaurantCard'

/**
 * RecommendationPage — Halaman Utama 2 (List Rekomendasi & Pilihan Terbaik)
 * Memenuhi syarat: "Minimal terdapat 2 halaman utama yang memiliki list dan setiap item pada list dapat diklik untuk menampilkan halaman detail."
 */
export default function RecommendationPage({
  restaurants,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
  onNavigateExplore,
}) {
  const [filterType, setFilterType] = useState('all') // 'all', 'top_rated', 'budget', 'traditional', 'cafe'

  const favMap = useMemo(() => {
    const map = new Set()
    favorites.forEach((fav) => map.add(String(fav.id || fav.name)))
    return map
  }, [favorites])

  // Filter recommendations
  const recommendedList = useMemo(() => {
    let list = restaurants.filter((r) => r.is_recommended || Number(r.rating) >= 4.7)

    if (filterType === 'top_rated') {
      list = list.filter((r) => Number(r.rating) >= 4.8)
    } else if (filterType === 'budget') {
      list = list.filter((r) => Number(r.avg_price) <= 30000)
    } else if (filterType === 'traditional') {
      list = list.filter((r) => (r.category_name || '').includes('Tradisional') || (r.category_name || '').includes('Sambal'))
    } else if (filterType === 'cafe') {
      list = list.filter((r) => (r.category_name || '').includes('Cafe') || (r.category_name || '').includes('Kopi'))
    }

    return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
  }, [restaurants, filterType])

  return (
    <div className="page-container">
      {/* Header Banner */}
      <section className="recommendation-hero">
        <div className="rec-badge">
          <Flame size={14} /> Kurasi Khusus Foodie
        </div>
        <h1 className="hero-title">Rekomendasi Tempat Makan Pilihan</h1>
        <p className="hero-subtitle">
          Daftar kuliner terbaik dengan ulasan tertinggi dan kelezatan yang diakui oleh komunitas pencinta kuliner.
        </p>

        {/* Quick Highlights Counter */}
        <div className="rec-stats-strip">
          <div className="rec-stat-box">
            <Award size={20} className="rec-stat-icon" />
            <div>
              <span className="rec-stat-num">{recommendedList.length}</span>
              <span className="rec-stat-label">Tempat Rekomendasi</span>
            </div>
          </div>
          <div className="rec-stat-box">
            <Heart size={20} className="rec-stat-icon" />
            <div>
              <span className="rec-stat-num">4.8+</span>
              <span className="rec-stat-label">Rata-rata Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="curation-pills-bar">
        <button
          type="button"
          className={`curation-pill ${filterType === 'all' ? 'curation-pill--active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          🌟 Semua Kurasi
        </button>
        <button
          type="button"
          className={`curation-pill ${filterType === 'top_rated' ? 'curation-pill--active' : ''}`}
          onClick={() => setFilterType('top_rated')}
        >
          👑 Rating Tertinggi (4.8+)
        </button>
        <button
          type="button"
          className={`curation-pill ${filterType === 'budget' ? 'curation-pill--active' : ''}`}
          onClick={() => setFilterType('budget')}
        >
          💰 Ramah Kantong (&le; 30rb)
        </button>
        <button
          type="button"
          className={`curation-pill ${filterType === 'traditional' ? 'curation-pill--active' : ''}`}
          onClick={() => setFilterType('traditional')}
        >
          🍲 Otentik &amp; Tradisional
        </button>
        <button
          type="button"
          className={`curation-pill ${filterType === 'cafe' ? 'curation-pill--active' : ''}`}
          onClick={() => setFilterType('cafe')}
        >
          ☕ Cafe &amp; Suasana Asri
        </button>
      </div>

      {/* List Header */}
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Pilihan Terbaik Komunitas</h2>
          <span className="section-count">
            Menampilkan {recommendedList.length} tempat kuliner rekomendasi
          </span>
        </div>
      </div>

      {/* List / Cards */}
      {recommendedList.length > 0 ? (
        <div className="resto-grid">
          {recommendedList.map((resto) => (
            <RestaurantCard
              key={resto.id || resto.name}
              restaurant={resto}
              onSelect={onSelectRestaurant}
              isFavorited={favMap.has(String(resto.id || resto.name))}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="state-card">
          <Award size={36} className="state-icon" />
          <h3 className="state-title">Tidak ada rekomendasi pada kategori ini</h3>
          <p className="state-text">
            Silakan pilih filter lain atau jelajahi seluruh tempat makan di halaman Eksplorasi.
          </p>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={onNavigateExplore}
          >
            <Compass size={14} /> Ke Halaman Eksplorasi
          </button>
        </div>
      )}
    </div>
  )
}
