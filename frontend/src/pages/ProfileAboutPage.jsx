import { useState, useEffect } from 'react'
import {
  User,
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  LogIn,
  Heart,
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  Edit2,
  Sparkles,
  ArrowLeft,
  X,
  Sliders,
  Database,
  Trash2,
  Smartphone,
} from 'lucide-react'
import userService from '../services/userService'

export default function ProfileAboutPage({
  userProfile,
  onProfileUpdate,
  onOpenAuth,
  favoritesCount = 0,
  onNavigateFavorites,
}) {
  // Navigation for sub-screens: 'about' | 'privacy' | 'terms' | 'faq' | 'settings' | 'language' | null
  const [activeSubView, setActiveSubView] = useState(null)

  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('lokarasa_theme') || 'Dark')
  const [language, setLanguage] = useState(() => localStorage.getItem('lokarasa_lang') || 'Indonesia')
  const [searchRadius, setSearchRadius] = useState(5)
  const [defaultPriceRange, setDefaultPriceRange] = useState('Semua')

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Edit Profile Form
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(userProfile?.name || 'Saraswati Putri')
  const [editBio, setEditBio] = useState(userProfile?.bio || '')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.name || 'Saraswati Putri')
      setEditBio(userProfile.bio || '')
    }
  }, [userProfile])

  const showToast = (msg) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 3500)
  }

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
      showToast('Profil berhasil diperbarui!')
    }
  }

  const handleLogout = () => {
    userService.logoutUser()
    if (onProfileUpdate) {
      onProfileUpdate({ ...userProfile, isLoggedIn: false })
    }
    showToast('Berhasil keluar dari akun.')
  }

  const handleToggleTheme = () => {
    const nextTheme = themeMode === 'Dark' ? 'Light' : 'Dark'
    setThemeMode(nextTheme)
    localStorage.setItem('lokarasa_theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme.toLowerCase())
    showToast(`Tema diubah ke Mode ${nextTheme}`)
  }

  const handleSelectLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('lokarasa_lang', lang)
    setActiveSubView(null)
    showToast(`Bahasa diatur ke ${lang === 'Indonesia' ? 'Bahasa Indonesia' : 'English'}`)
  }

  const handleClearCache = () => {
    localStorage.removeItem('lokarasa_custom_restaurants')
    showToast('Cache data lokal dan draft telah dibersihkan.')
  }

  // --------------------------------------------------------------------------
  // SUB-VIEW: TENTANG APLIKASI (Image 4 Screen 8)
  // --------------------------------------------------------------------------
  if (activeSubView === 'about') {
    return (
      <div className="sub-screen-wrapper">
        <div className="sub-screen-header">
          <button
            type="button"
            className="sub-back-btn"
            onClick={() => setActiveSubView(null)}
            aria-label="Kembali ke profil"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="sub-header-title">Tentang Aplikasi</h2>
        </div>

        <div className="sub-screen-content">
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
              <li>➕ <strong>CRUD Rekomendasi (Tambah &amp; Edit):</strong> Pengguna dapat menambahkan dan memperbarui rekomendasi tempat makan baru ke API.</li>
              <li>❤️ <strong>Koleksi Favorit:</strong> Simpan tempat makan yang ingin kamu kunjungi secara offline.</li>
              <li>⭐ <strong>Ulasan &amp; Rating:</strong> Bagikan pengalaman kulinermu langsung tersinkronisasi dengan REST API Supabase.</li>
              <li>📱 <strong>PWA &amp; Offline Cache:</strong> Berjalan lancar di smartphone dan browser bahkan saat koneksi internet terputus.</li>
            </ul>
          </div>

          <div className="about-academic-card">
            <div className="academic-row">
              <span>Pengembang:</span>
              <strong>Aliya (Praktikan PPB)</strong>
            </div>
            <div className="academic-row">
              <span>Teknologi:</span>
              <strong>React 19 + Vite + Express + Supabase PWA</strong>
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

  // --------------------------------------------------------------------------
  // SUB-VIEW: KEBIJAKAN PRIVASI (Privacy Policy)
  // --------------------------------------------------------------------------
  if (activeSubView === 'privacy') {
    return (
      <div className="sub-screen-wrapper">
        <div className="sub-screen-header">
          <button
            type="button"
            className="sub-back-btn"
            onClick={() => setActiveSubView(null)}
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="sub-header-title">Kebijakan Privasi</h2>
        </div>

        <div className="sub-screen-content">
          <div className="legal-doc-card">
            <div className="legal-icon-title">
              <Shield size={24} className="accent-orange" />
              <h3>Privasi Pengguna Lokarasa</h3>
            </div>
            <p className="legal-p">
              Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana Lokarasa mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi.
            </p>

            <h4 className="legal-h4">1. Informasi yang Dikumpulkan</h4>
            <p className="legal-p">
              Lokarasa hanya mengumpulkan informasi yang Anda berikan secara sukarela, seperti nama akun, email pendaftaran, ulasan kuliner, rating bintang, dan tempat makan yang Anda rekomendasikan ke database.
            </p>

            <h4 className="legal-h4">2. Penyimpanan Data Offline (PWA)</h4>
            <p className="legal-p">
              Sebagai Progressive Web App (PWA), Lokarasa menggunakan penyimpanan cache lokal di perangkat Anda (LocalStorage dan Cache API) untuk menyimpan daftar restoran favorit dan draft agar dapat diakses tanpa koneksi internet.
            </p>

            <h4 className="legal-h4">3. Keamanan Data</h4>
            <p className="legal-p">
              Data Anda disimpan dengan aman pada infrastruktur cloud Supabase yang terenkripsi dan terlindungi. Kami tidak pernah membagikan atau menjual data pribadi Anda kepada pihak ketiga.
            </p>

            <h4 className="legal-h4">4. Hak Pengguna</h4>
            <p className="legal-p">
              Anda berhak mengedit profil akun Anda kapan saja, menghapus data tempat makan yang Anda tambahkan, atau membersihkan cache offline melalui menu pengaturan.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // SUB-VIEW: KETENTUAN LAYANAN (Terms of Service)
  // --------------------------------------------------------------------------
  if (activeSubView === 'terms') {
    return (
      <div className="sub-screen-wrapper">
        <div className="sub-screen-header">
          <button
            type="button"
            className="sub-back-btn"
            onClick={() => setActiveSubView(null)}
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="sub-header-title">Ketentuan Layanan</h2>
        </div>

        <div className="sub-screen-content">
          <div className="legal-doc-card">
            <div className="legal-icon-title">
              <FileText size={24} className="accent-orange" />
              <h3>Syarat &amp; Ketentuan Penggunaan</h3>
            </div>

            <p className="legal-p">
              Dengan mengakses dan menggunakan aplikasi Lokarasa, Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut:
            </p>

            <h4 className="legal-h4">1. Penggunaan Aplikasi</h4>
            <p className="legal-p">
              Aplikasi ini dikembangkan untuk tujuan edukasi dan eksplorasi kuliner di Kota Semarang. Pengguna diharapkan memberikan informasi tempat makan dan ulasan yang jujur, santun, dan bermanfaat bagi sesama pencinta kuliner.
            </p>

            <h4 className="legal-h4">2. Konten Ulasan &amp; Rekomendasi</h4>
            <p className="legal-p">
              Dilarang mengunggah konten yang mengandung unsur SARA, ujaran kebencian, spam, atau promosi palsu. Pengelola aplikasi berhak menyunting atau menghapus data rekomendasi yang terbukti tidak akurat.
            </p>

            <h4 className="legal-h4">3. Ketepatan Harga &amp; Jam Buka</h4>
            <p className="legal-p">
              Informasi harga menu, nomor kontak, dan jam operasional dapat berubah sewaktu-waktu sesuai dengan kebijakan masing-masing pemilik usaha kuliner di Semarang.
            </p>

            <h4 className="legal-h4">4. Hak Cipta &amp; Lisensi</h4>
            <p className="legal-p">
              Aplikasi Lokarasa dibangun sebagai karya Tugas Akhir Praktikum Pemrograman Perangkat Bergerak (PPB) dengan lisensi terbuka untuk keperluan akademik.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // SUB-VIEW: BANTUAN & FAQ
  // --------------------------------------------------------------------------
  if (activeSubView === 'faq') {
    const faqItems = [
      {
        q: 'Bagaimana cara menambahkan rekomendasi tempat makan baru (CRUD)?',
        a: 'Tekan tombol "+" (Tambah) yang berada di tengah Bottom Navigation Bar. Isi formulir nama, kategori kuliner Semarang, alamat, estimasi harga, dan menu andalan, lalu klik "Simpan Tempat Makan". Tempat makan Anda akan langsung muncul di halaman Beranda dan Explore!',
      },
      {
        q: 'Bagaimana cara menyimpan tempat makan ke daftar Favorit?',
        a: 'Tekan ikon Hati pada kartu makanan di Beranda, halaman Explore, atau di halaman Detail tempat makan. Tempat makan yang disimpan akan otomatis masuk ke tab "Favorit" dan bisa dilihat kapan saja.',
      },
      {
        q: 'Apakah aplikasi Lokarasa bisa digunakan saat offline (tanpa kuota)?',
        a: 'Ya! Lokarasa adalah Progressive Web App (PWA). Seluruh aset dan data tempat makan yang pernah Anda buka akan disimpan di cache perangkat, sehingga Anda tetap dapat melihat menu, alamat, dan daftar favorit meskipun sedang tidak ada koneksi internet.',
      },
      {
        q: 'Bagaimana cara memberikan ulasan dan rating bintang?',
        a: 'Buka salah satu tempat makan dari daftar, gulir ke bagian bawah halaman Detail tempat makan, pilih jumlah bintang rating (1 - 5), ketik komentar pengalaman kuliner Anda, lalu tekan "Kirim Ulasan". Ulasan akan langsung tersinkronisasi ke API Supabase.',
      },
      {
        q: 'Bagaimana cara memasang aplikasi ini di layar utama HP?',
        a: 'Buka aplikasi Lokarasa di browser smartphone Anda (Chrome atau Safari), tekan banner "Pasang Lokarasa" yang muncul di bawah, atau buka menu browser (titik tiga) lalu pilih "Tambahkan ke Layar Utama" (Add to Home Screen).',
      },
    ]

    return (
      <div className="sub-screen-wrapper">
        <div className="sub-screen-header">
          <button
            type="button"
            className="sub-back-btn"
            onClick={() => setActiveSubView(null)}
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="sub-header-title">Bantuan &amp; FAQ</h2>
        </div>

        <div className="sub-screen-content">
          <div className="faq-intro-card">
            <HelpCircle size={28} className="accent-orange" />
            <h3 className="faq-intro-title">Pertanyaan Sering Diajukan</h3>
            <p className="faq-intro-sub">Panduan lengkap menggunakan fitur aplikasi Lokarasa.</p>
          </div>

          <div className="faq-accordion-list">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className={`faq-accordion-card ${isOpen ? 'active' : ''}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                >
                  <div className="faq-card-head">
                    <span className="faq-question-text">{item.q}</span>
                    <ChevronDown size={18} className={`faq-arrow-icon ${isOpen ? 'rotate' : ''}`} />
                  </div>
                  {isOpen && (
                    <div className="faq-card-body">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // SUB-VIEW: PENGATURAN (Settings)
  // --------------------------------------------------------------------------
  if (activeSubView === 'settings') {
    return (
      <div className="sub-screen-wrapper">
        <div className="sub-screen-header">
          <button
            type="button"
            className="sub-back-btn"
            onClick={() => setActiveSubView(null)}
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="sub-header-title">Pengaturan Aplikasi</h2>
        </div>

        <div className="sub-screen-content">
          {/* Radius Pencarian */}
          <div className="settings-panel-card">
            <div className="panel-title-row">
              <Sliders size={18} className="accent-orange" />
              <h3 className="panel-title">Radius Rekomendasi Kuliner</h3>
            </div>
            <p className="panel-desc">Jangkauan jarak pencarian tempat makan dari posisimu di Semarang.</p>

            <div className="radius-slider-wrap">
              <div className="radius-value-badge">{searchRadius} km</div>
              <input
                type="range"
                min="1"
                max="20"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="radius-range-input"
              />
              <div className="slider-labels">
                <span>1 km (Dekat)</span>
                <span>10 km</span>
                <span>20 km (Seluruh Semarang)</span>
              </div>
            </div>
          </div>

          {/* Preferensi Harga */}
          <div className="settings-panel-card">
            <h3 className="panel-title">Filter Kisaran Harga Standar</h3>
            <p className="panel-desc">Pilihan kisaran harga yang diutamakan pada hasil pencarian.</p>

            <div className="price-pref-chips">
              {['Semua', '$ (Hemat < 20rb)', '$$ (Menengah 20-50rb)', '$$$ (Mewah > 50rb)'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`pref-chip ${defaultPriceRange === p ? 'active' : ''}`}
                  onClick={() => {
                    setDefaultPriceRange(p)
                    showToast(`Filter harga diatur ke: ${p}`)
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Storage & Cache */}
          <div className="settings-panel-card">
            <div className="panel-title-row">
              <Database size={18} className="accent-orange" />
              <h3 className="panel-title">Penyimpanan &amp; Cache PWA</h3>
            </div>
            <p className="panel-desc">Kelola data offline dan draft tempat makan di penyimpanan lokal.</p>

            <button
              type="button"
              className="btn btn--outline btn--full btn-clear-cache"
              onClick={handleClearCache}
            >
              <Trash2 size={16} /> Bersihkan Cache Lokal &amp; Draft
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // MODAL: PILIHAN BAHASA
  // --------------------------------------------------------------------------
  const renderLanguageModal = () => {
    if (activeSubView !== 'language') return null
    return (
      <div className="modal-backdrop" onClick={() => setActiveSubView(null)}>
        <div className="modal-box language-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-icon-badge">
              <Globe size={22} color="#f97316" />
            </div>
            <h3 className="modal-title">Pilih Bahasa Aplikasi</h3>
          </div>

          <div className="language-options-list">
            <button
              type="button"
              className={`lang-option-card ${language === 'Indonesia' ? 'active' : ''}`}
              onClick={() => handleSelectLanguage('Indonesia')}
            >
              <span className="lang-flag">🇮🇩</span>
              <div className="lang-info">
                <span className="lang-name">Bahasa Indonesia</span>
                <span className="lang-sub">Bahasa Utama (Rekomendasi)</span>
              </div>
              {language === 'Indonesia' && <Check size={18} className="accent-orange" />}
            </button>

            <button
              type="button"
              className={`lang-option-card ${language === 'English' ? 'active' : ''}`}
              onClick={() => handleSelectLanguage('English')}
            >
              <span className="lang-flag">🇬🇧</span>
              <div className="lang-info">
                <span className="lang-name">English</span>
                <span className="lang-sub">International Language</span>
              </div>
              {language === 'English' && <Check size={18} className="accent-orange" />}
            </button>
          </div>

          <button
            type="button"
            className="btn btn--outline btn--full"
            onClick={() => setActiveSubView(null)}
          >
            Tutup
          </button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // MAIN PROFILE SCREEN (Image 3 & Image 4 Screen 7)
  // --------------------------------------------------------------------------
  return (
    <div className="profile-page-container">
      <h1 className="profile-main-title">Profile</h1>

      {feedback && (
        <div className="profile-toast-success">
          <Check size={16} /> <span>{feedback}</span>
        </div>
      )}

      {/* User Card */}
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
              title="Edit Nama / Profil"
              aria-label="Edit Profil"
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
              placeholder="Contoh: Pemburu kuliner pedas & bakmie Tembalang..."
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
              Simpan Profil
            </button>
          </div>
        </form>
      )}

      {/* ACCOUNT SETTINGS (Image 3) */}
      <div className="settings-group">
        <span className="settings-group-label">ACCOUNT SETTINGS</span>

        {/* 1. Favorit Saya */}
        <div className="settings-item-card" onClick={onNavigateFavorites}>
          <div className="settings-icon-box" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Heart size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Favorit Saya</span>
            <span className="settings-desc">{favoritesCount} tempat kuliner tersimpan</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        {/* 2. Pengaturan */}
        <div className="settings-item-card" onClick={() => setActiveSubView('settings')}>
          <div className="settings-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Settings size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Pengaturan</span>
            <span className="settings-desc">Radius lokasi, harga, dan cache</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        {/* 3. Notifikasi Rekomendasi (Toggle Switch) */}
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
              onChange={(e) => {
                setNotificationsEnabled(e.target.checked)
                showToast(e.target.checked ? 'Notifikasi diaktifkan' : 'Notifikasi dinonaktifkan')
              }}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* 4. Tema Aplikasi (Switch Dark/Light) */}
        <div className="settings-item-card" onClick={handleToggleTheme}>
          <div className="settings-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            {themeMode === 'Dark' ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Tema Aplikasi</span>
            <span className="settings-desc">Sentuh untuk beralih mode gelap / terang</span>
          </div>
          <span className="settings-value-pill">{themeMode}</span>
        </div>

        {/* 5. Bahasa */}
        <div className="settings-item-card" onClick={() => setActiveSubView('language')}>
          <div className="settings-icon-box" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6' }}>
            <Globe size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Bahasa</span>
            <span className="settings-desc">{language}</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        {/* 6. Bantuan & FAQ */}
        <div className="settings-item-card" onClick={() => setActiveSubView('faq')}>
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

        {/* 7. Tentang Aplikasi */}
        <div className="settings-item-card" onClick={() => setActiveSubView('about')}>
          <div className="settings-icon-box" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Info size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Tentang Aplikasi</span>
            <span className="settings-desc">Informasi Tugas Akhir &amp; Versi PWA</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        {/* 8. Kebijakan Privasi */}
        <div className="settings-item-card" onClick={() => setActiveSubView('privacy')}>
          <div className="settings-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Shield size={18} />
          </div>
          <div className="settings-item-text">
            <span className="settings-title">Kebijakan Privasi</span>
            <span className="settings-desc">Perlindungan data pengguna</span>
          </div>
          <ChevronRight size={18} className="settings-arrow" />
        </div>

        {/* 9. Ketentuan Layanan */}
        <div className="settings-item-card" onClick={() => setActiveSubView('terms')}>
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

      {/* Language Modal */}
      {renderLanguageModal()}
    </div>
  )
}
