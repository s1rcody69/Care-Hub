import { useState, useEffect, useCallback } from 'react'
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentService.js'

/**
 * useAppointments — manages appointment data with loading/error state.
 */
const useAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  // Fetch all appointments from Firestore
  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAppointments()
      setAppointments(data)
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const addAppointment = async (data) => {
    const id = await createAppointment(data)
    await fetchAppointments()
    return id
  }

  const editAppointment = async (id, data) => {
    await updateAppointment(id, data)
    await fetchAppointments()
  }

  const removeAppointment = async (id) => {
    await deleteAppointment(id)
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    addAppointment,
    editAppointment,
    removeAppointment,
  }
}

export default useAppointments