import { Bookmark, Compass, ArrowRight } from 'lucide-react'
import RestaurantCard from '../components/restaurant/RestaurantCard'

/**
 * FavoritesPage — Halaman Daftar Tempat Makan Tersimpan (Bookmark/Favorit)
 * Data tersimpan persisten di localStorage dan disinkronkan secara mulus.
 * Setiap item pada list dapat diklik untuk menampilkan halaman detail.
 */
export default function FavoritesPage({
  favorites,
  onSelectRestaurant,
  onToggleFavorite,
  onNavigateExplore,
}) {
  return (
    <div className="page-container">
      <section className="favorites-hero">
        <div className="rec-badge">
          <Bookmark size={14} /> Daftar Koleksi Pribadi
        </div>
        <h1 className="hero-title">Tempat Makan Tersimpan</h1>
        <p className="hero-subtitle">
          Koleksi tempat makan favorit yang Anda simpan untuk dikunjungi saat berburu kuliner berikutnya.
        </p>
      </section>

      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Daftar Tersimpan</h2>
          <span className="section-count">
            {favorites.length} tempat kuliner tersimpan di perangkat ini
          </span>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="resto-grid">
          {favorites.map((resto) => (
            <RestaurantCard
              key={resto.id || resto.name}
              restaurant={resto}
              onSelect={onSelectRestaurant}
              isFavorited={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="state-card">
          <Bookmark size={40} className="state-icon" />
          <h3 className="state-title">Belum ada tempat makan yang disimpan</h3>
          <p className="state-text">
            Klik ikon hati pada tempat makan mana pun di halaman Eksplorasi atau Rekomendasi untuk menyimpannya ke koleksi ini.
          </p>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={onNavigateExplore}
          >
            <span>Jelajahi Kuliner Sekarang</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
