import { Clock } from 'lucide-react'
import { getOperationalStatus } from '../../utils/helpers'
import { useCurrentTime } from '../../hooks/useCurrentTime'

/**
 * OperationalBadge — Menampilkan indikator status operasional real-time:
 * - Open Now (tanda hijau)
 * - Closed (tanda merah)
 * - Coming Soon (tanda kuning/oranye jika akan segera buka / Coming Soon)
 */
export default function OperationalBadge({
  openingHours,
  openingDate = null,
  variant = 'pill', // 'pill' | 'compact' | 'detail'
  showHours = true,
  showDetail = false,
}) {
  const now = useCurrentTime()
  const info = getOperationalStatus(openingHours, now, openingDate)

  if (variant === 'compact') {
    return (
      <div className="op-compact-wrap">
        <span className={`op-status-badge op-status-badge--${info.status}`}>
          <span className="op-status-dot" aria-hidden="true" />
          <span>{info.label}</span>
        </span>
        {showHours && (
          <span className="op-hours-inline">
            <Clock size={11} />
            <span>{info.hoursText}</span>
          </span>
        )}
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className={`op-detail-card op-detail-card--${info.status}`}>
        <div className="op-detail-left">
          <span className={`op-status-badge op-status-badge--${info.status} op-status-badge--lg`}>
            <span className="op-status-dot" aria-hidden="true" />
            <span>{info.label}</span>
          </span>
          {info.detail && <span className="op-detail-sub">{info.detail}</span>}
        </div>
        {showHours && (
          <div className="op-detail-hours">
            <Clock size={14} />
            <span>{info.hoursText}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <span
      className={`op-status-badge op-status-badge--${info.status}`}
      title={`${info.label}${info.detail ? ` • ${info.detail}` : ''} (${info.hoursText})`}
    >
      <span className="op-status-dot" aria-hidden="true" />
      <span>{info.label}</span>
      {showDetail && info.detail && <span className="op-badge-sep">• {info.detail}</span>}
    </span>
  )
}
