import { useState } from 'react'
import {
  User,
  Settings,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  LogIn,
  Heart,
  ChevronRight,
  Info,
  Check,
  Edit2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import userService from '../services/userService'

export default function ProfileAboutPage({
  userProfile,
  onProfileUpdate,
  onOpenAuth,
  favoritesCount = 0,
  onNavigateFavorites,
}) {
  const [showAboutDetail, setShowAboutDetail] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(userProfile?.name || 'Saraswati Putri')
  const [editBio, setEditBio] = useState(userProfile?.bio || '')
  const [feedback, setFeedback] = useState('')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updated = {
      ...userProfile,
      name: editName.trim() || 'Foodie',
      bio: editBio.trim(),
    }
    const res = userService.saveUserProfile(updated)
    if (res.success) {
      if (onProfileUpdate) onProfileUpdate(res.data)
      setIsEditing(false)
      setFeedback('Profil berhasil diperbarui!')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const handleLogout = () => {
    userService.logoutUser()
    if (onProfileUpdate) {
      onProfileUpdate({ ...userProfile, isLoggedIn: false })
    }
  }

  // If user opened "Tentang Aplikasi" (Matching Image 4 Screen 8)
  if (showAboutDetail) {
    return (
      <div className="about-screen-wrapper">
        <div className="about-screen-header">
          <button
            type="button"
            className="about-back-btn"
            onClick={() => setShowAboutDetail(false)}
            aria-label="Kembali ke profil"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="about-header-title">Tentang Aplikasi</h2>
        </div>

        <div className="about-screen-content">
          <div className="about-emblem-box">
            <div className="about-chef-hat">
              <Sparkles size={36} color="#ffffff" />
            </div>
            <h1 className="about-app-title">Lokarasa</h1>
            <span className="about-app-version">v1.0.0 · Progressive Web App</span>
          </div>

          <div className="about-desc-card">
            <h3 className="about-card-heading">Aplikasi Eksplorasi &amp; Rekomendasi Tempat Makan Berbasis Mobile</h3>
            <p className="about-card-paragraph">
              Temukan berbagai tempat makan terbaik di Semarang, jelajahi kuliner favorit seperti <strong>Kedai Tinari</strong>, <strong>Kedai Melimbah</strong>, <strong>Sami Seneng</strong>, <strong>Bak Mie Serangkai</strong>, dan simpan rekomendasi pilihanmu!
            </p>
          </div>

          <div className="about-features-card">
            <h4 className="about-feature-title">Fitur Unggulan</h4>
            <ul className="about-feature-list">
              <li>✨ <strong>Eksplorasi Kuliner Semarang:</strong> Katalog lengkap dengan harga, jam operasional, ulasan komunitas, dan rute lokasi.</li>
              <li>❤️ <strong>Koleksi Favorit:</strong> Simpan tempat makan yang ingin kamu kunjungi secara offline.</li>
              <li>⭐ <strong>Ulasan &amp; Rating:</strong> Bagikan pengalaman kulinermu langsung tersinkronisasi dengan REST API Supabase.</li>
              <li>📱 <strong>Responsif Web &amp; Mobile:</strong> Tampilan adaptif yang nyaman digunakan di smartphone maupun laptop/PC.</li>
            </ul>
          </div>

          {/* Academic Info */}
          <div className="about-academic-card">
            <div className="academic-row">
              <span>Pengembang:</span>
              <strong>Aliya (Praktikan PPB)</strong>
            </div>
            <div className="academic-row">
              <span>Teknologi:</span>
              <strong>React 19 + Vite + Express + Supabase</strong>
            </div>
            <div className="academic-row">
              <span>Kota Fokus:</span>
              <strong>Semarang, Jawa Tengah</strong>
            </div>
          </div>

          <div className="about-footer-tag">
            <span>Dibuat dengan ❤️ untuk pecinta kuliner Nusantara</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page-container">
      <h1 className="profile-main-title">Profile</h1>

      {feedback && (
        <div className="profile-toast-success">
          <Check size={16} /> <span>{feedback}</span>
        </div>
      )}

      {/* User Card (Matching Image 3 & Image 4 Screen 7) */}
      <div className="profile-user-card">
        <div className="profile-avatar-circle">
          <User size={36} color="#ffffff" />
        </div>

        <div className="profile-user-info">
          <div className="profile-user-name-row">
            <h2 className="profile-user-name">{userProfile?.name || 'Pengguna'}</h2>
            <button
              type="button"
              className="profile-edit-trigger"
              onClick={() => setIsEditing(!isEditing)}
              title="Edit Profil"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <span className="profile-user-email">
            {userProfile?.isLoggedIn ? userProfile.email : 'user@mail.com (Tamu)'}
          </span>
          <span className="profile-city-badge">Semarang Foodie</span>
        </div>
      </div>

      {/* Edit Profil Form Accordion */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="profile-inline-form">
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="dark-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bio Selera Kuliner</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="dark-textarea"
              rows={2}
            />
          </div>
          <div className="form-btn-row">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setIsEditing(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn--primary btn--sm">
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* ACCOUNT SETTINGS (Image 3) */}
      <div className="settings-group">
        <span className="settings-group-label">ACCOUNT SETTINGS</span>

        <div className="settings-item-card" onClick={onNavigateFavorites}>
          <div className="settings-icon-box" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Heart size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Favorit Saya</span>
            <span className="settings-desc">{favoritesCount} tempat tersimpan</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Settings size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Pengaturan</span>
            <span className="settings-desc">Preferensi rekomendasi kuliner</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        {/* Notifications Switch */}
        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
            <Bell size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Notifikasi Rekomendasi</span>
            <span className="settings-desc">Promo &amp; kuliner viral mingguan</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Theme Setting */}
        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Moon size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Tema Aplikasi</span>
            <span className="settings-desc">Mode Gelap (Dark Mode)</span>
          </div>
          <span className="settings-value-pill">Dark</span>
        </div>

        {/* Language */}
        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6' }}>
            <Globe size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Bahasa</span>
            <span className="settings-desc">Indonesia</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <HelpCircle size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Bantuan &amp; FAQ</span>
            <span className="settings-desc">Panduan cara menggunakan Lokarasa</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>
      </div>

      {/* LEGAL & PRIVACY / ABOUT */}
      <div className="settings-group">
        <span className="settings-group-label">LEGAL &amp; PRIVACY</span>

        <div className="settings-item-card" onClick={() => setShowAboutDetail(true)}>
          <div className="settings-icon-box" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Info size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Tentang Aplikasi</span>
            <span className="settings-desc">Informasi Tugas Akhir &amp; Versi PWA</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Shield size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Kebijakan Privasi</span>
            <span className="settings-desc">Perlindungan data pengguna</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        <div className="settings-item-card">
          <div className="settings-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <FileText size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Ketentuan Layanan</span>
            <span className="settings-desc">Syarat penggunaan aplikasi</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>
      </div>

      {/* Auth Action (Sign In / Logout) */}
      <div className="settings-group">
        {userProfile?.isLoggedIn ? (
          <button
            type="button"
            className="settings-auth-btn settings-auth-btn--logout"
            onClick={handleLogout}
          >
            <div className="settings-icon-box auth-icon-box--logout">
              <LogOut size={18} />
            </div>
            <span className="settings-auth-label">Keluar dari Akun</span>
          </button>
        ) : (
          <button
            type="button"
            className="settings-auth-btn settings-auth-btn--login"
            onClick={onOpenAuth}
          >
            <div className="settings-icon-box auth-icon-box--login">
              <LogIn size={18} />
            </div>
            <span className="settings-auth-label">Masuk / Daftar Akun</span>
          </button>
        )}
      </div>
    </div>
  )
}
