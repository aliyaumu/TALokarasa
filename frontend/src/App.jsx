import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import PWABadge from './components/PWABadge'
import ConfirmModal from './components/modals/ConfirmModal'
import AuthModal from './components/auth/AuthModal'

import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import FavoritesPage from './pages/FavoritesPage'
import CreatePlacePage from './pages/CreatePlacePage'
import EditPlacePage from './pages/EditPlacePage'
import ProfileAboutPage from './pages/ProfileAboutPage'
import RestaurantDetail from './components/restaurant/RestaurantDetail'

import { useRestaurants } from './hooks/useRestaurants'
import { useFavorites } from './hooks/useFavorites'
import restaurantService from './services/restaurantService'
import userService from './services/userService'
import './App.css'

export default function App() {
  // Navigation State
  // Initial tab is 'home' directly (splash screen removed as requested)
  const [activeTab, setActiveTab] = useState('home') // 'home' | 'explore' | 'favorites' | 'profile' | 'add'
  const [mode, setMode] = useState('list') // 'list' | 'detail' | 'edit'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [editingRestaurant, setEditingRestaurant] = useState(null)

  // Search query & category passed from Home to Explore
  const [exploreQuery, setExploreQuery] = useState('')
  const [exploreCategory, setExploreCategory] = useState('Semua')

  // Auth & User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return userService.getUserProfile ? userService.getUserProfile() : null
    } catch {
      return null
    }
  })
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  // Deletion Modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Data fetching from Supabase / Local fallback
  const { restaurants = [], loading, error, isLocal, refetch } = useRestaurants()
  const { favorites = [], toggleFavorite, removeFavorite, clearFavorites, isFavorited, refetch: refetchFavorites } = useFavorites()

  // Sync user profile state
  useEffect(() => {
    const syncUser = () => {
      try {
        if (userService.getUserProfile) {
          setCurrentUser(userService.getUserProfile())
        }
      } catch (err) {
        console.error('Failed to sync user:', err)
      }
    }
    window.addEventListener('storage', syncUser)
    return () => window.removeEventListener('storage', syncUser)
  }, [])

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

  const handleNavigateExplore = (searchQuery = '', category = 'Semua') => {
    setExploreQuery(searchQuery)
    setExploreCategory(category)
    handleTabChange('explore')
  }

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData)
    setIsAuthOpen(false)
  }

  const handleProfileUpdate = (updatedProfile) => {
    setCurrentUser(updatedProfile)
    // Setelah keluar, data pribadi (favorit, dll) sudah dihapus -> segarkan tampilan
    if (updatedProfile && updatedProfile.isLoggedIn === false) {
      refetchFavorites()
    }
  }

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await restaurantService.deleteRestaurant(deleteTarget.id)
      // also remove from favorites if present
      if (removeFavorite) removeFavorite(deleteTarget.id)
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
      {/* Top Header Bar (Responsive for Mobile and Desktop Web) */}
      <Header
        activeTab={mode === 'list' ? activeTab : ''}
        onTabChange={handleTabChange}
        favCount={favorites.length}
        userProfile={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        isOffline={isLocal}
        onNavigateAdd={() => handleTabChange('add')}
      />

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
            userProfile={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
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
            {/* TAB 1: Beranda / Home (Image 1 & Image 4 Screen 2) */}
            {activeTab === 'home' && (
              <HomePage
                userProfile={currentUser}
                restaurants={restaurants}
                favorites={favorites}
                onSelectRestaurant={handleSelectRestaurant}
                onToggleFavorite={(r) => {
                  toggleFavorite(r)
                  refetchFavorites()
                }}
                onEditRestaurant={handleEditRestaurant}
                onDeleteRestaurant={(r) => setDeleteTarget(r)}
                onNavigateExplore={handleNavigateExplore}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}

            {/* TAB 2: Explore (Image 4 Screen 3) */}
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
                onEditRestaurant={handleEditRestaurant}
                onDeleteRestaurant={(r) => setDeleteTarget(r)}
                initialQuery={exploreQuery}
                initialCategory={exploreCategory}
                onNavigateAdd={() => handleTabChange('add')}
              />
            )}

            {/* TAB 3: Favorit (Image 2 & Image 4 Screen 6) */}
            {activeTab === 'favorites' && (
              <FavoritesPage
                favorites={favorites}
                onSelectRestaurant={handleSelectRestaurant}
                onToggleFavorite={(r) => {
                  toggleFavorite(r)
                  refetchFavorites()
                }}
                onClearFavorites={() => {
                  if (clearFavorites) clearFavorites()
                  refetchFavorites()
                }}
                onNavigateExplore={() => handleTabChange('explore')}
              />
            )}

            {/* TAB 4: Tambah Rekomendasi (CRUD Modul 1 & 2) */}
            {activeTab === 'add' && (
              <CreatePlacePage
                onBack={() => handleTabChange('home')}
                onSuccess={() => {
                  handleTabChange('home')
                  refetch()
                }}
              />
            )}

            {/* TAB 5: Profile & Tentang Aplikasi (Image 3 & Image 4 Screen 7 & 8) */}
            {activeTab === 'profile' && (
              <ProfileAboutPage
                userProfile={currentUser}
                onProfileUpdate={handleProfileUpdate}
                onOpenAuth={() => setIsAuthOpen(true)}
                favoritesCount={favorites.length}
                onNavigateFavorites={() => handleTabChange('favorites')}
              />
            )}
          </>
        )}
      </main>

      {/* Global Bottom Navigation Bar (Responsive for Mobile Screens) */}
      <BottomNav
        activeTab={mode === 'list' ? activeTab : ''}
        onTabChange={handleTabChange}
        favCount={favorites.length}
      />

      {/* Login & Register Modal Popup */}
      <AuthModal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* PWA Install / Update Notification Banner */}
      <PWABadge />

      {/* Confirmation Modal for Deletion */}
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