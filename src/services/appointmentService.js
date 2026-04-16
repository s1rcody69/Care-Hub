// Firestore methods for appointment collection operations
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

// Firestore collection reference for appointments
const COLLECTION = 'appointments'
const appointmentsRef = () => collection(db, COLLECTION)

/**
 * Create a new appointment document.
 * @param {Object} appointmentData - Appointment fields
 * @returns {Promise<string>} - The new document ID
 */
export const createAppointment = async (appointmentData) => {
  const docRef = await addDoc(appointmentsRef(), {
    ...appointmentData,
    status: appointmentData.status || 'scheduled',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Fetch all appointments ordered by appointment date.
 * @returns {Promise<Array>} - Array of appointment objects
 */
export const getAppointments = async () => {
  const q = query(appointmentsRef(), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

/**
 * Fetch appointments for a specific patient.
 * @param {string} patientId - The patient's Firestore document ID
 * @returns {Promise<Array>}
 */
export const getAppointmentsByPatient = async (patientId) => {
  const apptsRef = collection(db, 'appointments');


  const q = query(
    appointmentsRef(),
    where('patientId', '==', patientId),
    orderBy('date', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

/**
 * Fetch a single appointment by ID.
 * @param {string} id - Firestore document ID
 * @returns {Promise<Object|null>}
 */
export const getAppointmentById = async (id) => {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

/**
 * Update an existing appointment document.
 * @param {string} id - Firestore document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateAppointment = async (id, updates) => {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete an appointment document by ID.
 * @param {string} id - Firestore document ID
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (id) => {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}