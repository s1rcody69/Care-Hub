import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from './ui/LoadingSpinner.jsx'

/**
 * ProtectedRoute guards all authenticated pages.
 * - If auth is still resolving: show a spinner
 * - If no user is logged in: redirect to /login
 * - Otherwise: render the child route via <Outlet />
 */
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen />

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute