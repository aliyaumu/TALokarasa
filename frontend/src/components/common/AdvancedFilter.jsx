import { Search, ArrowUpDown, X } from 'lucide-react'

export default function AdvancedFilter({
  search,
  onSearch,
  categories,
  activeCategory,
  onCategory,
  sortKey,
  sortOrder,
  onSort,
}) {
  return (
    <div className="filter-wrapper">
      {/* Search Input Bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="search"
          placeholder="Cari tempat makan, menu, atau lokasi..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
          aria-label="Cari kuliner"
        />
        {search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearch('')}
            aria-label="Hapus teks pencarian"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="category-scroll-container">
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              className={`pill ${isActive ? 'pill--active' : ''}`}
              onClick={() => onCategory(cat)}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Sorting Dropdown Bar */}
      <div className="sort-bar">
        <span className="sort-label">
          <ArrowUpDown size={14} className="inline-icon" /> Urutkan:
        </span>
        <select
          value={`${sortKey}_${sortOrder}`}
          onChange={(e) => {
            const [k, ord] = e.target.value.split('_')
            onSort({ key: k, order: ord })
          }}
          className="sort-select"
          aria-label="Urutkan tempat makan"
        >
          <option value="rating_desc">⭐ Rating Tertinggi</option>
          <option value="rating_asc">Rating Terendah</option>
          <option value="avg_price_asc">💵 Harga Terjangkau</option>
          <option value="avg_price_desc">Harga Tertinggi</option>
          <option value="name_asc">Nama (A - Z)</option>
          <option value="name_desc">Nama (Z - A)</option>
        </select>
      </div>
    </div>
  )
}
