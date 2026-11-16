// ---------------------------------------------------------------------------
// draftStorage.js — Auto-save & Restore Draft Formulir Restoran via localStorage
// Mendukung data persistence saat offline atau aplikasi tertutup secara tak sengaja.
// ---------------------------------------------------------------------------

const DRAFT_PREFIX = 'lokarasa_draft_'
const TS_SUFFIX = '_ts'

export const saveDraft = (draftData, draftId = 'create') => {
  try {
    const key = `${DRAFT_PREFIX}${draftId}`
    const ts = new Date().toISOString()
    localStorage.setItem(key, JSON.stringify({ ...draftData, savedAt: ts }))
    localStorage.setItem(`${key}${TS_SUFFIX}`, ts)
    return true
  } catch {
    return false
  }
}

export const loadDraft = (draftId = 'create') => {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${draftId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const deleteDraft = (draftId = 'create') => {
  try {
    const key = `${DRAFT_PREFIX}${draftId}`
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}${TS_SUFFIX}`)
    return true
  } catch {
    return false
  }
}

export const hasDraft = (draftId = 'create') => {
  try {
    return localStorage.getItem(`${DRAFT_PREFIX}${draftId}`) !== null
  } catch {
    return false
  }
}

export const getDraftTimestamp = (draftId = 'create') => {
  try {
    return localStorage.getItem(`${DRAFT_PREFIX}${draftId}${TS_SUFFIX}`)
  } catch {
    return null
  }
}

export const formatDraftTime = (timestamp) => {
  if (!timestamp) return ''
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} jam lalu`
  const days = Math.floor(hrs / 24)
  return `${days} hari lalu`
}
