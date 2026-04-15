import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from './ui/LoadingSpinner.jsx'

//guards all authentication pages if auth is still resolving show spinner, if no user logged in redirect  otherwise render child route

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen />

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute