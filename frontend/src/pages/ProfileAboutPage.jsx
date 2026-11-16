import { useState } from 'react'
import {
  User,
  Info,
  Camera,
  Copy,
  Check,
  Save,
  Bookmark,
  Sparkles,
  Smartphone,
  Server,
  Play,
  Github,
  Award,
} from 'lucide-react'
import userService from '../services/userService'

export default function ProfileAboutPage({
  favoritesCount = 0,
  onReplaySplash,
}) {
  const [activeSubTab, setActiveSubTab] = useState('profile') // 'profile' | 'about'
  const [profile, setProfile] = useState(() => userService.getUserProfile())
  const [name, setName] = useState(profile.name || 'Aliya Foodie')
  const [bio, setBio] = useState(profile.bio || '')
  const [city, setCity] = useState(profile.favoriteCity || 'Yogyakarta')
  const [avatar, setAvatar] = useState(profile.avatar || null)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleCopyId = () => {
    if (profile.userId) {
      navigator.clipboard.writeText(profile.userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setFeedback('Ukuran foto maksimal 2MB')
      setTimeout(() => setFeedback(''), 3000)
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setAvatar(base64)
      setFeedback('Foto profil diperbarui. Klik Simpan Profil.')
      setTimeout(() => setFeedback(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updated = {
      ...profile,
      name: name.trim() || 'Aliya Foodie',
      bio: bio.trim(),
      favoriteCity: city.trim(),
      avatar,
    }
    const res = userService.saveUserProfile(updated)
    if (res.success) {
      setProfile(res.data)
      setFeedback('Profil penikmat kuliner berhasil disimpan!')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  return (
    <div className="page-container">
      {/* Sub Tabs: Profil vs Tentang Aplikasi */}
      <div className="profile-about-subnav">
        <button
          type="button"
          className={`subnav-pill ${activeSubTab === 'profile' ? 'subnav-pill--active' : ''}`}
          onClick={() => setActiveSubTab('profile')}
        >
          <User size={16} /> Profil Penikmat Kuliner
        </button>
        <button
          type="button"
          className={`subnav-pill ${activeSubTab === 'about' ? 'subnav-pill--active' : ''}`}
          onClick={() => setActiveSubTab('about')}
        >
          <Info size={16} /> Tentang Aplikasi Lokarasa
        </button>
      </div>

      {feedback && (
        <div className="toast toast--success">
          <Check size={18} /> {feedback}
        </div>
      )}

      {/* =========================================================================
          TAB 1: PROFIL PENGGUNA
         ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="profile-layout">
          {/* User Hero Card */}
          <div className="user-hero-card">
            <div className="avatar-container">
              {avatar ? (
                <img src={avatar} alt={profile.name} className="avatar-img" />
              ) : (
                <div className="avatar-fallback">
                  <User size={40} />
                </div>
              )}
              <label htmlFor="avatar-upload" className="avatar-camera-btn" title="Ganti Foto Profil">
                <Camera size={14} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden-file-input"
                />
              </label>
            </div>

            <div className="user-meta-wrap">
              <h2 className="user-full-name">{profile.name}</h2>
              <span className="user-badge-role">
                <Sparkles size={12} className="inline-icon" /> Penjelajah Kuliner Nusantara
              </span>
              <div className="user-id-chip">
                <span>ID: {profile.userId?.substring(0, 16)}…</span>
                <button
                  type="button"
                  className="copy-chip-btn"
                  onClick={handleCopyId}
                  title="Salin User ID"
                >
                  {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <Bookmark size={22} className="stat-icon-fav" />
              <div className="stat-value">{favoritesCount}</div>
              <div className="stat-name">Tempat Tersimpan</div>
            </div>
            <div className="stat-card">
              <Sparkles size={22} className="stat-icon-gold" />
              <div className="stat-value">Eksplorer</div>
              <div className="stat-name">Tingkat Penikmat</div>
            </div>
            <div className="stat-card">
              <Award size={22} className="stat-icon-teal" />
              <div className="stat-value">{city}</div>
              <div className="stat-name">Kota Eksplorasi</div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="profile-edit-box">
            <h3 className="section-title">Edit Biodata Penikmat Kuliner</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="user-name">
                Nama Panggilan / Alias Foodie
              </label>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Nama Anda"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-city">
                Kota Domisili / Favorit Berburu Kuliner
              </label>
              <input
                id="user-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
                placeholder="Yogyakarta"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-bio">
                Catatan Selera &amp; Bio Singkat
              </label>
              <textarea
                id="user-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Contoh: Sangat suka masakan pedas, sate klathak, dan kopi nusantara..."
              />
            </div>

            <button type="submit" className="btn btn--primary">
              <Save size={16} /> Simpan Biodata
            </button>
          </form>

          {/* Quick Action: Replay Intro */}
          {onReplaySplash && (
            <div className="replay-intro-box">
              <div>
                <h4 className="replay-title">Animasi Pembuka</h4>
                <p className="replay-desc">Ingin melihat kembali splash screen animasi Lokarasa?</p>
              </div>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={onReplaySplash}
              >
                <Play size={14} /> Putar Ulang Intro
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: TENTANG APLIKASI LOKARASA
         ========================================================================= */}
      {activeSubTab === 'about' && (
        <div className="about-layout">
          {/* Identity Card */}
          <div className="about-identity-card">
            <div className="about-emblem-badge">
              <Sparkles size={28} />
            </div>
            <h2 className="about-app-name">Lokarasa</h2>
            <p className="about-tagline">
              Aplikasi Eksplorasi dan Rekomendasi Tempat Makan Berbasis Mobile PWA
            </p>
            <span className="pwa-version-badge">Versi 1.0.0 (Progressive Web App)</span>
          </div>

          {/* Academic / Project Info */}
          <div className="about-section-card">
            <h3 className="about-section-heading">
              <Award size={18} className="inline-icon" /> Informasi Tugas Akhir
            </h3>
            <div className="about-kv-grid">
              <div className="about-kv-row">
                <span className="kv-key">Mata Kuliah:</span>
                <span className="kv-val">Praktikum Pemrograman Perangkat Bergerak (PPB)</span>
              </div>
              <div className="about-kv-row">
                <span className="kv-key">Platform / Teknologi:</span>
                <span className="kv-val">Progressive Web Application (PWA) + Node.js Express</span>
              </div>
              <div className="about-kv-row">
                <span className="kv-key">Judul TA:</span>
                <span className="kv-val">Lokarasa: Aplikasi Eksplorasi dan Rekomendasi Tempat Makan Berbasis Mobile</span>
              </div>
              <div className="about-kv-row">
                <span className="kv-key">Database Backend:</span>
                <span className="kv-val">Supabase PostgreSQL (BaaS) / RESTful API Service</span>
              </div>
            </div>
          </div>

          {/* Architecture & Features */}
          <div className="about-section-card">
            <h3 className="about-section-heading">
              <Server size={18} className="inline-icon" /> Arsitektur Sesuai Modul Praktikum
            </h3>
            <ul className="about-feature-list">
              <li>
                <strong>Modul 1 &amp; 2 (RESTful Web Service):</strong> Backend mandiri menggunakan Express.js, arsitektur MVC (Model, Controller, Routes), CORS, dan database Supabase dengan skrip SQL migrasi lengkap.
              </li>
              <li>
                <strong>Modul 5 (PWA I - Application Shell &amp; Service Worker):</strong> Dibangun menggunakan React + Vite, Single Page Application (SPA), Bottom Navigation Bar, dan service worker manual/workbox untuk caching offline.
              </li>
              <li>
                <strong>Modul 6 (PWA II - API Integration &amp; Persistence):</strong> Integrasi frontend dengan Axios, custom hooks (useRestaurants, useFavorites, useReviews), error handling, modal konfirmasi, serta localStorage data persistence untuk favorit dan auto-save draft.
              </li>
            </ul>
          </div>

          {/* PWA Mobile Installation Guide */}
          <div className="about-section-card">
            <h3 className="about-section-heading">
              <Smartphone size={18} className="inline-icon" /> Panduan Instalasi di Smartphone
            </h3>
            <div className="pwa-steps-grid">
              <div className="pwa-step-card">
                <div className="pwa-step-num">1</div>
                <h4>Di Google Chrome (Android)</h4>
                <p>Buka link aplikasi di browser Chrome, ketuk ikon titik tiga di pojok kanan atas, lalu pilih <strong>&quot;Tambahkan ke Layar Utama&quot;</strong> atau <strong>&quot;Instal Aplikasi&quot;</strong>.</p>
              </div>
              <div className="pwa-step-card">
                <div className="pwa-step-num">2</div>
                <h4>Di Safari (iOS)</h4>
                <p>Buka link aplikasi di Safari, ketuk tombol <strong>Share</strong> (ikon kotak dengan panah ke atas), geser ke bawah dan pilih <strong>&quot;Add to Home Screen&quot;</strong>.</p>
              </div>
            </div>
          </div>

          {/* GitHub Upload Checklist */}
          <div className="about-section-card">
            <h3 className="about-section-heading">
              <Github size={18} className="inline-icon" /> Pengunggahan ke GitHub
            </h3>
            <p className="about-desc">
              Source code proyek Tugas Akhir ini terstruktur rapi dengan file `.gitignore`, `README.md` komprehensif, koleksi Postman, serta skrip SQL Supabase yang siap di-commit dan di-push ke repositori GitHub praktikan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
