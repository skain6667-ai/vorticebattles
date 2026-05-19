import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import InstallBanner from './components/InstallBanner'
import LoginPage from './pages/LoginPage'
import GlobalPage from './pages/GlobalPage'
import RankingPage from './pages/RankingPage'
import CompetirPage from './pages/CompetirPage'
import PerfilPage from './pages/PerfilPage'
import AdminPage from './pages/AdminPage'
import LoadingScreen from './components/LoadingScreen'

function AppRoutes() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <LoginPage />

  return (
    <div className="min-h-screen bg-black relative">
      <InstallBanner />
      <div className="pb-safe">
        <Routes>
          <Route path="/" element={<GlobalPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/competir" element={<CompetirPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
