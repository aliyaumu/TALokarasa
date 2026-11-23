import { Trash2, AlertTriangle } from 'lucide-react'
import Popup from './Popup'

/**
 * ConfirmModal — popup konfirmasi (hapus, dll).
 * Props sama seperti versi lama, jadi semua pemanggil tidak perlu diubah.
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  confirmText,
  cancelLabel = 'Batal',
  cancelText,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const finalConfirmLabel = confirmText || confirmLabel
  const finalCancelLabel = cancelText || cancelLabel

  return (
    <Popup
      open={Boolean(open)}
      onClose={loading ? undefined : onCancel}
      labelledBy="lk-confirm-title"
    >
      <div className={`lk-popup-icon ${danger ? 'lk-popup-icon--danger' : ''}`}>
        {danger ? <Trash2 size={26} /> : <AlertTriangle size={26} />}
      </div>
      <h3 id="lk-confirm-title" className="lk-popup-title">{title}</h3>
      <p className="lk-popup-message">{message}</p>

      <div className="lk-popup-actions">
        <button
          type="button"
          className="lk-btn lk-btn--ghost"
          onClick={onCancel}
          disabled={loading}
        >
          {finalCancelLabel}
        </button>
        <button
          type="button"
          className={`lk-btn ${danger ? 'lk-btn--danger' : 'lk-btn--primary'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Memproses…' : finalConfirmLabel}
        </button>
      </div>
    </Popup>
  )
}