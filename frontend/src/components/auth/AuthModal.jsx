import { useState } from 'react'
import { X, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { loginUser, registerUser } from '../../services/userService'

export default function AuthModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (tab === 'login') {
        const res = await loginUser(email, password)
        if (res.success) {
          setSuccessMsg('Login berhasil! Selamat datang kembali.')
          setTimeout(() => {
            if (onSuccess) onSuccess(res.data)
            onClose()
          }, 800)
        } else {
          setErrorMsg(res.message || 'Gagal masuk akun.')
        }
      } else {
        const res = await registerUser(name, email, password)
        if (res.success) {
          setSuccessMsg('Pendaftaran berhasil! Akun Anda telah siap.')
          setTimeout(() => {
            if (onSuccess) onSuccess(res.data)
            onClose()
          }, 800)
        } else {
          setErrorMsg(res.message || 'Gagal mendaftar akun.')
        }
      }
    } catch {
      setErrorMsg('Terjadi kendala saat menghubungkan akun.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = () => {
    setEmail('saras@lokarasa.id')
    setPassword('semarang123')
    setName('Saraswati Putri')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="auth-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={24} color="#f97316" />
          </div>
          <h2 className="auth-title">
            {tab === 'login' ? 'Masuk ke Lokarasa' : 'Daftar Akun Baru'}
          </h2>
          <p className="auth-subtitle">
            {tab === 'login'
              ? 'Akses ulasan, simpan tempat makan favorit, dan jelajahi kuliner Semarang.'
              : 'Bergabunglah bersama komunitas pecinta kuliner khas Semarang.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'auth-tab-btn--active' : ''}`}
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'register' ? 'auth-tab-btn--active' : ''}`}
            onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Daftar
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="auth-toast auth-toast--error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="auth-toast auth-toast--success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {tab === 'register' && (
            <div className="auth-input-group">
              <label className="auth-label">Nama Lengkap</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Contoh: Saraswati Putri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label className="auth-label">Alamat Email</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Kata Sandi</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Memproses…</span>
            ) : (
              <>
                <span>{tab === 'login' ? 'Masuk Sekarang' : 'Buat Akun'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Quick Demo Button */}
          <button
            type="button"
            className="auth-demo-btn"
            onClick={handleQuickDemo}
          >
            ⚡ Isi Akun Demo Cepat (Saraswati)
          </button>
        </form>
      </div>
    </div>
  )
}
