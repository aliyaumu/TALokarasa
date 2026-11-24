
import { Search, ArrowUpDown, X, ChevronDown } from 'lucide-react'

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

      {/* Category Dropdown */}
      <div className="category-dropdown-wrapper">
        <label htmlFor="category-filter">
          Kategori Kuliner
        </label>

        <div className="category-dropdown">
          <select
            id="category-filter"
            value={activeCategory}
            onChange={(e) => onCategory(e.target.value)}
            className="category-select"
            aria-label="Pilih kategori kuliner"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="category-dropdown-icon"
          />
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="sort-bar">
        <span className="sort-label">
          <ArrowUpDown size={14} className="inline-icon" />
          Urutkan:
        </span>

        <div className="sort-select-wrapper">
          <select
            value={`${sortKey}_${sortOrder}`}
            onChange={(e) => {
              const [k, ord] = e.target.value.split('_')
              onSort({ key: k, order: ord })
            }}
            className="sort-select"
            aria-label="Urutkan tempat makan"
          >
            <option value="rating_desc">
              ⭐ Rating Tertinggi
            </option>

            <option value="rating_asc">
              Rating Terendah
            </option>

            <option value="avg_price_asc">
              💵 Harga Terjangkau
            </option>

            <option value="avg_price_desc">
              Harga Tertinggi
            </option>

            <option value="name_asc">
              Nama (A - Z)
            </option>

            <option value="name_desc">
              Nama (Z - A)
            </option>
          </select>
        </div>
      </div>

    </div>
  )
}
