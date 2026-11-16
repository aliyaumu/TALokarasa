import { Heart } from 'lucide-react'

export default function FavoriteButton({ isFavorited, onToggle, size = 18 }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (onToggle) onToggle()
  }

  return (
    <button
      type="button"
      className={`btn-favorite ${isFavorited ? 'btn-favorite--active' : ''}`}
      onClick={handleClick}
      aria-label={isFavorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
      title={isFavorited ? 'Tersimpan di favorit' : 'Simpan ke favorit'}
    >
      <Heart
        size={size}
        fill={isFavorited ? '#e63946' : 'none'}
        stroke={isFavorited ? '#e63946' : 'currentColor'}
      />
    </button>
  )
}
