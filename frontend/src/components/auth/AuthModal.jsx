import { useState, useEffect } from 'react'
import {
  X, Lock, Mail, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Sparkles,
} from 'lucide-react'
import Popup from '../modals/Popup'
import { loginUser, registerUser } from '../../services/userService'

/**
 * AuthModal — popup Masuk / Daftar.
 * Menerima `open` maupun `isOpen` supaya tidak salah nama prop lagi.
 */
export default function AuthModal({ open, isOpen, onClose, onSuccess }) {
  const visible = Boolean(open ?? isOpen)

  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Setiap kali popup dibuka: bersihkan pesan & kata sandi lama
  useEffect(() => {
    if (visible) {
      setErrorMsg('')
      setSuccessMsg('')
      setPassword('')
      setShowPassword(false)
      setLoading(false)
    }
  }, [visible])

  const switchTab = (next) => {
    setTab(next)
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res =
        tab === 'login'
          ? await loginUser(email.trim(), password)
          : await registerUser(name, email, password)

      if (res.success) {
        setSuccessMsg(
          tab === 'login'
            ? 'Login berhasil! Selamat datang kembali.'
            : 'Pendaftaran berhasil! Akun Anda telah siap.'
        )
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data)
          if (onClose) onClose()
        }, 700)
      } else {
        setErrorMsg(res.message || (tab === 'login' ? 'Gagal masuk akun.' : 'Gagal mendaftar akun.'))
      }
    } catch {
      setErrorMsg('Terjadi kendala saat menghubungkan akun.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = () => {
    setEmail('aliya@lokarasa.id')
    setPassword('semarang123')
    setName('Aliya Umu')
    setErrorMsg('')
  }

  return (
    <Popup open={visible} onClose={onClose} className="lk-auth" labelledBy="lk-auth-title">
      <button type="button" className="lk-popup-close" onClick={onClose} aria-label="Tutup">
        <X size={18} />
      </button>

      <div className="lk-auth-head">
        <div className="lk-popup-icon">
          <Sparkles size={26} />
        </div>
        <h3 id="lk-auth-title" className="lk-popup-title">
          {tab === 'login' ? 'Masuk ke Lokarasa' : 'Daftar Akun Baru'}
        </h3>
        <p className="lk-popup-message">
          {tab === 'login'
            ? 'Akses ulasan, simpan tempat makan favorit, dan jelajahi kuliner Semarang.'
            : 'Bergabunglah bersama komunitas pecinta kuliner khas Semarang.'}
        </p>
      </div>

      <div className="lk-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'login'}
          className={`lk-tab ${tab === 'login' ? 'lk-tab--active' : ''}`}
          onClick={() => switchTab('login')}
        >
          Masuk
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'register'}
          className={`lk-tab ${tab === 'register' ? 'lk-tab--active' : ''}`}
          onClick={() => switchTab('register')}
        >
          Daftar
        </button>
      </div>

      {errorMsg && (
        <div className="lk-toast lk-toast--error" role="alert">
          <AlertCircle size={16} /> <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="lk-toast lk-toast--success" role="status">
          <CheckCircle2 size={16} /> <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {tab === 'register' && (
          <div className="lk-field">
            <label className="lk-label" htmlFor="lk-auth-name">Nama Lengkap</label>
            <div className="lk-input-wrap">
              <User size={18} className="lk-input-icon" />
              <input
                id="lk-auth-name"
                type="text"
                className="lk-input"
                placeholder="Contoh: Aliya Umu"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="lk-field">
          <label className="lk-label" htmlFor="lk-auth-email">Alamat Email</label>
          <div className="lk-input-wrap">
            <Mail size={18} className="lk-input-icon" />
            <input
              id="lk-auth-email"
              type="email"
              className="lk-input"
              placeholder="nama@email.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="lk-field">
          <label className="lk-label" htmlFor="lk-auth-password">Kata Sandi</label>
          <div className="lk-input-wrap">
            <Lock size={18} className="lk-input-icon" />
            <input
              id="lk-auth-password"
              type={showPassword ? 'text' : 'password'}
              className="lk-input"
              placeholder="Minimal 6 karakter"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="lk-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button type="submit" className="lk-btn lk-btn--primary lk-submit" disabled={loading}>
          {loading ? (
            <span>Memproses…</span>
          ) : (
            <>
              <span>{tab === 'login' ? 'Masuk Sekarang' : 'Buat Akun'}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <button type="button" className="lk-demo" onClick={handleQuickDemo}>
          ⚡ Isi Akun Demo Cepat (Aliya)
        </button>
      </form>
    </Popup>
  )
}