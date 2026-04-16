import { useState, useEffect, useCallback } from 'react'
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientById,
} from '../services/patientService.js'

/**
 * usePatients — manages the full lifecycle of patient data.
 * Provides patients list, CRUD handlers, and loading/error state.
 */
const usePatients = () => {
  const [patients, setPatients]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  // Fetch all patients from Firestore
  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPatients()
      setPatients(data)
    } catch (err) {
      setError(err.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load patients on first render
  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  /**
   * Add a new patient and refresh the list.
   * @param {Object} data - Patient form data
   * @returns {Promise<string>} - New patient ID
   */
  const addPatient = async (data) => {
    const id = await createPatient(data)
    await fetchPatients() // refresh list after creation
    return id
  }

  /**
   * Edit an existing patient and refresh the list.
   * @param {string} id
   * @param {Object} data
   */
  const editPatient = async (id, data) => {
    await updatePatient(id, data)
    await fetchPatients()
  }

  /**
   * Remove a patient by ID and refresh the list.
   * @param {string} id
   */
  const removePatient = async (id) => {
    await deletePatient(id)
    // Optimistically remove from local state for instant UI feedback
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
    editPatient,
    removePatient,
    fetchPatientByID: getPatientById,
  }
}

export default usePatients