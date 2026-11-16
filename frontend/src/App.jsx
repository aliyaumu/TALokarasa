import { useState } from 'react'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import SplashScreen from './components/common/SplashScreen'
import PWABadge from './components/PWABadge'
import ConfirmModal from './components/modals/ConfirmModal'

import ExplorePage from './pages/ExplorePage'
import RecommendationPage from './pages/RecommendationPage'
import FavoritesPage from './pages/FavoritesPage'
import CreatePlacePage from './pages/CreatePlacePage'
import EditPlacePage from './pages/EditPlacePage'
import ProfileAboutPage from './pages/ProfileAboutPage'
import RestaurantDetail from './components/restaurant/RestaurantDetail'

import { useRestaurants } from './hooks/useRestaurants'
import { useFavorites } from './hooks/useFavorites'
import restaurantService from './services/restaurantService'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('explore') // 'explore' | 'recommendations' | 'add' | 'favorites' | 'profile'
  const [mode, setMode] = useState('list') // 'list' | 'detail' | 'edit'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [editingRestaurant, setEditingRestaurant] = useState(null)

  // Deletion Modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Data fetching
  const { restaurants, loading, error, isLocal, refetch } = useRestaurants()
  const { favorites, toggleFavorite, isFavorited, refetch: refetchFavorites } = useFavorites()

  // Navigation Handlers
  const handleSelectRestaurant = (resto) => {
    setSelectedRestaurant(resto)
    setMode('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditRestaurant = (resto) => {
    setEditingRestaurant(resto)
    setMode('edit')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToList = () => {
    setMode('list')
    setSelectedRestaurant(null)
    setEditingRestaurant(null)
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setMode('list')
    setSelectedRestaurant(null)
    setEditingRestaurant(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await restaurantService.deleteRestaurant(deleteTarget.id)
      setDeleteTarget(null)
      handleBackToList()
      refetch()
      refetchFavorites()
    } catch (err) {
      alert(err.message || 'Gagal menghapus data')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="app-shell">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Top Header App Bar */}
      <Header isOffline={isLocal} />

      {/* Main Content Area */}
      <main className="app-main">
        {/* SUB-PAGE: Detail View */}
        {mode === 'detail' && selectedRestaurant && (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={handleBackToList}
            onEdit={handleEditRestaurant}
            onDelete={(r) => setDeleteTarget(r)}
            isFavorited={isFavorited(selectedRestaurant.id || selectedRestaurant.name)}
            onToggleFavorite={() => {
              toggleFavorite(selectedRestaurant)
              refetchFavorites()
            }}
          />
        )}

        {/* SUB-PAGE: Edit View */}
        {mode === 'edit' && editingRestaurant && (
          <EditPlacePage
            restaurant={editingRestaurant}
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              refetch()
            }}
          />
        )}

        {/* TOP-LEVEL TABS (Mode === 'list') */}
        {mode === 'list' && (
          <>
            {/* TAB 1: Eksplorasi (Halaman Utama 1 - List & Detail) */}
            {activeTab === 'explore' && (
              <ExplorePage
                restaurants={restaurants}
                loading={loading}
                error={error}
                refetch={refetch}
                onSelectRestaurant={handleSelectRestaurant}
                favorites={favorites}
                onToggleFavorite={(r) => {
                  toggleFavorite(r)
                  refetchFavorites()
                }}
                onNavigateAdd={() => setActiveTab('add')}
              />
            )}

            {/* TAB 2: Rekomendasi (Halaman Utama 2 - List & Detail) */}
            {activeTab === 'recommendations' && (
              <RecommendationPage
                restaurants={restaurants}
                onSelectRestaurant={handleSelectRestaurant}
                favorites={favorites}
                onToggleFavorite={(r) => {
                  toggleFavorite(r)
                  refetchFavorites()
                }}
                onNavigateExplore={() => setActiveTab('explore')}
              />
            )}

            {/* TAB 3: Tambah Rekomendasi Tempat Makan */}
            {activeTab === 'add' && (
              <CreatePlacePage
                onBack={() => setActiveTab('explore')}
                onSuccess={() => {
                  setActiveTab('explore')
                  refetch()
                }}
              />
            )}

            {/* TAB 4: Favorit / Tersimpan */}
            {activeTab === 'favorites' && (
              <FavoritesPage
                favorites={favorites}
                onSelectRestaurant={handleSelectRestaurant}
                onToggleFavorite={(r) => {
                  toggleFavorite(r)
                  refetchFavorites()
                }}
                onNavigateExplore={() => setActiveTab('explore')}
              />
            )}

            {/* TAB 5: Profil & Tentang Aplikasi Lokarasa */}
            {activeTab === 'profile' && (
              <ProfileAboutPage
                favoritesCount={favorites.length}
                onReplaySplash={() => setShowSplash(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Bottom Navigation Bar (Requirement #2) */}
      <BottomNav
        activeTab={mode === 'list' ? activeTab : ''}
        onTabChange={handleTabChange}
        favCount={favorites.length}
      />

      {/* PWA Badge & Install Banner */}
      <PWABadge />

      {/* Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Tempat Makan"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}" dari daftar Lokarasa? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Sekarang"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
