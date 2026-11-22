import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Loader,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MapPin,
  Utensils,
  Clock,
  Phone,
  Image as ImageIcon,
} from 'lucide-react'
import restaurantService from '../services/restaurantService'

const PRESET_IMAGES = [
  { label: '🍜 Bakso & Mie', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { label: '🍛 Nasi & Tradisional', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: '🍢 Sate & Bakaran', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: '🥟 Lumpia & Camilan', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
  { label: '🍱 Asian & Donburi', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80' },
  { label: '☕ Cafe & Kopi', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
]

export default function EditPlacePage({ restaurant, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    category_name: restaurant?.category_name || 'Bakso & Mie',
    address: restaurant?.address || '',
    city: restaurant?.city || 'Semarang',
    price_range: restaurant?.price_range || '$$',
    avg_price: restaurant?.avg_price || 25000,
    phone: restaurant?.phone || '',
    opening_hours: restaurant?.opening_hours || '10:00 - 21:00 WIB',
    description: restaurant?.description || '',
    is_recommended: Boolean(restaurant?.is_recommended),
    image_url: restaurant?.image_url || PRESET_IMAGES[0].url,
  })

  const [menus, setMenus] = useState(
    Array.isArray(restaurant?.signature_menu) && restaurant.signature_menu.length > 0
      ? restaurant.signature_menu
      : ['Menu Andalan 1']
  )
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        category_name: restaurant.category_name || 'Bakso & Mie',
        address: restaurant.address || '',
        city: restaurant.city || 'Semarang',
        price_range: restaurant.price_range || '$$',
        avg_price: restaurant.avg_price || 25000,
        phone: restaurant.phone || '',
        opening_hours: restaurant.opening_hours || '10:00 - 21:00 WIB',
        description: restaurant.description || '',
        is_recommended: Boolean(restaurant.is_recommended),
        image_url: restaurant.image_url || PRESET_IMAGES[0].url,
      })
      if (Array.isArray(restaurant.signature_menu) && restaurant.signature_menu.length > 0) {
        setMenus(restaurant.signature_menu)
      }
    }
  }, [restaurant])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleMenuChange = (idx, val) => {
    setMenus((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const addMenu = () => setMenus((prev) => [...prev, ''])
  const removeMenu = (idx) => {
    if (menus.length <= 1) return
    setMenus((prev) => prev.filter((_, i) => i !== idx))
  }

  const setQuickPrice = (val, range = '$$') => {
    setFormData((prev) => ({
      ...prev,
      avg_price: val,
      price_range: range,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setErrorMsg('Nama tempat makan minimal 3 karakter.')
      return
    }

    const cleanMenus = menus.map((m) => m.trim()).filter(Boolean)

    const payload = {
      ...formData,
      avg_price: Number(formData.avg_price) || 25000,
      signature_menu: cleanMenus,
    }

    try {
      setSubmitting(true)
      const res = await restaurantService.updateRestaurant(restaurant.id, payload)
      if (res.success || res.data) {
        setSuccessMsg('Perubahan data tempat makan berhasil disimpan!')
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data)
        }, 1000)
      } else {
        throw new Error('Gagal memperbarui data di API.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="crud-page-wrapper">
      {/* Top Header Bar */}
      <div className="crud-header-bar">
        <button
          type="button"
          className="crud-circle-btn"
          onClick={onBack}
          aria-label="Kembali"
          title="Kembali"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="crud-header-titles">
          <h1 className="crud-main-title">Edit Tempat Makan</h1>
          <span className="crud-sub-title">Perbarui Data Rekomendasi (CRUD API)</span>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {errorMsg && (
        <div className="crud-alert crud-alert--error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="crud-alert crud-alert--success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="crud-form-layout">
        {/* SECTION 1: Foto Tempat Makan */}
        <section className="crud-section-card">
          <div className="crud-section-head">
            <div className="crud-icon-box">
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className="crud-section-title">Foto Tempat Makan</h2>
              <p className="crud-section-desc">Ganti foto dengan preset atau URL foto baru.</p>
            </div>
          </div>

          <div className="crud-preview-container">
            <img
              src={formData.image_url}
              alt="Pratinjau Foto"
              className="crud-preview-img"
            />
            <div className="crud-preview-badge">
              <Sparkles size={13} />
              <span>Pratinjau Tampilan</span>
            </div>
          </div>

          <div className="crud-presets-group">
            <span className="crud-field-label">Pilihan Cepat (Preset Foto):</span>
            <div className="crud-presets-grid">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`crud-preset-chip ${formData.image_url === preset.url ? 'active' : ''}`}
                  onClick={() => setFormData((p) => ({ ...p, image_url: preset.url }))}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Informasi Utama */}
        <section className="crud-section-card">
          <div className="crud-section-head">
            <div className="crud-icon-box">
              <Utensils size={18} />
            </div>
            <div>
              <h2 className="crud-section-title">Informasi Tempat</h2>
              <p className="crud-section-desc">Nama, kategori, dan estimasi harga.</p>
            </div>
          </div>

          <div className="crud-form-grid">
            <div className="crud-form-group crud-col-full">
              <label className="crud-field-label" htmlFor="edit-name">
                Nama Tempat Makan <span className="req-star">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Kedai Tinari, Bakmi Serangkai..."
                className="crud-input-field"
                required
              />
            </div>

            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="edit-category">
                Kategori Kuliner <span className="req-star">*</span>
              </label>
              <select
                id="edit-category"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                className="crud-select-field"
              >
                <option value="Bakso &amp; Mie">🍜 Bakso &amp; Mie</option>
                <option value="Kuliner Tradisional">🍲 Kuliner Tradisional</option>
                <option value="Aneka Sambal &amp; Penyetan">🌶️ Aneka Sambal &amp; Penyetan</option>
                <option value="Asian &amp; Donburi">🍱 Asian &amp; Donburi</option>
                <option value="Street Food &amp; Camilan">🥟 Street Food &amp; Camilan</option>
                <option value="Cafe &amp; Nongkrong">☕ Cafe &amp; Nongkrong</option>
              </select>
            </div>

            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="edit-city">
                Wilayah Semarang <span className="req-star">*</span>
              </label>
              <input
                id="edit-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Contoh: Tembalang, Banyumanik..."
                className="crud-input-field"
                required
              />
            </div>

            <div className="crud-form-group crud-col-full">
              <div className="crud-label-row">
                <label className="crud-field-label" htmlFor="edit-price">
                  Estimasi Harga Rata-rata per Orang (Rp) <span className="req-star">*</span>
                </label>
                <span className="crud-price-display">
                  Rp {Number(formData.avg_price || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <input
                id="edit-price"
                type="number"
                name="avg_price"
                value={formData.avg_price}
                onChange={handleChange}
                placeholder="25000"
                min="0"
                step="1000"
                className="crud-input-field"
                required
              />

              <div className="crud-quick-price-row">
                <button
                  type="button"
                  className={`price-chip ${formData.avg_price === 15000 ? 'active' : ''}`}
                  onClick={() => setQuickPrice(15000, '$')}
                >
                  Rp 15.000 ($)
                </button>
                <button
                  type="button"
                  className={`price-chip ${formData.avg_price === 25000 ? 'active' : ''}`}
                  onClick={() => setQuickPrice(25000, '$$')}
                >
                  Rp 25.000 ($$)
                </button>
                <button
                  type="button"
                  className={`price-chip ${formData.avg_price === 35000 ? 'active' : ''}`}
                  onClick={() => setQuickPrice(35000, '$$')}
                >
                  Rp 35.000 ($$)
                </button>
                <button
                  type="button"
                  className={`price-chip ${formData.avg_price === 50000 ? 'active' : ''}`}
                  onClick={() => setQuickPrice(50000, '$$$')}
                >
                  Rp 50.000 ($$$)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Lokasi & Jam Buka */}
        <section className="crud-section-card">
          <div className="crud-section-head">
            <div className="crud-icon-box">
              <MapPin size={18} />
            </div>
            <div>
              <h2 className="crud-section-title">Lokasi &amp; Jam Operasional</h2>
              <p className="crud-section-desc">Alamat akurat agar pengunjung mudah menemukan tempat.</p>
            </div>
          </div>

          <div className="crud-form-grid">
            <div className="crud-form-group crud-col-full">
              <label className="crud-field-label" htmlFor="edit-addr">
                Alamat Lengkap <span className="req-star">*</span>
              </label>
              <input
                id="edit-addr"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Contoh: Jl. Sawunggaling III No.44, Banyumanik..."
                className="crud-input-field"
                required
              />
            </div>

            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="edit-hours">
                Jam Buka / Operasional
              </label>
              <div className="crud-input-icon-wrap">
                <Clock size={16} className="crud-input-icon" />
                <input
                  id="edit-hours"
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  placeholder="10:00 - 21:00 WIB"
                  className="crud-input-field with-icon"
                />
              </div>
            </div>

            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="edit-phone">
                No. Kontak / WhatsApp
              </label>
              <div className="crud-input-icon-wrap">
                <Phone size={16} className="crud-input-icon" />
                <input
                  id="edit-phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-xxxx-xxxx"
                  className="crud-input-field with-icon"
                />
              </div>
            </div>

            <div className="crud-form-group crud-col-full">
              <label className="crud-field-label" htmlFor="edit-desc">
                Deskripsi Tempat
              </label>
              <textarea
                id="edit-desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsi kelezatan, bumbu khas, atau suasana..."
                rows={3}
                className="crud-textarea-field"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: Menu Andalan */}
        <section className="crud-section-card">
          <div className="crud-section-head-between">
            <div className="crud-section-head">
              <div className="crud-icon-box">
                <Utensils size={18} />
              </div>
              <div>
                <h2 className="crud-section-title">Menu Andalan</h2>
                <p className="crud-section-desc">Menu signature yang wajib dicoba pengunjung.</p>
              </div>
            </div>
            <button
              type="button"
              className="crud-add-menu-btn"
              onClick={addMenu}
            >
              <Plus size={14} />
              <span>Tambah Menu</span>
            </button>
          </div>

          <div className="crud-menu-repeater">
            {menus.map((m, idx) => (
              <div key={idx} className="crud-menu-row">
                <span className="crud-menu-index">{idx + 1}</span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => handleMenuChange(idx, e.target.value)}
                  placeholder={`Contoh: Nasi Goreng Babat`}
                  className="crud-input-field crud-menu-input"
                />
                <button
                  type="button"
                  className="crud-remove-menu-btn"
                  onClick={() => removeMenu(idx)}
                  disabled={menus.length <= 1}
                  aria-label="Hapus menu ini"
                  title="Hapus menu"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Rekomendasi Utama Check */}
        <section className="crud-highlight-toggle-card">
          <label className="crud-toggle-label">
            <div className="crud-toggle-info">
              <div className="crud-toggle-icon">
                <Sparkles size={18} color="#f97316" />
              </div>
              <div>
                <span className="crud-toggle-heading">Tandai sebagai Rekomendasi Unggulan</span>
                <span className="crud-toggle-sub">
                  Tempat makan ini akan muncul di banner Beranda dan filter terpopuler.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              name="is_recommended"
              checked={formData.is_recommended}
              onChange={handleChange}
              className="crud-checkbox-hidden"
            />
            <div className={`crud-custom-switch ${formData.is_recommended ? 'active' : ''}`}>
              <div className="crud-switch-dot" />
            </div>
          </label>
        </section>

        {/* SECTION 6: Action Buttons */}
        <div className="crud-submit-actions">
          <button
            type="button"
            className="crud-btn-cancel"
            onClick={onBack}
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className="crud-btn-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader size={18} className="spin" />
                <span>Menyimpan Perubahan…</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
