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
} from 'lucide-react'
import restaurantService from '../services/restaurantService'
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
  { label: 'Tradisional / Nasi', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sate & Daging', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cafe & Kopi', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Seafood', url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bakso & Mie', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { label: 'Street Food', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
]

export default function CreatePlacePage({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category_name: 'Kuliner Tradisional',
    address: '',
    city: 'Yogyakarta',
    price_range: '$$',
    avg_price: 30000,
    phone: '',
    opening_hours: '09:00 - 21:00 WIB',
    description: '',
    is_recommended: false,
    image_url: PRESET_IMAGES[0].url,
  })

  const [menus, setMenus] = useState(['Menu Andalan 1', 'Menu Andalan 2'])
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
        setSuccessMsg(`Draft tersimpan otomatis (${formatDraftTime(ts)})`)
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
    <div className="page-container form-page-wrap">
      {/* Top Header */}
      <div className="form-head-nav">
        <button type="button" className="btn btn--outline btn--sm" onClick={onBack}>
          <ArrowLeft size={16} /> Kembali
        </button>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => handleSaveDraft(true)}
        >
          <Save size={14} /> Simpan Draft
        </button>
      </div>

      <div className="form-intro">
        <h1 className="hero-title">Tambah Rekomendasi Kuliner</h1>
        <p className="hero-subtitle">
          Bagikan tempat makan favorit Anda kepada komunitas penikmat kuliner Lokarasa.
        </p>
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
        {/* Foto Banner Tempat Makan */}
        <div className="form-section-box">
          <h3 className="form-box-title">Foto Tempat Makan</h3>
          <p className="form-box-desc">Pilih foto dari preset atau unggah foto Anda sendiri.</p>

          <div className="form-image-preview-wrap">
            <img src={formData.image_url} alt="Pratinjau Foto" className="form-image-preview" />
          </div>

          <div className="image-preset-bar">
            <span className="preset-label">Pilihan Preset Cepat:</span>
            <div className="preset-pill-group">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-pill ${formData.image_url === preset.url ? 'preset-pill--active' : ''}`}
                  onClick={() => setFormData((p) => ({ ...p, image_url: preset.url }))}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="upload-custom-file-row">
            <label htmlFor="custom-image-file" className="btn btn--outline btn--sm file-upload-label">
              <Upload size={14} /> Unggah Foto dari Perangkat
            </label>
            <input
              id="custom-image-file"
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="hidden-file-input"
            />
          </div>
        </div>

        {/* Informasi Utama */}
        <div className="form-section-box">
          <h3 className="form-box-title">Informasi Tempat</h3>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="resto-name">
                Nama Tempat Makan <span className="req">*</span>
              </label>
              <input
                id="resto-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Gudeg Yu Djum, Kopi Klotok..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resto-category">
                Kategori Kuliner <span className="req">*</span>
              </label>
              <select
                id="resto-category"
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
              <label className="form-label" htmlFor="resto-city">
                Kota / Wilayah <span className="req">*</span>
              </label>
              <input
                id="resto-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Contoh: Yogyakarta, Sleman, Bantul..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resto-price">
                Estimasi Harga Rata-rata (Rp) <span className="req">*</span>
              </label>
              <input
                id="resto-price"
                type="number"
                name="avg_price"
                value={formData.avg_price}
                onChange={handleChange}
                placeholder="30000"
                min="0"
                step="1000"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="resto-addr">
              Alamat Lengkap <span className="req">*</span>
            </label>
            <input
              id="resto-addr"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Contoh: Jl. Kaliurang KM 16, Pakem..."
              className="form-input"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="resto-hours">
                Jam Operasional
              </label>
              <input
                id="resto-hours"
                type="text"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                placeholder="09:00 - 21:00 WIB"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resto-phone">
                Nomor Telepon / WhatsApp
              </label>
              <input
                id="resto-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0812-xxxx-xxxx"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="resto-desc">
              Deskripsi &amp; Suasana Tempat
            </label>
            <textarea
              id="resto-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ceritakan keistimewaan rasa, bumbu rahasia, atau suasana tempat makan ini..."
              rows={3}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Menu Andalan */}
        <div className="form-section-box">
          <div className="form-box-head-row">
            <div>
              <h3 className="form-box-title">Daftar Menu Andalan</h3>
              <p className="form-box-desc">Menu signature yang wajib dicoba pengunjung.</p>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={addMenu}
            >
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
                  placeholder={`Contoh: Nasi Goreng Spesial ${idx + 1}`}
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn-remove-ghost"
                  onClick={() => removeMenu(idx)}
                  disabled={menus.length <= 1}
                  aria-label="Hapus menu"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Opsi Rekomendasi */}
        <div className="form-checkbox-row">
          <input
            id="rec-check"
            type="checkbox"
            name="is_recommended"
            checked={formData.is_recommended}
            onChange={handleChange}
            className="custom-checkbox"
          />
          <label htmlFor="rec-check" className="checkbox-text-label">
            <Sparkles size={16} className="inline-icon" /> Tandai sebagai <strong>Rekomendasi Utama (Pilihan Terbaik)</strong>
          </label>
        </div>

        {/* Submit Bar */}
        <div className="form-submit-bar">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onBack}
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader size={18} className="spin" /> Menyimpan ke API…
              </>
            ) : (
              'Simpan & Publikasikan'
            )}
          </button>
        </div>
      </form>

      {/* Restore Draft Modal */}
      <ConfirmModal
        open={showDraftModal}
        title="Lanjutkan Pengisian Sebelumnya?"
        message={`Ditemukan draft tempat makan yang belum tersimpan dari ${draftTime ? formatDraftTime(draftTime) : 'sebelumnya'}. Apakah Anda ingin memulihkannya?`}
        confirmLabel="Pulihkan Draft"
        cancelLabel="Buang"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
