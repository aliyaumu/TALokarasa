import { AlertCircle } from 'lucide-react'

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
  if (!open) return null

  const finalConfirmLabel = confirmText || confirmLabel
  const finalCancelLabel = cancelText || cancelLabel

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className={`modal-icon-badge ${danger ? 'modal-icon-badge--danger' : ''}`}>
            <AlertCircle size={24} />
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onCancel}
            disabled={loading}
          >
            {finalCancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Memproses…' : finalConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
