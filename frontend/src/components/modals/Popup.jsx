import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Popup.css'

/**
 * Popup — pembungkus popup/modal dasar.
 * Dirender lewat portal ke <body> dengan z-index sangat tinggi, sehingga tidak
 * pernah tertutup oleh header, bottom nav, atau elemen melayang lain.
 * Menutup dengan tombol Esc dan klik area gelap (kalau onClose diberikan).
 */
export default function Popup({ open, onClose, children, className = '', labelledBy }) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && onCloseRef.current) onCloseRef.current()
    }
    document.addEventListener('keydown', onKeyDown)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // kunci scroll halaman di belakang

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="lk-popup-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && onCloseRef.current) onCloseRef.current()
      }}
    >
      <div
        className={`lk-popup-card ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}