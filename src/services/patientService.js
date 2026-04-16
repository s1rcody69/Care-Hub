// Firestore methods for patient collection operations
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
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

// Firestore collection reference for patients
const COLLECTION = 'patients'
const patientsRef = () => collection(db, COLLECTION)

/**
 * Create a new patient document in Firestore.
 * @param {Object} patientData - Patient fields (name, age, contact, medicalHistory, etc.)
 * @returns {Promise<string>} - The new document ID
 */
export const createPatient = async (patientData) => {
  const docRef = await addDoc(patientsRef(), {
    ...patientData,
    createdAt: serverTimestamp(), // auto-timestamp when record is created
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Fetch all patients ordered by creation date (newest first).
 * @returns {Promise<Array>} - Array of patient objects with their Firestore IDs
 */
export const getPatients = async () => {
  const q = query(patientsRef(), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  // Map each document to an object that includes the Firestore doc ID
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

/**
 * Fetch a single patient by their Firestore document ID.
 * @param {string} id - Firestore document ID
 * @returns {Promise<Object|null>} - Patient object or null if not found
 */
export const getPatientById = async (id) => {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

/**
 * Update an existing patient document.
 * @param {string} id - Firestore document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updatePatient = async (id, updates) => {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(), // refresh the updated timestamp
  })
}

/**
 * Delete a patient document by ID.
 * @param {string} id - Firestore document ID
 * @returns {Promise<void>}
 */
export const deletePatient = async (id) => {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}