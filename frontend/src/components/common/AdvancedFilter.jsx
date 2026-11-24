
import { Search, ArrowUpDown, X } from 'lucide-react'

export default function AdvancedFilter({
  search,
  onSearch,
  sortKey,
  sortOrder,
  onSort,
}) {
  const handleSortChange = (e) => {
    const parts = e.target.value.split('_')
    const order = parts.pop()
    const key = parts.join('_')

    onSort({
      key,
      order,
    })
  }

  return (
    <div className="filter-wrapper">
      {/* Search Bar */}
      <div className="search-bar">
        <Search className="search-icon" size={20} />

        <input
          type="text"
          className="search-input"
          placeholder="Cari nama restoran atau makanan..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearch('')}
            aria-label="Hapus pencarian"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="sort-bar">
        <span className="sort-label">
          <ArrowUpDown size={16} className="inline-icon" />
          Urutkan:
        </span>

        <div className="sort-select-wrapper">
          <select
            className="sort-select"
            value={`${sortKey}_${sortOrder}`}
            onChange={handleSortChange}
          >
            <option value="rating_desc">Rating Tertinggi</option>
            <option value="rating_asc">Rating Terendah</option>
            <option value="avg_price_asc">Harga Termurah</option>
            <option value="avg_price_desc">Harga Termahal</option>
            <option value="name_asc">Nama A-Z</option>
            <option value="name_desc">Nama Z-A</option>
          </select>
        </div>
      </div>
    </div>
  )
}
