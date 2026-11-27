import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
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
import OperationalBadge from '../components/common/OperationalBadge'
import {
  parseDateFromText,
  toIsoDateString,
  applyOpeningDateToHours,
} from '../utils/helpers'
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

const PRESET_IMAGES = [
  { label: '🍜 Bakso & Mie', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { label: '🍛 Nasi & Tradisional', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: '🍢 Sate & Bakaran', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: '🥟 Lumpia & Camilan', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
  { label: '🍱 Asian & Donburi', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80' },
  { label: '☕ Cafe & Kopi', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
]

export default function CreatePlacePage({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category_name: 'Bakso & Mie',
    address: '',
    city: 'Semarang',
    price_range: '$$',
    avg_price: 25000,
    phone: '',
    opening_hours: '10:00 - 21:00 WIB',
    description: '',
    is_recommended: true,
    image_url: PRESET_IMAGES[0].url,
  })

  const [menus, setMenus] = useState(['Menu Spesial 1', 'Menu Andalan 2'])
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Draft management
  const [showDraftModal, setShowDraftModal] = useState(() => hasDraft('create_place'))
  const [draftTime, setDraftTime] = useState(() => getDraftTimestamp('create_place'))

  // Auto-save draft
  const handleSaveDraft = useCallback((notify = true) => {
    const draft = { formData, menus }
    const ok = saveDraft(draft, 'create_place')
    if (ok) {
      const ts = getDraftTimestamp('create_place')
      setDraftTime(ts)
      if (notify) {
        setSuccessMsg(`Draft tersimpan (${formatDraftTime(ts)})`)
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    }
  }, [formData, menus])

  useEffect(() => {
    const timer = setInterval(() => {
      handleSaveDraft(false)
    }, 25000)
    return () => clearInterval(timer)
  }, [handleSaveDraft])

  const handleLoadDraft = () => {
    const draft = loadDraft('create_place')
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.menus) setMenus(draft.menus)
      setShowDraftModal(false)
      setSuccessMsg('Draft berhasil dipulihkan!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft('create_place')
    setShowDraftModal(false)
    setDraftTime(null)
  }

  const launchDate = toIsoDateString(parseDateFromText(formData.opening_hours))

  const handleLaunchDateChange = (e) => {
    const iso = e.target.value
    setFormData((p) => ({
      ...p,
      opening_hours: applyOpeningDateToHours(p.opening_hours, iso),
    }))
  }

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Menu Handlers
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

  // Handle image upload from file or base64
  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Ukuran gambar maksimal 3MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image_url: event.target.result }))
    }
    reader.readAsDataURL(file)
  }

  // Quick price selection
  const setQuickPrice = (val, range = '$$') => {
    setFormData((prev) => ({
      ...prev,
      avg_price: val,
      price_range: range,
    }))
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setErrorMsg('Nama tempat makan minimal 3 karakter.')
      return
    }
    if (!formData.address.trim()) {
      setErrorMsg('Alamat tempat makan wajib diisi.')
      return
    }

    const cleanMenus = menus.map((m) => m.trim()).filter(Boolean)

    const payload = {
      ...formData,
      avg_price: Number(formData.avg_price) || 25000,
      signature_menu: cleanMenus.length > 0 ? cleanMenus : ['Menu Spesial'],
    }

    try {
      setSubmitting(true)
      const res = await restaurantService.createRestaurant(payload)
      if (res.success || res.data) {
        deleteDraft('create_place')
        setSuccessMsg('Tempat makan berhasil ditambahkan ke Lokarasa!')
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data)
        }, 1000)
      } else {
        throw new Error('Gagal menyimpan data ke API.')
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
          <h1 className="crud-main-title">Tambah Tempat Makan</h1>
          <span className="crud-sub-title">Kelola Rekomendasi Kuliner (CRUD API)</span>
        </div>

        <button
          type="button"
          className="crud-draft-btn"
          onClick={() => handleSaveDraft(true)}
          title="Simpan sebagai draft"
        >
          <Save size={15} />
          <span>Draft</span>
        </button>
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
              <p className="crud-section-desc">Pilih foto preset kuliner atau unggah foto tempat.</p>
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

          <div className="crud-upload-row">
            <label htmlFor="custom-image-file" className="crud-upload-btn">
              <Upload size={15} />
              <span>Unggah dari Galeri Perangkat</span>
            </label>
            <input
              id="custom-image-file"
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="crud-hidden-file"
            />
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
              <p className="crud-section-desc">Nama, kategori, dan estimasi harga makanan.</p>
            </div>
          </div>

          <div className="crud-form-grid">
            {/* Nama Tempat */}
            <div className="crud-form-group crud-col-full">
              <label className="crud-field-label" htmlFor="resto-name">
                Nama Tempat Makan <span className="req-star">*</span>
              </label>
              <input
                id="resto-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Kedai Tinari, Bakmi Serangkai, Sami Seneng..."
                className="crud-input-field"
                required
              />
            </div>

            {/* Kategori Kuliner */}
            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="resto-category">
                Kategori Kuliner <span className="req-star">*</span>
              </label>
              <select
                id="resto-category"
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

            {/* Wilayah / Area */}
            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="resto-city">
                Wilayah Semarang <span className="req-star">*</span>
              </label>
              <input
                id="resto-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Contoh: Tembalang, Banyumanik, Semarang Tengah..."
                className="crud-input-field"
                required
              />
            </div>

            {/* Estimasi Harga */}
            <div className="crud-form-group crud-col-full">
              <div className="crud-label-row">
                <label className="crud-field-label" htmlFor="resto-price">
                  Estimasi Harga Rata-rata per Orang (Rp) <span className="req-star">*</span>
                </label>
                <span className="crud-price-display">
                  Rp {Number(formData.avg_price || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <input
                id="resto-price"
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

              {/* Quick Price Buttons */}
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

        {/* SECTION 3: Lokasi & Kontak */}
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
              <label className="crud-field-label" htmlFor="resto-addr">
                Alamat Lengkap <span className="req-star">*</span>
              </label>
              <input
                id="resto-addr"
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
              <label className="crud-field-label" htmlFor="resto-hours">
                Jam Buka / Operasional
              </label>
              <div className="crud-input-icon-wrap">
                <Clock size={16} className="crud-input-icon" />
                <input
                  id="resto-hours"
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  placeholder="10:00 - 21:00 WIB"
                  className="crud-input-field with-icon"
                />
              </div>
              <div className="crud-quick-price-row" style={{ marginTop: 8 }}>
                {['08:00 - 21:00 WIB', '10:00 - 22:00 WIB', '17:00 - 24:00 WIB', 'Buka 24 Jam'].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    className={`price-chip ${formData.opening_hours.includes(hrs) ? 'active' : ''}`}
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        opening_hours: applyOpeningDateToHours(hrs, launchDate),
                      }))
                    }
                  >
                    {hrs}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <label className="crud-field-label" htmlFor="resto-launch-date" style={{ fontSize: 12 }}>
                  Tanggal Buka (Opsional — untuk toko baru / Coming Soon)
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <input
                    id="resto-launch-date"
                    type="date"
                    value={launchDate}
                    onChange={handleLaunchDateChange}
                    className="crud-input-field"
                    style={{ flex: 1 }}
                  />
                  {launchDate && (
                    <button
                      type="button"
                      className="price-chip"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          opening_hours: applyOpeningDateToHours(p.opening_hours, ''),
                        }))
                      }
                    >
                      Reset Tanggal
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <OperationalBadge openingHours={formData.opening_hours} variant="pill" showDetail />
              </div>
            </div>

            <div className="crud-form-group">
              <label className="crud-field-label" htmlFor="resto-phone">
                No. Kontak / WhatsApp
              </label>
              <div className="crud-input-icon-wrap">
                <Phone size={16} className="crud-input-icon" />
                <input
                  id="resto-phone"
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
              <label className="crud-field-label" htmlFor="resto-desc">
                Deskripsi &amp; Cerita Rasa
              </label>
              <textarea
                id="resto-desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ceritakan kelezatan bumbu, suasana tempat, atau tips waktu berkunjung..."
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
                <p className="crud-section-desc">Menu favorit yang wajib dicoba pengunjung.</p>
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
                  placeholder={`Contoh: Bakmi Kuah Kental Spesial`}
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
                <span>Menyimpan ke API Supabase…</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Simpan Tempat Makan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Restore Draft Modal */}
      <ConfirmModal
        open={showDraftModal}
        title="Pulihkan Draft Isian?"
        message={`Ditemukan draft pengisian yang belum disimpan (${draftTime ? formatDraftTime(draftTime) : 'sebelumnya'}). Ingin melanjutkan isian tersebut?`}
        confirmLabel="Ya, Pulihkan"
        cancelLabel="Buang Draft"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
