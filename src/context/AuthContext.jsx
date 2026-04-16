import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../services/firebase.js'

// Create the context object
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the entire app and makes auth state available
 * to any component that calls useAuth().
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading]         = useState(true) // true until Firebase resolves auth state

  // Subscribe to Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    // Cleanup subscription when component unmounts
    return unsubscribe
  }, [])

  /**
   * Sign in with email and password.
   * @param {string} email
   * @param {string} password
   */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  /**
   * Register a new account and optionally set a display name.
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   */
  const register = async (email, password, displayName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(user, { displayName })
    }
    return user
  }

  /**
   * Sign out the current user.
   */
  const logout = () => signOut(auth)

  // Value exposed to all consumers
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  }

  // Don't render children until Firebase has resolved the initial auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to consume the AuthContext.
 * Must be used inside an AuthProvider.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}