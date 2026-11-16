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
} from 'lucide-react'
import restaurantService from '../services/restaurantService'

export default function EditPlacePage({ restaurant, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    category_name: restaurant?.category_name || 'Kuliner Tradisional',
    address: restaurant?.address || '',
    city: restaurant?.city || 'Yogyakarta',
    price_range: restaurant?.price_range || '$$',
    avg_price: restaurant?.avg_price || 30000,
    phone: restaurant?.phone || '',
    opening_hours: restaurant?.opening_hours || '09:00 - 21:00 WIB',
    description: restaurant?.description || '',
    is_recommended: Boolean(restaurant?.is_recommended),
    image_url: restaurant?.image_url || '',
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
        category_name: restaurant.category_name || 'Kuliner Tradisional',
        address: restaurant.address || '',
        city: restaurant.city || 'Yogyakarta',
        price_range: restaurant.price_range || '$$',
        avg_price: restaurant.avg_price || 30000,
        phone: restaurant.phone || '',
        opening_hours: restaurant.opening_hours || '09:00 - 21:00 WIB',
        description: restaurant.description || '',
        is_recommended: Boolean(restaurant.is_recommended),
        image_url: restaurant.image_url || '',
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
        setSuccessMsg('Perubahan berhasil disimpan!')
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data)
        }, 800)
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memperbarui data tempat makan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container form-page-wrap">
      <div className="form-head-nav">
        <button type="button" className="btn btn--outline btn--sm" onClick={onBack}>
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <div className="form-intro">
        <h1 className="hero-title">Edit Data Tempat Makan</h1>
        <p className="hero-subtitle">Memperbarui informasi untuk {restaurant?.name}</p>
      </div>

      {errorMsg && (
        <div className="toast toast--error">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="toast toast--success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="custom-form-card">
        <div className="form-section-box">
          <h3 className="form-box-title">Informasi Tempat</h3>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-name">
                Nama Tempat Makan <span className="req">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">
                Kategori Kuliner <span className="req">*</span>
              </label>
              <select
                id="edit-category"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                <option value="Cafe & Kopi">Cafe &amp; Kopi</option>
                <option value="Street Food & Angkringan">Street Food &amp; Angkringan</option>
                <option value="Seafood & Bakaran">Seafood &amp; Bakaran</option>
                <option value="Bakso & Mie">Bakso &amp; Mie</option>
                <option value="Aneka Sambal & Lalapan">Aneka Sambal &amp; Lalapan</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-city">
                Kota / Wilayah
              </label>
              <input
                id="edit-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-price">
                Harga Rata-rata (Rp)
              </label>
              <input
                id="edit-price"
                type="number"
                name="avg_price"
                value={formData.avg_price}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-addr">
              Alamat Lengkap
            </label>
            <input
              id="edit-addr"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-desc">
              Deskripsi
            </label>
            <textarea
              id="edit-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Menu Andalan */}
        <div className="form-section-box">
          <div className="form-box-head-row">
            <h3 className="form-box-title">Daftar Menu Andalan</h3>
            <button type="button" className="btn btn--outline btn--sm" onClick={addMenu}>
              <Plus size={14} /> Tambah Menu
            </button>
          </div>

          <div className="dynamic-menu-list">
            {menus.map((m, idx) => (
              <div key={idx} className="dynamic-menu-row">
                <span className="menu-num">{idx + 1}</span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => handleMenuChange(idx, e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn-remove-ghost"
                  onClick={() => removeMenu(idx)}
                  disabled={menus.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-checkbox-row">
          <input
            id="edit-rec-check"
            type="checkbox"
            name="is_recommended"
            checked={formData.is_recommended}
            onChange={handleChange}
            className="custom-checkbox"
          />
          <label htmlFor="edit-rec-check" className="checkbox-text-label">
            <Sparkles size={16} className="inline-icon" /> Tandai sebagai Rekomendasi Utama
          </label>
        </div>

        <div className="form-submit-bar">
          <button type="button" className="btn btn--outline" onClick={onBack} disabled={submitting}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader size={18} className="spin" /> Menyimpan…
              </>
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
